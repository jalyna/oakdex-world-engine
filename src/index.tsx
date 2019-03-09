import * as React from 'react'

import { MapData, Walkability } from './MapData'
import { Char, CharState, getInitialCharState } from './CharData'
import draw from './draw'
import timeout from './timeout'
import getNextCoordinates from './getNextCoordinates'
import getDir, { getOppositeDir } from './getDir'
import calculateViewport from './calculateViewport'
import isNextFieldWalkable from './isNextFieldWalkable'

export { MapData, CharState, Walkability }

export interface Coordinates {
  x: number,
  y: number
}

export enum Direction {
  Up = 1,
  Down = 2,
  Left = 3,
  Right = 4
}

export interface CoordinatesWithSpecial extends Coordinates {
  special: string
}

export interface CoordinatesWithLooksAt extends CoordinatesWithSpecial {
  looksAt: Coordinates
}

export interface CoordinateChange {
  prev: CoordinatesWithSpecial,
  next: CoordinatesWithLooksAt
}

export interface Viewport {
  width: number,
  height: number
}

interface MoveCharOptions {
  msPerFrame?: number
}

export interface ActionHandler {
  moveChar: (charId: string, dir: Direction, options?: MoveCharOptions) => Promise<boolean>,
  changeCharDir: (charId: string, dir: Direction) => Promise<undefined>,
  disableMovement: () => void,
  enableMovement: () => void
}

export interface WorldEngineProps {
  mapData: MapData,
  viewport: Viewport,
  controllableChar: Char,
  chars: Char[],
  onWalksTo?: (charId: string, change: CoordinateChange) => void,
  onPressEnter?: (charId: string, triggeredChar: CharState) => void,
  onOver?: (charId: string, triggeredChar: CharState) => void,
  onLoaded?: (actionHandler: ActionHandler) => void
}

export interface WorldEngineState {
  chars: CharState[],
  pressedKey: Direction | null,
  otherPressedKeys: Direction[],
  disabledMovement?: boolean
}

export const TILE_SIZE = 16
export const FRAMES_PER_STEP = 3
export const FRAME_DURATION = 90

export default class WorldEngine extends React.Component<WorldEngineProps, WorldEngineState> {
  constructor (props: WorldEngineProps) {
    super(props)
    this.state = {
      chars: [getInitialCharState(props.controllableChar)].concat(props.chars.map((c) => getInitialCharState(c))),
      pressedKey: null,
      otherPressedKeys: []
    }
    this.onKeyDown = this.onKeyDown.bind(this)
    this.onKeyUp = this.onKeyUp.bind(this)
    this.tick = this.tick.bind(this)
    this.moveChar = this.moveChar.bind(this)
    this.changeCharDir = this.changeCharDir.bind(this)
  }

  private canvas = React.createRef<HTMLCanvasElement>()
  private interval: number | null
  private actionHandler: ActionHandler

  render () {
    const { top, left } = calculateViewport(this.props.viewport, this.props.mapData, this.controllableChar)
    return (
      <div style={{
        overflow: 'hidden',
        width: this.props.viewport.width * TILE_SIZE,
        height: this.props.viewport.height * TILE_SIZE,
        position: 'relative'
      }}>
        <div style={{
          position: 'absolute',
          left: left,
          top: top
        }}>
          <div style={{
            position: 'relative',
            imageRendering: 'pixelated',
            width: this.props.mapData.width * TILE_SIZE,
            height: this.props.mapData.height * TILE_SIZE,
            backgroundImage: 'url(' + this.props.mapData.mapBackgroundImage + ')'
          }}>
            <canvas
              ref={this.canvas}
              width={this.props.mapData.width * TILE_SIZE}
              height={this.props.mapData.height * TILE_SIZE}
              style={{ imageRendering: 'pixelated', position: 'absolute' }} />
          </div>
        </div>
      </div>
    )
  }

  pressEnter () {
    const hoverChar = this.state.chars.find((c) => c.id !== this.controllableChar.id && c.x === this.controllableChar.x && c.y === this.controllableChar.y)
    if (hoverChar && this.props.onPressEnter) {
      this.props.onPressEnter(this.controllableChar.id, { ...hoverChar })
    }
    const nextCoordinates = getNextCoordinates(this.state.chars)
    const nextChar = this.state.chars.find((c) => c.x === nextCoordinates.x && c.y === nextCoordinates.y && !c.walkThrough)
    if (nextChar) {
      if (!nextChar.lookNotInDirection) {
        this.changeChar(nextChar.id, { dir: getOppositeDir(this.controllableChar.dir) })
      }
      if (this.props.onPressEnter) {
        this.props.onPressEnter(this.controllableChar.id, { ...nextChar })
      }
    }
  }

  onKeyDown (e: KeyboardEvent) {
    if (e.key === 'Enter' || e.key === ' ') {
      this.pressEnter()
      return
    }

    const dir = getDir(e)

    if (!dir) {
      return
    }

    this.setState({
      pressedKey: dir,
      otherPressedKeys: this.state.otherPressedKeys.slice()
        .concat(this.state.pressedKey ? [this.state.pressedKey] : null)
    })

    if (!this.interval) {
      this.tick()
      this.interval = window.setInterval(this.tick, FRAME_DURATION)
    }
  }

  onKeyUp (e: KeyboardEvent) {
    let dir = getDir(e)

    if (!dir) {
      return
    }

    let otherPressedKeys = this.state.otherPressedKeys.slice().filter((d) => d !== dir)
    const lastKey = otherPressedKeys[otherPressedKeys.length - 1]
    otherPressedKeys = otherPressedKeys.filter((d) => d !== lastKey)

    this.setState({
      pressedKey: lastKey || null,
      otherPressedKeys
    })
  }

  changeCharDir (charId: string, dir: Direction): Promise<undefined> {
    return new Promise((resolve) => {
      this.changeChar(charId, { dir })
      setTimeout(resolve, FRAME_DURATION)
    })
  }

  moveChar (charId: string, dir: Direction, options?: MoveCharOptions): Promise<boolean> {
    options = options || {}
    return new Promise(async(resolve) => {
      const char = this.state.chars.find((c) => c.id === charId)
      if (!char) {
        resolve(false)
        return
      }
      if (char.dir !== dir) {
        await this.changeCharDir(charId, dir)
      }

      if (!isNextFieldWalkable(this.props.mapData, this.state.chars, charId)) {
        resolve(false)
        return
      }

      for (let i = 1; i < FRAMES_PER_STEP; i++) {
        this.changeChar(charId, { progressFrame: i, animationFrame: i })
        await timeout(options.msPerFrame || FRAME_DURATION)
      }
      this.finishStep(char.id)
      await timeout(options.msPerFrame || FRAME_DURATION)
      resolve(true)
    })
  }

  componentDidMount () {
    this.redraw()
    document.addEventListener('keydown', this.onKeyDown)
    document.addEventListener('keyup', this.onKeyUp)
    this.interval = window.setInterval(this.tick, FRAME_DURATION)
    this.actionHandler = {
      moveChar: this.moveChar,
      changeCharDir: this.changeCharDir,
      disableMovement: () => this.setState({ disabledMovement: true }),
      enableMovement: () => this.setState({ disabledMovement: false })
    }
    if (this.props.onLoaded) {
      this.props.onLoaded(this.actionHandler)
    }
  }

  componentWillUnmount () {
    clearInterval(this.interval)
    this.interval = null
    document.removeEventListener('keydown', this.onKeyDown)
    document.removeEventListener('keyup', this.onKeyUp)
  }

  componentDidUpdate () {
    this.redraw()
  }

  nextCharProgress () {
    if (this.controllableChar.progressFrame === FRAMES_PER_STEP - 1) {
      this.finishStep()
      return
    }
    this.changeControllableChar({
      progressFrame: this.controllableChar.progressFrame + 1,
      animationFrame: this.controllableChar.animationFrame + 1
    })
  }

  nextCharAnimation () {
    if (this.controllableChar.animationFrame === FRAMES_PER_STEP - 1) {
      this.changeControllableChar({ animationFrame: 0 })
      return
    }
    this.changeControllableChar({
      animationFrame: this.controllableChar.animationFrame + 1
    })
  }

  get controllableChar (): CharState {
    return this.state.chars[0]
  }

  changeControllableChar (newFields: object) {
    this.setState({
      chars: [{
        ...this.controllableChar,
        ...newFields
      }].concat(this.state.chars.slice(1, this.state.chars.length))
    })
  }

  changeChar (charId: string, newFields: object) {
    const chars = this.state.chars.slice().map((c) => {
      if (c.id === charId) {
        return {
          ...c,
          ...newFields
        }
      }
      return c
    })
    this.setState({ chars })
  }

  clearAnimation () {
    clearInterval(this.interval)
    this.interval = null
  }

  triggerOnWalksTo (charId: string, oldCoordinates: Coordinates) {
    if (this.props.onOver) {
      const overChar = this.state.chars.find((c) => c.id !== this.controllableChar.id && c.x === this.controllableChar.x && c.y === this.controllableChar.y)
      if (overChar) {
        this.props.onOver(charId, { ...overChar })
      }
    }
    if (!this.props.onWalksTo) {
      return
    }
    this.props.onWalksTo(charId, {
      prev: {
        ...oldCoordinates,
        special: this.props.mapData.specialTiles[oldCoordinates.y][oldCoordinates.x] || null 
      },
      next: {
        looksAt: getNextCoordinates(this.state.chars),
        x: this.controllableChar.x,
        y: this.controllableChar.y,
        special: this.props.mapData.specialTiles[this.controllableChar.y][this.controllableChar.x] || null
      }
    })
  }

  finishStep (charId?: string) {
    let char = this.controllableChar
    if (charId) {
      char = this.state.chars.find((c) => c.id === charId)
    }
    const { x, y } = getNextCoordinates(this.state.chars, char.id)
    const prevX = char.x
    const prevY = char.y
    this.changeChar(char.id, { x, y, progressFrame: 0, animationFrame: 0 })
    this.triggerOnWalksTo(char.id, { x: prevX, y: prevY })
  }

  tick () {
    // in-between, animate
    if (this.controllableChar.progressFrame !== 0) {
      this.nextCharProgress()
      return
    }
    if (this.controllableChar.animationFrame !== 0) {
      this.nextCharAnimation()
      return
    }
    // Final Step => clear interval
    if (!this.state.pressedKey) {
      this.clearAnimation()
      return
    }
    // Forbid Movement
    if (this.state.disabledMovement) {
      return
    }
    // First press => change dir only
    if (this.controllableChar.dir !== this.state.pressedKey) {
      this.changeControllableChar({ dir: this.state.pressedKey })
      this.triggerOnWalksTo(this.controllableChar.id, { x: this.controllableChar.x, y: this.controllableChar.y })
      return
    }
    // Can not walk to next field
    if (!isNextFieldWalkable(this.props.mapData, this.state.chars, this.controllableChar.id)) {
      this.changeControllableChar({
        animationFrame: 1
      })
      return
    }
    // Second press => start to walk
    this.changeControllableChar({
      progressFrame: 1,
      animationFrame: 1
    })
  }

  redraw () {
    if (!this.canvas.current) {
      return
    }
    draw(
      this.canvas.current,
      this.props.mapData,
      this.state.chars
    )
  }
}

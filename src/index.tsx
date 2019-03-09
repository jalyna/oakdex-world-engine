import * as React from 'react'

import draw from './draw'
import calculateViewport from './calculateViewport'

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

export interface Char extends Coordinates {
  id: string,
  image: string,
  name?: string,
  dir?: Direction,
  walkThrough?: boolean,
  lookNotInDirection?: boolean
}

export interface Credit {
  name: string,
  url?: string
}

export interface Walkability {
  top: number,
  left: number,
  right: number,
  bottom: number
}

export interface MapData {
  title: string,
  width: number,
  height: number,
  mapBackgroundImage: string, // base64
  mapForegroundImage: string, // base64
  walkability: Walkability[][],
  specialTiles: (string | null)[][],
  credits?: Credit[]
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

export interface CharState extends Coordinates {
  id: string,
  dir: Direction,
  image: string,
  animationFrame: number,
  progressFrame: number,
  name?: string,
  walkThrough?: boolean,
  lookNotInDirection?: boolean
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

function getInitialCharState (char: Char): CharState {
  return {
    ...char,
    dir: char.dir || Direction.Down,
    animationFrame: 0,
    progressFrame: 0
  }
}

function timeout (ms: number): Promise<undefined> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

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

  getDir (e: KeyboardEvent): Direction | null {
    switch (e.key) {
      case 'ArrowUp':
      case 'w':
        return Direction.Up
      case 'ArrowDown':
      case 's':
        return Direction.Down
      case 'ArrowLeft':
      case 'a':
        return Direction.Left
      case 'ArrowRight':
      case 'd':
        return Direction.Right
    }

    return null
  }



  pressEnter () {
    const hoverChar = this.state.chars.find((c) => c.id !== this.controllableChar.id && c.x === this.controllableChar.x && c.y === this.controllableChar.y)
    if (hoverChar && this.props.onPressEnter) {
      this.props.onPressEnter(this.controllableChar.id, { ...hoverChar })
    }
    const nextCoordinates = this.getNextCoordinates()
    const nextChar = this.state.chars.find((c) => c.x === nextCoordinates.x && c.y === nextCoordinates.y && !c.walkThrough)
    if (nextChar) {
      if (!nextChar.lookNotInDirection) {
        this.changeChar(nextChar.id, { dir: this.getOppositeDir() })
      }
      if (this.props.onPressEnter) {
        this.props.onPressEnter(this.controllableChar.id, { ...nextChar })
      }
    }
  }

  onKeyDown (e: KeyboardEvent) {
    if (e.key === 'Enter') {
      this.pressEnter()
      return
    }

    const dir = this.getDir(e)

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
      this.interval = setInterval(this.tick, FRAME_DURATION)
    }
  }

  onKeyUp (e: KeyboardEvent) {
    let dir = this.getDir(e)

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

      if (!this.isNextFieldWalkable(charId)) {
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
    this.interval = setInterval(this.tick, FRAME_DURATION)
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
        looksAt: this.getNextCoordinates(),
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
    const { x, y } = this.getNextCoordinates(char.id)
    const prevX = char.x
    const prevY = char.y
    this.changeChar(char.id, { x, y, progressFrame: 0, animationFrame: 0 })
    this.triggerOnWalksTo(char.id, { x: prevX, y: prevY })
  }

  getNextCoordinates (charId?: string): Coordinates {
    let char = this.controllableChar
    if (charId) {
      char = this.state.chars.find((c) => c.id === charId)
    }
    let x = char.x
    let y = char.y
    switch (char.dir) {
      case Direction.Left:
        x = x - 1
        break
      case Direction.Right:
        x = x + 1
        break
      case Direction.Down:
        y = y + 1
        break
      case Direction.Up:
        y = y - 1
        break
    }
    return { x, y }
  }

  getOppositeDir (): Direction {
    switch (this.controllableChar.dir) {
      case Direction.Left:
        return Direction.Right
      case Direction.Right:
        return Direction.Left
      case Direction.Down:
        return Direction.Up
      case Direction.Up:
        return Direction.Down
    }
  }

  getFieldData (x: number, y: number): Walkability {
    const existingChar = this.state.chars.some((c) => c.x === x && c.y === y && !c.walkThrough)
    if (existingChar) {
      return {
        top: 1,
        left: 1,
        right: 1,
        bottom: 1
      }
    }
    return this.props.mapData.walkability[y][x]
  }

  isNextFieldWalkable (charId: string): boolean {
    const { x, y } = this.getNextCoordinates(charId)
    const fieldData = this.getFieldData(x, y)
    switch (this.controllableChar.dir) {
      case Direction.Left:
        return fieldData.right === 0
      case Direction.Right:
        return fieldData.left === 0
      case Direction.Down:
        return fieldData.top === 0
      case Direction.Up:
        return fieldData.bottom === 0
    }
    return false
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
    if (!this.isNextFieldWalkable(this.controllableChar.id)) {
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

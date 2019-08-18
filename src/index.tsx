import * as React from 'react'

import { Char, CharState, getInitialCharState } from './CharData'
import draw from './draw'
import timeout from './timeout'
import findPath from './findPath'
import getNextCoordinates from './getNextCoordinates'
import getDir, { getOppositeDir } from './getDir'
import calculateViewport from './calculateViewport'
import isNextFieldWalkable from './isNextFieldWalkable'
import TouchPad from './TouchPad'

export { CharState, timeout }

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
  credits?: {
    title: string,
    url?: string
  }[],
  chars?: Char[],
  gifLayer?: {
    tilesets: {
      [titlesetTitle: string]: {
        imageBase64: string,
        versions?: {
          name: string,
          imageBase64: string
        }[]
      }
    },
    fields: {
      x: number,
      y: number,
      tilesetTitle: string,
      tilesetX: number,
      tilesetY: number
    }[]
  }
}

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
  moveCharTo: (charId: string, x: number, y: number, options?: MoveCharOptions) => Promise<boolean>,
  hideChar: (charId: string) => void,
  showChar: (charId: string) => void,
  disableMovement: () => void,
  enableMovement: () => void
}

export type EventType = 'talk' | 'walkOver' | 'mapEnter'

export interface WorldEngineProps {
  mapData: MapData,
  viewport: Viewport,
  controllableChar: Char,
  chars: Char[],
  onWalksTo?: (charId: string, change: CoordinateChange) => void,
  onPressEnter?: (charId: string, triggeredChar: CharState) => void,
  onOver?: (charId: string, triggeredChar: CharState) => void,
  onLoaded?: (actionHandler: ActionHandler) => void,
  onEvent?: (charId: string, eventType: EventType, event: object) => void
}

export interface WorldEngineState {
  chars: CharState[],
  pressedKey: Direction | null,
  otherPressedKeys: Direction[],
  disabledMovement?: boolean
}

export const TILE_SIZE = 16
export const FRAMES_PER_STEP = 6
export const FRAME_DURATION = 70

export default class WorldEngine extends React.Component<WorldEngineProps, WorldEngineState> {
  constructor (props: WorldEngineProps) {
    super(props)
    this.state = {
      chars: [getInitialCharState(props.controllableChar)].concat((props.mapData.chars || []).concat(props.chars).map((c) => getInitialCharState(c))),
      pressedKey: null,
      otherPressedKeys: []
    }
    this.onKeyDown = this.onKeyDown.bind(this)
    this.onKeyUp = this.onKeyUp.bind(this)
    this.tick = this.tick.bind(this)
    this.moveChar = this.moveChar.bind(this)
    this.moveCharTo = this.moveCharTo.bind(this)
    this.changeCharDir = this.changeCharDir.bind(this)
    this.onMouseDown = this.onMouseDown.bind(this)
    this.onMouseUp = this.onMouseUp.bind(this)
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
            <div style={{
              imageRendering: 'pixelated',
              position: 'absolute',
              width: this.props.mapData.width * TILE_SIZE,
              height: this.props.mapData.height * TILE_SIZE
            }}>{this.renderGifLayer()}</div>
            <canvas
              ref={this.canvas}
              width={this.props.mapData.width * TILE_SIZE}
              height={this.props.mapData.height * TILE_SIZE}
              style={{ imageRendering: 'pixelated', position: 'absolute' }} />
          </div>
        </div>
        <TouchPad onMouseDown={this.onMouseDown} onMouseUp={this.onMouseUp} />
      </div>
    )
  }

  renderGifLayer () {
    if (!this.props.mapData.gifLayer) {
      return
    }

    return this.props.mapData.gifLayer.fields.map(field => {
      const tileset = this.props.mapData.gifLayer.tilesets[field.tilesetTitle]
      if (!tileset) {
        return
      }
      return (<div key={field.x + '_' + field.y} className={`oakdex-world-engine--tileset--${field.tilesetTitle.replace(/\s+/g, '')}`} style={{
        position: 'absolute',
        width: TILE_SIZE,
        height: TILE_SIZE,
        top: (field.y * TILE_SIZE),
        left: (field.x * TILE_SIZE),
        backgroundPosition: '-' + (field.tilesetX * TILE_SIZE) + 'px -' + (field.tilesetY * TILE_SIZE) + 'px'
      }}></div>)
    })
  }

  addCssClasses() {
    if (!this.props.mapData.gifLayer) {
      return
    }

    document.head.innerHTML += `<style>
      ${Object.keys(this.props.mapData.gifLayer.tilesets).map(tilesetId => {
        return `
          .oakdex-world-engine--tileset--${tilesetId.replace(/\s+/g, '')} {
            background-image: url(${this.props.mapData.gifLayer.tilesets[tilesetId].imageBase64});
          }
        `
      })}
    </style>`
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
      if (this.props.onEvent && nextChar.event && nextChar.event.onTalk) {
        this.props.onEvent(nextChar.id, 'talk', nextChar.event.onTalk)
      }
    }
  }

  onMouseDown (dir: Direction | string) {
    if (dir === 'Enter') {
      this.pressEnter()
      return
    }

    if (typeof dir !== 'string') {
      this.pressDir(dir)
    }
  }

  onMouseUp (dir: Direction | string) {
    if (typeof dir !== 'string') {
      this.stopPressDir(dir)
    }
  }

  stopPressDir (dir: Direction) {
    let otherPressedKeys = this.state.otherPressedKeys.slice().filter((d) => d !== dir)
    const lastKey = otherPressedKeys[otherPressedKeys.length - 1]
    otherPressedKeys = otherPressedKeys.filter((d) => d !== lastKey)

    this.setState({
      pressedKey: lastKey || null,
      otherPressedKeys
    })
  }

  pressDir (dir: Direction) {
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

  onKeyDown (e: KeyboardEvent) {
    if (e.key === 'Enter' || e.key === ' ') {
      this.pressEnter()
      return
    }

    const dir = getDir(e)

    if (dir) {
      this.pressDir(dir)
    }
  }

  onKeyUp (e: KeyboardEvent) {
    let dir = getDir(e)

    if (dir) {
      this.stopPressDir(dir)
    }
  }

  changeCharDir (charId: string, dir: Direction): Promise<undefined> {
    return new Promise((resolve) => {
      this.changeChar(charId, { dir })
      setTimeout(resolve, FRAME_DURATION)
    })
  }

  moveCharTo (charId: string, x: number, y: number, options?: MoveCharOptions): Promise<boolean> {
    options = options || {}
    return new Promise(async(resolve) => {
      const char = this.state.chars.find((c) => c.id === charId)
      if (!char) {
        resolve(false)
        return
      }

      const dirs = findPath(this.props.mapData, this.state.chars, charId, x, y)

      for (let i = 0; i < dirs.length; i++) {
        await this.moveChar(charId, dirs[i], options)
      }

      resolve(true)
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
    this.addCssClasses()
    this.redraw()
    document.addEventListener('keydown', this.onKeyDown)
    document.addEventListener('keyup', this.onKeyUp)
    this.interval = window.setInterval(this.tick, FRAME_DURATION)
    this.actionHandler = {
      moveChar: this.moveChar,
      moveCharTo: this.moveCharTo,
      changeCharDir: this.changeCharDir,
      disableMovement: () => this.setState({ disabledMovement: true }),
      enableMovement: () => this.setState({ disabledMovement: false }),
      hideChar: (charId: string) => this.changeChar(charId, { hidden: true }),
      showChar: (charId: string) => this.changeChar(charId, { hidden: false })
    }
    if (this.props.onLoaded) {
      this.props.onLoaded(this.actionHandler)
    }
    this.state.chars.forEach((char: CharState) => {
      if (char.event && char.event.onMapEnter && !char.hidden && this.props.onEvent) {
        this.props.onEvent(char.id, 'mapEnter', char.event.onMapEnter)
      }
    })
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
    const overChar = this.state.chars.find((c) => c.id !== this.controllableChar.id && c.x === this.controllableChar.x && c.y === this.controllableChar.y)
    if (overChar) {
      if (this.props.onOver) {
        this.props.onOver(charId, { ...overChar })
      }
      if (overChar && this.props.onEvent && overChar.event && overChar.event.onWalkOver) {
        this.props.onEvent(overChar.id, 'walkOver', overChar.event.onWalkOver)
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

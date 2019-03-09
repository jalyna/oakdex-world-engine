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

export interface CoordinatesWithLooksAt extends Coordinates {
  looksAt: Coordinates,
  special: string
}

export interface CoordinateChange {
  prev: CoordinatesWithLooksAt,
  next: CoordinatesWithLooksAt
}

export interface Char extends Coordinates {
  image: string,
  name?: string,
  dir?: Direction
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

export interface WorldEngineProps {
  mapData: MapData,
  viewport: Viewport,
  controllableChar: Char,
  chars: Char[],
  onWalksTo: (change: CoordinateChange) => void,
  onPressEnter: (current: CoordinatesWithLooksAt) => void
}

export interface CharState extends Coordinates {
  dir: Direction,
  animationFrame: number,
  progressFrame: number
}

export interface WorldEngineState {
  chars: CharState[],
  pressedKey: Direction | null,
  otherPressedKeys: Direction[]
}

export const TILE_SIZE = 16
export const FRAMES_PER_STEP = 3
export const FRAME_DURATION = 90

function getInitialCharState ({ x, y, dir }: Char): CharState {
  return {
    x,
    y,
    dir: dir || Direction.Down,
    animationFrame: 0,
    progressFrame: 0
  }
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
  }

  private canvas = React.createRef<HTMLCanvasElement>()
  private interval: number | null

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

  onKeyDown (e: KeyboardEvent) {
    let dir = this.getDir(e)

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

  componentDidMount () {
    this.redraw()
    document.addEventListener('keydown', this.onKeyDown)
    document.addEventListener('keyup', this.onKeyUp)
    this.interval = setInterval(this.tick, FRAME_DURATION)
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

  clearAnimation () {
    clearInterval(this.interval)
    this.interval = null
  }

  finishStep () {
    const { x, y } = this.getNextCoordinates()
    this.changeControllableChar({ x, y, progressFrame: 0, animationFrame: 0 })
  }

  getNextCoordinates (): Coordinates {
    let x = this.controllableChar.x
    let y = this.controllableChar.y
    switch (this.controllableChar.dir) {
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

  getFieldData (x: number, y: number): Walkability {
    const existingChar = this.state.chars.some((c) => c.x === x && c.y === y)
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

  isNextFieldWalkable (): boolean {
    const { x, y } = this.getNextCoordinates()
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
    // First press => change dir only
    if (this.controllableChar.dir !== this.state.pressedKey) {
      this.changeControllableChar({ dir: this.state.pressedKey })
      return
    }
    // Can not walk to next field
    if (!this.isNextFieldWalkable()) {
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

  getAllChars (): Char[] {
    let chars = this.props.chars.slice()
    chars.unshift(this.props.controllableChar)
    return chars
  }

  redraw () {
    if (!this.canvas.current) {
      return
    }
    draw(
      this.canvas.current,
      this.props.mapData,
      this.getAllChars(),
      this.state.chars
    )
  }
}

import * as React from 'react'

import draw from './draw'

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
  percent: number // 0-100
}

export interface WorldEngineState {
  chars: CharState[],
  pressedKey: Direction | null
}

export const TILE_SIZE = 16

function getInitialCharState ({ x, y, dir }: Char): CharState {
  return {
    x,
    y,
    dir: dir || Direction.Down,
    percent: 100
  }
}

export default class WorldEngine extends React.Component<WorldEngineProps, WorldEngineState> {
  constructor (props: WorldEngineProps) {
    super(props)
    this.state = {
      chars: [getInitialCharState(props.controllableChar)].concat(props.chars.map((c) => getInitialCharState(c))),
      pressedKey: null
    }
    this.onKeyDown = this.onKeyDown.bind(this)
    this.onKeyUp = this.onKeyUp.bind(this)
    this.tick = this.tick.bind(this)
  }

  private canvas = React.createRef<HTMLCanvasElement>()
  private interval: number | null

  render () {
    return (
      <canvas
        ref={this.canvas}
        width={this.props.viewport.width * TILE_SIZE}
        height={this.props.viewport.height * TILE_SIZE}
        style={{ imageRendering: 'pixelated' }} />
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
      pressedKey: dir
    })

    if (!this.interval) {
      this.interval = setInterval(this.tick, 200)
    }
  }

  onKeyUp (e: KeyboardEvent) {
    let dir = this.getDir(e)

    if (!dir) {
      return
    }

    this.setState({
      pressedKey: null
    })
  }

  componentDidMount () {
    this.redraw()
    document.addEventListener('keydown', this.onKeyDown)
    document.addEventListener('keyup', this.onKeyUp)
    this.interval = setInterval(this.tick, 200)
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

  nextCharAnimation () {

  }

  get controllableChar (): CharState {
    return this.state.chars[0]
  }

  tick () {
    if (this.controllableChar.percent < 100) {
      this.nextCharAnimation()
      return
    }
    if (!this.state.pressedKey) {
      return
    }
    this.setState({
      chars: [{
        ...this.controllableChar,
        dir: this.state.pressedKey
      }].concat(this.state.chars.slice(1, this.state.chars.length))
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

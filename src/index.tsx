import * as React from 'react'

import draw from './draw'

export interface Coordinates {
  x: number,
  y: number
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
  looksTo?: string // top, bottom, left, right
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

export interface ControllableCharState extends Coordinates {
  dir: string, // top, left, right, bottom
  oldX: number,
  oldY: number,
  percent: number // 0-100
}

export interface WorldEngineState {
  controllableChar: ControllableCharState,
  pressedKeys: {
    top: boolean,
    left: boolean,
    right: boolean,
    bottom: boolean
  }
}

export const TILE_SIZE = 16

export default class WorldEngine extends React.Component<WorldEngineProps, WorldEngineState> {
  constructor (props: WorldEngineProps) {
    super(props)
    this.state = {
      controllableChar: {
        x: props.controllableChar.x,
        y: props.controllableChar.y,
        oldX: props.controllableChar.x,
        oldY: props.controllableChar.y,
        percent: 100,
        dir: props.controllableChar.looksTo || 'bottom'
      },
      pressedKeys: {
        top: false,
        left: false,
        right: false,
        bottom: false
      }
    }
  }

  private canvas = React.createRef<HTMLCanvasElement>()

  render () {
    return (
      <canvas
        ref={this.canvas}
        width={this.props.viewport.width * TILE_SIZE}
        height={this.props.viewport.height * TILE_SIZE}
        style={{ imageRendering: 'pixelated' }} />
    )
  }

  componentDidMount () {
    this.redraw()
  }

  componentDidUpdate () {
    this.redraw()
  }

  redraw () {
    if (!this.canvas.current) {
      return
    }
    draw(this.canvas.current, this.props.mapData, this.state.controllableChar)
  }
}

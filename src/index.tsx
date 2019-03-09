import * as React from 'react'

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

export const TILE_SIZE = 16

export default class WorldEngine extends React.Component<WorldEngineProps, {}> {
  constructor (props: WorldEngineProps) {
    super(props)
  }

  private canvas = React.createRef<HTMLCanvasElement>()

  render () {
    return (
      <canvas
        ref={this.canvas}
        width={this.props.viewport.width * TILE_SIZE}
        height={this.props.viewport.height * TILE_SIZE} />
    )
  }
}

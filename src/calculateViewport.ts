import { TILE_SIZE, MapData, ControllableCharState } from '.'

export interface Offsets {
  top: number,
  left: number
}

function clamp (value: number, min: number, max: number): number {
  if (value < min) return min
  else if (value > max) return max
  return value
}

export default function (canvas: HTMLCanvasElement, mapData: MapData, charState: ControllableCharState): Offsets {
  return {
    top: clamp((charState.y * TILE_SIZE) - canvas.height/2, 0, (mapData.height * TILE_SIZE) - canvas.height),
    left: clamp((charState.x * TILE_SIZE) - canvas.width/2, 0, (mapData.width * TILE_SIZE) - canvas.width)
  }
}

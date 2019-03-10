import { TILE_SIZE, Viewport, MapData, CharState } from '.'
import calculateProgressOffset from './calculateProgressOffset'

export interface Offsets {
  top: number,
  left: number
}

function clamp (value: number, min: number, max: number): number {
  if (value < min) return min
  else if (value > max) return max
  return value
}

export default function (viewport: Viewport, mapData: MapData, charState: CharState): Offsets {
  const offset = calculateProgressOffset(charState)
  const y = charState.y * TILE_SIZE + offset.y
  const x = charState.x * TILE_SIZE + offset.x

  return {
    top: clamp(-y + (viewport.height * TILE_SIZE)/2, -(mapData.height * TILE_SIZE) + (viewport.height * TILE_SIZE), 0),
    left: clamp(-x + (viewport.width * TILE_SIZE)/2, -(mapData.width * TILE_SIZE) + (viewport.width * TILE_SIZE), 0)
  }
}

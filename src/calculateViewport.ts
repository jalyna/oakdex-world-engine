import { TILE_SIZE, FRAMES_PER_STEP, Viewport, MapData, CharState, Direction } from '.'

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
  let y = charState.y * TILE_SIZE
  let x = charState.x * TILE_SIZE

  if (charState.frame < FRAMES_PER_STEP) {
    switch (charState.dir) {
      case Direction.Left:
        x = x - (charState.frame / FRAMES_PER_STEP) * TILE_SIZE
        break
      case Direction.Right:
        x = x + (charState.frame / FRAMES_PER_STEP) * TILE_SIZE
        break
      case Direction.Down:
        y = y + (charState.frame / FRAMES_PER_STEP) * TILE_SIZE
        break
      case Direction.Up:
        y = y - (charState.frame / FRAMES_PER_STEP) * TILE_SIZE
        break
    }
  }

  console.log(-y + viewport.height/2)

  return {
    top: clamp(-y + (viewport.height * TILE_SIZE)/2, -(mapData.height * TILE_SIZE) + (viewport.height * TILE_SIZE), 0),
    left: clamp(-x + (viewport.width * TILE_SIZE)/2, -(mapData.width * TILE_SIZE) + (viewport.width * TILE_SIZE), 0)
  }
}

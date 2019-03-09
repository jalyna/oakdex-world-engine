import { TILE_SIZE, FRAMES_PER_STEP, MapData, CharState, Direction } from '.'

export interface Offsets {
  top: number,
  left: number
}

function clamp (value: number, min: number, max: number): number {
  if (value < min) return min
  else if (value > max) return max
  return value
}

export default function (canvas: HTMLCanvasElement, mapData: MapData, charState: CharState): Offsets {
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

  return {
    top: clamp(y - canvas.height/2, 0, (mapData.height * TILE_SIZE) - canvas.height),
    left: clamp(x - canvas.width/2, 0, (mapData.width * TILE_SIZE) - canvas.width)
  }
}

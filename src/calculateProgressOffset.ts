import { CharState, FRAMES_PER_STEP, TILE_SIZE, Direction } from '.'

export default function (charState: CharState): { x: number, y: number } {
  let x = 0
  let y = 0

  if (charState.progressFrame < FRAMES_PER_STEP) {
    switch (charState.dir) {
      case Direction.Left:
        x = x - Math.floor(charState.progressFrame / FRAMES_PER_STEP * TILE_SIZE)
        break
      case Direction.Right:
        x = x + Math.floor(charState.progressFrame / FRAMES_PER_STEP * TILE_SIZE)
        break
      case Direction.Down:
        y = y + Math.floor(charState.progressFrame / FRAMES_PER_STEP * TILE_SIZE)
        break
      case Direction.Up:
        y = y - Math.floor(charState.progressFrame / FRAMES_PER_STEP * TILE_SIZE)
        break
    }
  }

  return { x, y }
}

import { CharState, TILE_SIZE, FRAMES_PER_STEP, Direction } from '.'

interface Offsets {
  top: number,
  left: number
}

const CHAR_SIZE = 32

function calculateCharsetOffset (dir: Direction, frame: number): Offsets {
  let top = CHAR_SIZE * 0
  let left = CHAR_SIZE * 1
  switch (dir) {
    case Direction.Left:
      top = CHAR_SIZE * 1
      break
    case Direction.Right:
      top = CHAR_SIZE * 2
      break
    case Direction.Up:
      top = CHAR_SIZE * 3
      break
  }
  if (frame !== 0) {
    if (frame%2 === 0) {
      left = CHAR_SIZE * 0
    } else {
      left = CHAR_SIZE * 2
    }
  }
  return {
    top,
    left
  }
}

export default function drawChar (ctx: CanvasRenderingContext2D, image: HTMLImageElement, charState: CharState) {
  const { top, left } = calculateCharsetOffset(charState.dir || Direction.Down, charState.frame)
  let x = charState.x * TILE_SIZE
  let y = charState.y * TILE_SIZE

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

  ctx.drawImage(
    image,
    left, top, CHAR_SIZE, CHAR_SIZE,
    x - 8, y - 16, CHAR_SIZE, CHAR_SIZE
  )
}

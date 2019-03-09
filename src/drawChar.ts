import { CharState, TILE_SIZE, Direction } from '.'

interface Offsets {
  top: number,
  left: number
}

const CHAR_SIZE = 32

function calculateCharsetOffset (dir: Direction, percent: number): Offsets {
  let top = CHAR_SIZE * 0
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
  return {
    top,
    left: CHAR_SIZE * 1
  }
}

export default function drawChar (ctx: CanvasRenderingContext2D, viewportOffset: Offsets, image: HTMLImageElement, charState: CharState) {
  const { top, left } = calculateCharsetOffset(charState.dir || Direction.Down, 100)
  const x = charState.x * TILE_SIZE - viewportOffset.left
  const y = charState.y * TILE_SIZE - viewportOffset.top

  ctx.drawImage(
    image,
    left, top, CHAR_SIZE, CHAR_SIZE,
    x - 8, y - 16, CHAR_SIZE, CHAR_SIZE
  )
}

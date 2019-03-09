import { Char, TILE_SIZE } from '.'

interface Offsets {
  top: number,
  left: number
}

const CHAR_SIZE = 32

function calculateCharsetOffset (dir: string, percent: number): Offsets {
  let top = CHAR_SIZE * 0
  switch (dir) {
    case 'left':
      top = CHAR_SIZE * 1
      break
    case 'right':
      top = CHAR_SIZE * 2
      break
    case 'top':
      top = CHAR_SIZE * 3
      break
  }
  return {
    top,
    left: CHAR_SIZE * 1
  }
}

export default function drawChar (ctx: CanvasRenderingContext2D, viewportOffset: Offsets, image: HTMLImageElement, char: Char) {
  const { top, left } = calculateCharsetOffset(char.looksTo || 'bottom', 100)
  const x = char.x * TILE_SIZE - viewportOffset.left
  const y = char.y * TILE_SIZE - viewportOffset.top

  ctx.drawImage(
    image,
    left, top, CHAR_SIZE, CHAR_SIZE,
    x - 8, y - 16, CHAR_SIZE, CHAR_SIZE
  )
}

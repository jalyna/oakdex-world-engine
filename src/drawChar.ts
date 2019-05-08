import { CharState, TILE_SIZE, Direction } from '.'
import calculateProgressOffset from './calculateProgressOffset'

interface Offsets {
  top: number,
  left: number
}

const CHAR_SIZE = 32

function calculateCharsetOffset (dir: Direction, frame: number, image: HTMLImageElement): Offsets {
  if (image.width === 160) {
    return calculateCharsetOffsetDetailed(dir, frame)
  }
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

function calculateCharsetOffsetDetailed (dir: Direction, frame: number): Offsets {
  let top = CHAR_SIZE * 0
  let left = CHAR_SIZE * 0
  switch (dir) {
    case Direction.Left:
      top = CHAR_SIZE * 2
      break
    case Direction.Right:
      top = CHAR_SIZE * 3
      break
    case Direction.Up:
      top = CHAR_SIZE * 1
      break
  }
  console.log(frame)
  left = CHAR_SIZE * (frame%5)
  return {
    top,
    left
  }
}

export default function drawChar (ctx: CanvasRenderingContext2D, image: HTMLImageElement, charState: CharState) {
  const { top, left } = calculateCharsetOffset(charState.dir || Direction.Down, charState.animationFrame, image)
  const offset = calculateProgressOffset(charState)
  const x = charState.x * TILE_SIZE + offset.x
  const y = charState.y * TILE_SIZE + offset.y

  ctx.drawImage(
    image,
    left, top, CHAR_SIZE, CHAR_SIZE,
    x - 8, y - 16, CHAR_SIZE, CHAR_SIZE
  )

  if (charState.name) {
    ctx.font = 'normal 8px Verdana'
    ctx.textAlign = 'center'
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)'
    ctx.fillText(charState.name, x + 8, y + 24, 100)
  }
}

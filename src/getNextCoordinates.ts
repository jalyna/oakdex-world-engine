import { Coordinates, CharState, Direction } from '.'

export default function (chars: CharState[], charId?: string): Coordinates {
  let char = chars[0]
  if (charId) {
    char = chars.find((c) => c.id === charId)
  }
  let x = char.x
  let y = char.y
  switch (char.dir) {
    case Direction.Left:
      x = x - 1
      break
    case Direction.Right:
      x = x + 1
      break
    case Direction.Down:
      y = y + 1
      break
    case Direction.Up:
      y = y - 1
      break
  }
  return { x, y }
}

import { Direction } from '.'

export function getOppositeDir (dir: Direction): Direction {
  switch (dir) {
    case Direction.Left:
      return Direction.Right
    case Direction.Right:
      return Direction.Left
    case Direction.Down:
      return Direction.Up
    case Direction.Up:
      return Direction.Down
  }
}

export default function (e: KeyboardEvent): Direction | null {
  switch (e.key) {
    case 'ArrowUp':
    case 'w':
      return Direction.Up
    case 'ArrowDown':
    case 's':
      return Direction.Down
    case 'ArrowLeft':
    case 'a':
      return Direction.Left
    case 'ArrowRight':
    case 'd':
      return Direction.Right
  }

  return null
}

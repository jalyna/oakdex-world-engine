import { CharState, Walkability, MapData, Direction } from '.'
import getNextCoordinates from './getNextCoordinates'

const BLOCKED = {
  top: 1,
  left: 1,
  right: 1,
  bottom: 1
}

function getFieldData (mapData: MapData, chars: CharState[], x: number, y: number): Walkability {
  const existingChar = chars.some((c) => c.x === x && c.y === y && !c.walkThrough && !c.hidden)
  if (existingChar) {
    return BLOCKED
  }
  return mapData.walkability[y][x] || BLOCKED
}

export function isFieldWalkable (mapData: MapData, chars: CharState[], charId: string, x: number, y: number): boolean {
  const otherChars = chars.filter((c) => c.id !== charId)
  const fieldData = getFieldData(mapData, otherChars, x, y)
  const char = chars.find((c) => c.id === charId)
  switch (char.dir) {
    case Direction.Left:
      return fieldData.right === 0
    case Direction.Right:
      return fieldData.left === 0
    case Direction.Down:
      return fieldData.top === 0
    case Direction.Up:
      return fieldData.bottom === 0
  }
  return false
}

export default function (mapData: MapData, chars: CharState[], charId: string): boolean {
  const { x, y } = getNextCoordinates(chars, charId)
  return isFieldWalkable(mapData, chars, charId, x, y)
}

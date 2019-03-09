import { CharState, Walkability, MapData, Direction } from '.'
import getNextCoordinates from './getNextCoordinates'

function getFieldData (mapData: MapData, chars: CharState[], x: number, y: number): Walkability {
  const existingChar = chars.some((c) => c.x === x && c.y === y && !c.walkThrough)
  if (existingChar) {
    return {
      top: 1,
      left: 1,
      right: 1,
      bottom: 1
    }
  }
  return mapData.walkability[y][x]
}

export default function (mapData: MapData, chars: CharState[], charId: string): boolean {
  const { x, y } = getNextCoordinates(chars, charId)
  const fieldData = getFieldData(mapData, chars, x, y)
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

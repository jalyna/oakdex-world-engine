import { Grid, BestFirstFinder } from 'pathfinding'

import { MapData, CharState, Direction } from '.'
import { isFieldWalkable } from './isNextFieldWalkable'

function dirBetweenPoints(x: number, y: number, x2: number, y2: number): Direction {
  if (y > y2) {
    return Direction.Up
  }
  if (y < y2) {
    return Direction.Down
  }
  if (x > x2) {
    return Direction.Left
  }
  if (x < x2) {
    return Direction.Right
  }
}

export default function (mapData: MapData, chars: CharState[], charId: string, x: number, y: number): Direction[] {
  const grid = new Grid(mapData.width, mapData.height)
  mapData.walkability.forEach((row, y) => {
    row.forEach((field, x) => {
      if (!isFieldWalkable(mapData, chars, charId, x, y)) {
        grid.setWalkableAt(x, y, false)
      }
    })
  })
  const finder = new BestFirstFinder()
  const char = chars.find((c) => c.id === charId)
  let lastCoord = null as null | number[]
  return finder.findPath(char.x, char.y, x, y, grid).map((coord) => {
    if (!lastCoord) {
      lastCoord = coord
      return null
    }
    const dir = dirBetweenPoints(lastCoord[0], lastCoord[1], coord[0], coord[1])
    lastCoord = coord
    return dir
  }).filter((d) => d)
}

import getNextCoordinates from '../getNextCoordinates'
import { Direction } from '..'

describe('.getNextCoordinates', () => {
  it('returns next left pos', () => {
    const chars = [{
      id: 'bar',
      dir: Direction.Left,
      x: 3,
      y: 4
    } as any]

    expect(getNextCoordinates(chars, 'bar')).toEqual({ x: 2, y: 4 })
  })

  it('returns next right pos', () => {
    const chars = [{
      id: 'bar',
      dir: Direction.Right,
      x: 3,
      y: 4
    } as any]

    expect(getNextCoordinates(chars, 'bar')).toEqual({ x: 4, y: 4 })
  })

  it('returns next up pos', () => {
    const chars = [{
      id: 'bar',
      dir: Direction.Up,
      x: 3,
      y: 4
    } as any]

    expect(getNextCoordinates(chars, 'bar')).toEqual({ x: 3, y: 3 })
  })

  it('returns next down pos', () => {
    const chars = [{
      id: 'bar',
      dir: Direction.Down,
      x: 3,
      y: 4
    } as any]

    expect(getNextCoordinates(chars, 'bar')).toEqual({ x: 3, y: 5 })
  })
})

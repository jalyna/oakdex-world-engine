import calculateProgressOffset from '../calculateProgressOffset'
import { CharState, Direction } from '..'

describe('.calculateProgressOffset', () => {
  it('is 0 if nothing in progress', () => {
    const char = {
      dir: Direction.Left,
      progressFrame: 0
    } as any
    expect(calculateProgressOffset(char)).toEqual({ x: 0, y: 0 })
  })

  it('changes x if left and in progress', () => {
    const char = {
      dir: Direction.Left,
      progressFrame: 1
    } as any
    expect(calculateProgressOffset(char)).toEqual({ x: -5, y: 0 })
  })

  it('changes x if right and in progress', () => {
    const char = {
      dir: Direction.Right,
      progressFrame: 1
    } as any
    expect(calculateProgressOffset(char)).toEqual({ x: 5, y: 0 })
  })

  it('changes y if up and in progress', () => {
    const char = {
      dir: Direction.Up,
      progressFrame: 1
    } as any
    expect(calculateProgressOffset(char)).toEqual({ x: 0, y: -5 })
  })

  it('changes y if down and in progress', () => {
    const char = {
      dir: Direction.Down,
      progressFrame: 1
    } as any
    expect(calculateProgressOffset(char)).toEqual({ x: 0, y: 5 })
  })
})

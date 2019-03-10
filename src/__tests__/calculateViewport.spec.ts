import calculateViewport from '../calculateViewport'
import { Direction } from '..'

describe('.calculateViewport', () => {
  it('calculates viewport offsets', () => {
    const viewport = {
      width: 3,
      height: 3
    }
    const mapData = {
      height: 10,
      width: 8
    } as any
    const charState = {
      dir: Direction.Left,
      progressFrame: 0,
      y: 5,
      x: 4
    } as any
    expect(calculateViewport(viewport, mapData, charState)).toEqual({ top: -56, left: -40 })
  })

  it('calculates viewport offsets when player is in right bottom corner', () => {
    const viewport = {
      width: 3,
      height: 3
    }
    const mapData = {
      height: 10,
      width: 8
    } as any
    const charState = {
      dir: Direction.Left,
      progressFrame: 0,
      y: 9,
      x: 7
    } as any
    expect(calculateViewport(viewport, mapData, charState)).toEqual({ top: -112, left: -80 })
  })

  it('calculates viewport offsets when player is in left top corner', () => {
    const viewport = {
      width: 3,
      height: 3
    }
    const mapData = {
      height: 10,
      width: 8
    } as any
    const charState = {
      dir: Direction.Left,
      progressFrame: 0,
      y: 0,
      x: 0
    } as any
    expect(calculateViewport(viewport, mapData, charState)).toEqual({ top: 0, left: 0 })
  })
})

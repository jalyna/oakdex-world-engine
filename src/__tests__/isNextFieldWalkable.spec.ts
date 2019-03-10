import isNextFieldWalkable from '../isNextFieldWalkable'
import { Direction } from '..'

describe('.isNextFieldWalkable', () => {
  it('returns true if not blocked', () => {
    const chars = [{
      id: 'bar',
      dir: Direction.Right,
      x: 0,
      y: 0
    } as any]
    const mapData = {
      walkability: [
        [{ top: 0, left: 0, right: 0, bottom: 0 }, { top: 0, left: 0, right: 0, bottom: 0 }]
      ]
    } as any

    expect(isNextFieldWalkable(mapData, chars, 'bar')).toBe(true)
  })

  it('returns false if field outside of map', () => {
    const chars = [{
      id: 'bar',
      dir: Direction.Left,
      x: 0,
      y: 0
    } as any]
    const mapData = {
      walkability: [
        [{ top: 0, left: 0, right: 0, bottom: 0 }, { top: 0, left: 0, right: 0, bottom: 0 }]
      ]
    } as any

    expect(isNextFieldWalkable(mapData, chars, 'bar')).toBe(false)
  })

  it('returns false if field is blocked', () => {
    const chars = [{
      id: 'bar',
      dir: Direction.Right,
      x: 0,
      y: 0
    } as any]
    const mapData = {
      walkability: [
        [{ top: 0, left: 0, right: 0, bottom: 0 }, { top: 1, left: 1, right: 1, bottom: 1 }]
      ]
    } as any

    expect(isNextFieldWalkable(mapData, chars, 'bar')).toBe(false)
  })

  it('returns false if blocked by another char', () => {
    const chars = [{
      id: 'bar',
      dir: Direction.Right,
      x: 0,
      y: 0
    } as any,
    {
      x: 1,
      y: 0
    } as any]
    const mapData = {
      walkability: [
        [{ top: 0, left: 0, right: 0, bottom: 0 }, { top: 0, left: 0, right: 0, bottom: 0 }]
      ]
    } as any

    expect(isNextFieldWalkable(mapData, chars, 'bar')).toBe(false)
  })

  it('returns true if blocked by another char but walkThrough', () => {
    const chars = [{
      id: 'bar',
      dir: Direction.Right,
      x: 0,
      y: 0
    } as any,
    {
      x: 1,
      y: 0,
      walkThrough: true
    } as any]
    const mapData = {
      walkability: [
        [{ top: 0, left: 0, right: 0, bottom: 0 }, { top: 0, left: 0, right: 0, bottom: 0 }]
      ]
    } as any

    expect(isNextFieldWalkable(mapData, chars, 'bar')).toBe(true)
  })
})

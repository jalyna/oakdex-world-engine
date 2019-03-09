import drawChar from '../drawChar'
import { CharState, Direction } from '..'

describe('.drawChar', () => {
  it('draws simple character', () => {
    const img = new Image()
    const ctx = {
      drawImage: jest.fn()
    } as any
    const charState = {
      dir: Direction.Left,
      animationFrame: 0,
      progressFrame: 0,
      x: 3,
      y: 4
    } as CharState
    drawChar(ctx, img, charState)
    expect(ctx.drawImage).toHaveBeenCalledWith(img, 32, 32, 32, 32, 40, 48, 32, 32)
  })

  it('draws within frame', () => {
    const img = new Image()
    const ctx = {
      drawImage: jest.fn()
    } as any
    const charState = {
      dir: Direction.Up,
      animationFrame: 1,
      progressFrame: 1,
      x: 3,
      y: 4
    } as CharState
    drawChar(ctx, img, charState)
    expect(ctx.drawImage).toHaveBeenCalledWith(img, 64, 96, 32, 32, 40, 43, 32, 32)
  })

  it('draws name', () => {
    const img = new Image()
    const ctx = {
      drawImage: jest.fn(),
      fillText: jest.fn()
    } as any
    const charState = {
      dir: Direction.Up,
      animationFrame: 0,
      progressFrame: 0,
      x: 3,
      y: 4,
      name: 'Some Name'
    } as CharState
    drawChar(ctx, img, charState)
    expect(ctx.fillText).toHaveBeenCalledWith('Some Name', 56, 88, 100)
  })
})

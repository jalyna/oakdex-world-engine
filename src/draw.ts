import { MapData, CharState, Char } from '.'
import calculateViewport from './calculateViewport'
import drawChar from './drawChar'

interface LoadedImages {
  [key: string]: HTMLImageElement
}

let loadedImages = {} as LoadedImages
let currentMap = null as null | string

function loadImage (key: string, src: string) {
  return new Promise((resolve) => {
    if (loadedImages[key]) {
      resolve()
      return
    }
    const img = new Image()
    img.src = src
    loadedImages[key] = img
    img.onload = () => resolve()
  })
}

function loadImages (mapData: MapData, chars: Char[]) {
  if (currentMap !== mapData.title) {
    loadedImages = {}
    currentMap = mapData.title
  }

  return Promise.all([
    loadImage('foreground', mapData.mapForegroundImage),
    loadImage('background', mapData.mapBackgroundImage)
  ].concat(chars.map((c, i) => loadImage('char' + i, c.image))))
}

export default function (canvas: HTMLCanvasElement, mapData: MapData, chars: Char[], charStates: CharState[]) {
  const ctx = canvas.getContext('2d')

  loadImages(mapData, chars).then(() => {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.fillStyle = 'black'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    const { top, left } = calculateViewport(canvas, mapData, charStates[0])
    ctx.drawImage(
      loadedImages.background,
      left, top, canvas.width, canvas.height,
      0, 0, canvas.width, canvas.height
    )
    charStates.forEach((charState, i) => {
      drawChar(ctx, { top, left }, loadedImages['char' + i], charState)
    })
    ctx.drawImage(
      loadedImages.foreground,
      left, top, canvas.width, canvas.height,
      0, 0, canvas.width, canvas.height
    )
  })
}

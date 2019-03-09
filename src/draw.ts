import { MapData, CharState, Char } from '.'
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
    ctx.drawImage(
      loadedImages.background,
      0, 0, canvas.width, canvas.height,
      0, 0, canvas.width, canvas.height
    )
    charStates.forEach((charState, i) => {
      drawChar(ctx, loadedImages['char' + i], charState)
    })
    ctx.drawImage(
      loadedImages.foreground,
      0, 0, canvas.width, canvas.height,
      0, 0, canvas.width, canvas.height
    )
  })
}

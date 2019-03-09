import { MapData, CharState } from '.'
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

function loadImages (mapData: MapData, chars: CharState[]) {
  if (currentMap !== mapData.title) {
    loadedImages = {}
    currentMap = mapData.title
  }

  return Promise.all([
    loadImage('foreground', mapData.mapForegroundImage)
  ].concat(chars.map((c) => loadImage('char-' + c.id, c.image))))
}

export default function (canvas: HTMLCanvasElement, mapData: MapData, charStates: CharState[]) {
  const ctx = canvas.getContext('2d')

  loadImages(mapData, charStates).then(() => {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    const sortedCharStates = charStates.slice().sort((a, b) => {
      if (a.walkThrough === b.walkThrough) {
        return a.y <= b.y ? -1 : 1
      }
      return a.walkThrough ? -1 : 1
    })
    sortedCharStates.forEach((charState) => {
      drawChar(ctx, loadedImages['char-' + charState.id], charState)
    })
    ctx.drawImage(
      loadedImages.foreground,
      0, 0, canvas.width, canvas.height,
      0, 0, canvas.width, canvas.height
    )
  })
}

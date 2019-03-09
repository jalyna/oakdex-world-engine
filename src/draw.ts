import { MapData, ControllableCharState } from '.'
import calculateViewport from './calculateViewport'

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

function loadImages (mapData: MapData) {
  if (currentMap !== mapData.title) {
    loadedImages = {}
    currentMap = mapData.title
  }

  return Promise.all([
    loadImage('foreground', mapData.mapForegroundImage),
    loadImage('background', mapData.mapBackgroundImage)
  ])
}

export default function (canvas: HTMLCanvasElement, mapData: MapData, charState: ControllableCharState) {
  const ctx = canvas.getContext('2d')

  loadImages(mapData).then(() => {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.fillStyle = 'black'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    const { top, left } = calculateViewport(canvas, mapData, charState)
    ctx.drawImage(
      loadedImages.background,
      left, top, canvas.width, canvas.height,
      0, 0, canvas.width, canvas.height
    )
    ctx.drawImage(
      loadedImages.foreground,
      left, top, canvas.width, canvas.height,
      0, 0, canvas.width, canvas.height
    )
  })
}

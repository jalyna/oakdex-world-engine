export interface Walkability {
  top: number,
  left: number,
  right: number,
  bottom: number
}

export interface MapData {
  title: string,
  width: number,
  height: number,
  mapBackgroundImage: string, // base64
  mapForegroundImage: string, // base64
  walkability: Walkability[][],
  specialTiles: (string | null)[][],
  credits?:  {
    name: string,
    url?: string
  }[]
}

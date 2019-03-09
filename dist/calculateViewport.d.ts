import { Viewport, MapData, CharState } from '.';
export interface Offsets {
    top: number;
    left: number;
}
export default function (viewport: Viewport, mapData: MapData, charState: CharState): Offsets;

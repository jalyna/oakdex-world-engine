import * as React from 'react';
export interface Coordinates {
    x: number;
    y: number;
}
export interface CoordinatesWithLooksAt extends Coordinates {
    looksAt: Coordinates;
    special: string;
}
export interface CoordinateChange {
    prev: CoordinatesWithLooksAt;
    next: CoordinatesWithLooksAt;
}
export interface Char extends Coordinates {
    image: string;
    name?: string;
    looksTo?: string;
}
export interface Credit {
    name: string;
    url?: string;
}
export interface Walkability {
    top: number;
    left: number;
    right: number;
    bottom: number;
}
export interface MapData {
    title: string;
    width: number;
    height: number;
    mapBackgroundImage: string;
    mapForegroundImage: string;
    walkability: Walkability[][];
    specialTiles: (string | null)[][];
    credits?: Credit[];
}
export interface Viewport {
    width: number;
    height: number;
}
export interface WorldEngineProps {
    mapData: MapData;
    viewport: Viewport;
    controllableChar: Char;
    chars: Char[];
    onWalksTo: (change: CoordinateChange) => void;
    onPressEnter: (current: CoordinatesWithLooksAt) => void;
}
export declare const TILE_SIZE = 16;
export default class WorldEngine extends React.Component<WorldEngineProps, {}> {
    constructor(props: WorldEngineProps);
    private canvas;
    render(): JSX.Element;
}

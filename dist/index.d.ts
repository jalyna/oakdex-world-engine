import * as React from 'react';
import { Char, CharState } from './CharData';
import timeout from './timeout';
export { CharState, timeout };
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
    credits?: {
        title: string;
        url?: string;
    }[];
    chars?: Char[];
}
export interface Coordinates {
    x: number;
    y: number;
}
export declare enum Direction {
    Up = 1,
    Down = 2,
    Left = 3,
    Right = 4
}
export interface CoordinatesWithSpecial extends Coordinates {
    special: string;
}
export interface CoordinatesWithLooksAt extends CoordinatesWithSpecial {
    looksAt: Coordinates;
}
export interface CoordinateChange {
    prev: CoordinatesWithSpecial;
    next: CoordinatesWithLooksAt;
}
export interface Viewport {
    width: number;
    height: number;
}
interface MoveCharOptions {
    msPerFrame?: number;
}
export interface ActionHandler {
    moveChar: (charId: string, dir: Direction, options?: MoveCharOptions) => Promise<boolean>;
    changeCharDir: (charId: string, dir: Direction) => Promise<undefined>;
    moveCharTo: (charId: string, x: number, y: number, options?: MoveCharOptions) => Promise<boolean>;
    hideChar: (charId: string) => void;
    showChar: (charId: string) => void;
    disableMovement: () => void;
    enableMovement: () => void;
}
export interface WorldEngineProps {
    mapData: MapData;
    viewport: Viewport;
    controllableChar: Char;
    chars: Char[];
    onWalksTo?: (charId: string, change: CoordinateChange) => void;
    onPressEnter?: (charId: string, triggeredChar: CharState) => void;
    onOver?: (charId: string, triggeredChar: CharState) => void;
    onLoaded?: (actionHandler: ActionHandler) => void;
}
export interface WorldEngineState {
    chars: CharState[];
    pressedKey: Direction | null;
    otherPressedKeys: Direction[];
    disabledMovement?: boolean;
}
export declare const TILE_SIZE = 16;
export declare const FRAMES_PER_STEP = 3;
export declare const FRAME_DURATION = 90;
export default class WorldEngine extends React.Component<WorldEngineProps, WorldEngineState> {
    constructor(props: WorldEngineProps);
    private canvas;
    private interval;
    private actionHandler;
    render(): JSX.Element;
    pressEnter(): void;
    onMouseDown(dir: Direction | string): void;
    onMouseUp(dir: Direction | string): void;
    stopPressDir(dir: Direction): void;
    pressDir(dir: Direction): void;
    onKeyDown(e: KeyboardEvent): void;
    onKeyUp(e: KeyboardEvent): void;
    changeCharDir(charId: string, dir: Direction): Promise<undefined>;
    moveCharTo(charId: string, x: number, y: number, options?: MoveCharOptions): Promise<boolean>;
    moveChar(charId: string, dir: Direction, options?: MoveCharOptions): Promise<boolean>;
    componentDidMount(): void;
    componentWillUnmount(): void;
    componentDidUpdate(): void;
    nextCharProgress(): void;
    nextCharAnimation(): void;
    readonly controllableChar: CharState;
    changeControllableChar(newFields: object): void;
    changeChar(charId: string, newFields: object): void;
    clearAnimation(): void;
    triggerOnWalksTo(charId: string, oldCoordinates: Coordinates): void;
    finishStep(charId?: string): void;
    tick(): void;
    redraw(): void;
}

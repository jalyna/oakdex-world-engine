import { Direction, Coordinates } from '.';
export interface Char extends Coordinates {
    id: string;
    image: string;
    name?: string;
    dir?: Direction;
    walkThrough?: boolean;
    lookNotInDirection?: boolean;
    hidden?: boolean;
    event?: {
        onTalk?: object;
        onWalkOver?: object;
        onMapEnter?: object;
    };
}
export interface CharState extends Char {
    dir: Direction;
    animationFrame: number;
    progressFrame: number;
}
export declare function getInitialCharState(char: Char): CharState;

/// <reference types="react" />
import { Direction } from '.';
declare global {
    interface Window {
        DocumentTouch: any;
    }
}
export interface TouchPadProps {
    onMouseDown: (dir: Direction | string) => void;
    onMouseUp: (dir: Direction | string) => void;
}
export default function ({ onMouseDown, onMouseUp }: TouchPadProps): JSX.Element;

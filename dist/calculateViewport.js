"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _1 = require(".");
function clamp(value, min, max) {
    if (value < min)
        return min;
    else if (value > max)
        return max;
    return value;
}
function default_1(viewport, mapData, charState) {
    let y = charState.y * _1.TILE_SIZE;
    let x = charState.x * _1.TILE_SIZE;
    if (charState.progressFrame < _1.FRAMES_PER_STEP) {
        switch (charState.dir) {
            case _1.Direction.Left:
                x = x - Math.floor(charState.progressFrame / _1.FRAMES_PER_STEP * _1.TILE_SIZE);
                break;
            case _1.Direction.Right:
                x = x + Math.floor(charState.progressFrame / _1.FRAMES_PER_STEP * _1.TILE_SIZE);
                break;
            case _1.Direction.Down:
                y = y + Math.floor(charState.progressFrame / _1.FRAMES_PER_STEP * _1.TILE_SIZE);
                break;
            case _1.Direction.Up:
                y = y - Math.floor(charState.progressFrame / _1.FRAMES_PER_STEP * _1.TILE_SIZE);
                break;
        }
    }
    return {
        top: clamp(-y + (viewport.height * _1.TILE_SIZE) / 2, -(mapData.height * _1.TILE_SIZE) + (viewport.height * _1.TILE_SIZE), 0),
        left: clamp(-x + (viewport.width * _1.TILE_SIZE) / 2, -(mapData.width * _1.TILE_SIZE) + (viewport.width * _1.TILE_SIZE), 0)
    };
}
exports.default = default_1;
//# sourceMappingURL=calculateViewport.js.map
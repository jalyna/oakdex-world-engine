"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _1 = require(".");
function default_1(charState) {
    let x = 0;
    let y = 0;
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
    return { x, y };
}
exports.default = default_1;
//# sourceMappingURL=calculateProgressOffset.js.map
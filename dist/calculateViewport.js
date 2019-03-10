"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _1 = require(".");
const calculateProgressOffset_1 = require("./calculateProgressOffset");
function clamp(value, min, max) {
    if (value < min)
        return min;
    else if (value > max)
        return max;
    return value;
}
function default_1(viewport, mapData, charState) {
    const offset = calculateProgressOffset_1.default(charState);
    const y = charState.y * _1.TILE_SIZE + offset.y;
    const x = charState.x * _1.TILE_SIZE + offset.x;
    return {
        top: clamp(-y + (viewport.height * _1.TILE_SIZE) / 2, -(mapData.height * _1.TILE_SIZE) + (viewport.height * _1.TILE_SIZE), 0),
        left: clamp(-x + (viewport.width * _1.TILE_SIZE) / 2, -(mapData.width * _1.TILE_SIZE) + (viewport.width * _1.TILE_SIZE), 0)
    };
}
exports.default = default_1;
//# sourceMappingURL=calculateViewport.js.map
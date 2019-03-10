"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _1 = require(".");
const CHAR_SIZE = 32;
function calculateCharsetOffset(dir, frame) {
    let top = CHAR_SIZE * 0;
    let left = CHAR_SIZE * 1;
    switch (dir) {
        case _1.Direction.Left:
            top = CHAR_SIZE * 1;
            break;
        case _1.Direction.Right:
            top = CHAR_SIZE * 2;
            break;
        case _1.Direction.Up:
            top = CHAR_SIZE * 3;
            break;
    }
    if (frame !== 0) {
        if (frame % 2 === 0) {
            left = CHAR_SIZE * 0;
        }
        else {
            left = CHAR_SIZE * 2;
        }
    }
    return {
        top,
        left
    };
}
function drawChar(ctx, image, charState) {
    const { top, left } = calculateCharsetOffset(charState.dir || _1.Direction.Down, charState.animationFrame);
    let x = charState.x * _1.TILE_SIZE;
    let y = charState.y * _1.TILE_SIZE;
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
    ctx.drawImage(image, left, top, CHAR_SIZE, CHAR_SIZE, x - 8, y - 16, CHAR_SIZE, CHAR_SIZE);
    if (charState.name) {
        ctx.font = 'normal 8px Verdana';
        ctx.textAlign = 'center';
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillText(charState.name, x + 8, y + 24, 100);
    }
}
exports.default = drawChar;
//# sourceMappingURL=drawChar.js.map
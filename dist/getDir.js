"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _1 = require(".");
function getOppositeDir(dir) {
    switch (dir) {
        case _1.Direction.Left:
            return _1.Direction.Right;
        case _1.Direction.Right:
            return _1.Direction.Left;
        case _1.Direction.Down:
            return _1.Direction.Up;
        case _1.Direction.Up:
            return _1.Direction.Down;
    }
}
exports.getOppositeDir = getOppositeDir;
function default_1(e) {
    switch (e.key) {
        case 'ArrowUp':
        case 'w':
            return _1.Direction.Up;
        case 'ArrowDown':
        case 's':
            return _1.Direction.Down;
        case 'ArrowLeft':
        case 'a':
            return _1.Direction.Left;
        case 'ArrowRight':
        case 'd':
            return _1.Direction.Right;
    }
    return null;
}
exports.default = default_1;
//# sourceMappingURL=getDir.js.map
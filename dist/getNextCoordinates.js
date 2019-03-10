"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _1 = require(".");
function default_1(chars, charId) {
    let char = chars[0];
    if (charId) {
        char = chars.find((c) => c.id === charId);
    }
    let x = char.x;
    let y = char.y;
    switch (char.dir) {
        case _1.Direction.Left:
            x = x - 1;
            break;
        case _1.Direction.Right:
            x = x + 1;
            break;
        case _1.Direction.Down:
            y = y + 1;
            break;
        case _1.Direction.Up:
            y = y - 1;
            break;
    }
    return { x, y };
}
exports.default = default_1;
//# sourceMappingURL=getNextCoordinates.js.map
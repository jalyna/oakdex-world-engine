"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _1 = require(".");
const getNextCoordinates_1 = require("./getNextCoordinates");
const BLOCKED = {
    top: 1,
    left: 1,
    right: 1,
    bottom: 1
};
function getFieldData(mapData, chars, x, y) {
    const existingChar = chars.some((c) => c.x === x && c.y === y && !c.walkThrough && !c.hidden);
    if (existingChar) {
        return BLOCKED;
    }
    return mapData.walkability[y][x] || BLOCKED;
}
function isFieldWalkable(mapData, chars, charId, x, y) {
    const otherChars = chars.filter((c) => c.id !== charId);
    const fieldData = getFieldData(mapData, otherChars, x, y);
    const char = chars.find((c) => c.id === charId);
    switch (char.dir) {
        case _1.Direction.Left:
            return fieldData.right === 0;
        case _1.Direction.Right:
            return fieldData.left === 0;
        case _1.Direction.Down:
            return fieldData.top === 0;
        case _1.Direction.Up:
            return fieldData.bottom === 0;
    }
    return false;
}
exports.isFieldWalkable = isFieldWalkable;
function default_1(mapData, chars, charId) {
    const { x, y } = getNextCoordinates_1.default(chars, charId);
    return isFieldWalkable(mapData, chars, charId, x, y);
}
exports.default = default_1;
//# sourceMappingURL=isNextFieldWalkable.js.map
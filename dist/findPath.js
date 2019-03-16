"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pathfinding_1 = require("pathfinding");
const _1 = require(".");
const isNextFieldWalkable_1 = require("./isNextFieldWalkable");
function dirBetweenPoints(x, y, x2, y2) {
    if (y > y2) {
        return _1.Direction.Up;
    }
    if (y < y2) {
        return _1.Direction.Down;
    }
    if (x > x2) {
        return _1.Direction.Left;
    }
    if (x < x2) {
        return _1.Direction.Right;
    }
}
function default_1(mapData, chars, charId, x, y) {
    const grid = new pathfinding_1.Grid(mapData.width, mapData.height);
    mapData.walkability.forEach((row, y) => {
        row.forEach((field, x) => {
            if (!isNextFieldWalkable_1.isFieldWalkable(mapData, chars, charId, x, y)) {
                grid.setWalkableAt(x, y, false);
            }
        });
    });
    const finder = new pathfinding_1.BestFirstFinder();
    const char = chars.find((c) => c.id === charId);
    let lastCoord = null;
    return finder.findPath(char.x, char.y, x, y, grid).map((coord) => {
        if (!lastCoord) {
            lastCoord = coord;
            return null;
        }
        const dir = dirBetweenPoints(lastCoord[0], lastCoord[1], coord[0], coord[1]);
        lastCoord = coord;
        return dir;
    }).filter((d) => d);
}
exports.default = default_1;
//# sourceMappingURL=findPath.js.map
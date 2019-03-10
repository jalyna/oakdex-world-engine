"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _1 = require(".");
function getInitialCharState(char) {
    return Object.assign({}, char, { dir: char.dir || _1.Direction.Down, animationFrame: 0, progressFrame: 0 });
}
exports.getInitialCharState = getInitialCharState;
//# sourceMappingURL=CharData.js.map
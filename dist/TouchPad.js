"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const _1 = require(".");
function isTouchDevice() {
    return !!(typeof window !== 'undefined' && ('ontouchstart' in window || window.DocumentTouch && typeof document !== 'undefined' && document instanceof window.DocumentTouch)) || !!(typeof navigator !== 'undefined' && (navigator.maxTouchPoints || navigator.msMaxTouchPoints));
}
const BUTTON_SIZE = 32;
const BUTTON_STYLE = {
    outline: 'none',
    border: 0,
    boxSizing: 'border-box',
    textAlign: 'center',
    padding: 0,
    margin: 1,
    fontFamily: 'Verdana',
    fontSize: 24,
    lineHeight: BUTTON_SIZE - 2 + 'px',
    borderRadius: '5px',
    background: 'rgba(255, 255, 255, 0.6)',
    color: 'rgba(0, 0, 0, 0.8)',
    width: BUTTON_SIZE - 2,
    height: BUTTON_SIZE - 2,
    position: 'absolute',
    userSelect: 'none',
    MozUserSelect: 'none',
    WebkitUserSelect: 'none',
    WebkitTouchCallOut: 'none'
};
const BIG_BUTTON_STYLE = Object.assign({}, BUTTON_STYLE, { fontSize: 40, lineHeight: BUTTON_SIZE * 1.5 - 2 + 'px', width: BUTTON_SIZE * 1.5 - 2, height: BUTTON_SIZE * 1.5 - 2 });
function default_1({ onMouseDown, onMouseUp }) {
    if (!isTouchDevice()) {
        return null;
    }
    return (React.createElement(React.Fragment, null,
        React.createElement("div", { style: {
                position: 'absolute',
                left: 8,
                bottom: 8
            } },
            React.createElement("div", { style: {
                    position: 'relative',
                    width: BUTTON_SIZE * 3,
                    height: BUTTON_SIZE * 3
                } },
                React.createElement("button", { style: Object.assign({}, BUTTON_STYLE, { top: BUTTON_SIZE * 0, left: BUTTON_SIZE * 1 }), onContextMenu: (e) => e.preventDefault(), onTouchStart: onMouseDown.bind(this, _1.Direction.Up), onTouchEnd: onMouseUp.bind(this, _1.Direction.Up) }, "\u21E7"),
                React.createElement("button", { style: Object.assign({}, BUTTON_STYLE, { top: BUTTON_SIZE * 1, left: BUTTON_SIZE * 0 }), onContextMenu: (e) => e.preventDefault(), onTouchStart: onMouseDown.bind(this, _1.Direction.Left), onTouchEnd: onMouseUp.bind(this, _1.Direction.Left) }, "\u21E6"),
                React.createElement("button", { style: Object.assign({}, BUTTON_STYLE, { top: BUTTON_SIZE * 1, left: BUTTON_SIZE * 2 }), onContextMenu: (e) => e.preventDefault(), onTouchStart: onMouseDown.bind(this, _1.Direction.Right), onTouchEnd: onMouseUp.bind(this, _1.Direction.Right) }, "\u21E8"),
                React.createElement("button", { style: Object.assign({}, BUTTON_STYLE, { top: BUTTON_SIZE * 2, left: BUTTON_SIZE * 1 }), onContextMenu: (e) => e.preventDefault(), onTouchStart: onMouseDown.bind(this, _1.Direction.Down), onTouchEnd: onMouseUp.bind(this, _1.Direction.Down) }, "\u21E9"))),
        React.createElement("div", { style: {
                position: 'absolute',
                right: 8,
                bottom: 8
            } },
            React.createElement("button", { style: Object.assign({}, BIG_BUTTON_STYLE, { position: 'static' }), onContextMenu: (e) => e.preventDefault(), onTouchStart: onMouseDown.bind(this, 'Enter'), onTouchEnd: onMouseUp.bind(this, 'Enter') }, "\u25CE"))));
}
exports.default = default_1;
//# sourceMappingURL=TouchPad.js.map
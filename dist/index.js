"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const CharData_1 = require("./CharData");
const draw_1 = require("./draw");
const timeout_1 = require("./timeout");
exports.timeout = timeout_1.default;
const findPath_1 = require("./findPath");
const getNextCoordinates_1 = require("./getNextCoordinates");
const getDir_1 = require("./getDir");
const calculateViewport_1 = require("./calculateViewport");
const isNextFieldWalkable_1 = require("./isNextFieldWalkable");
const TouchPad_1 = require("./TouchPad");
var Direction;
(function (Direction) {
    Direction[Direction["Up"] = 1] = "Up";
    Direction[Direction["Down"] = 2] = "Down";
    Direction[Direction["Left"] = 3] = "Left";
    Direction[Direction["Right"] = 4] = "Right";
})(Direction = exports.Direction || (exports.Direction = {}));
exports.TILE_SIZE = 16;
exports.FRAMES_PER_STEP = 6;
exports.FRAME_DURATION = 70;
class WorldEngine extends React.Component {
    constructor(props) {
        super(props);
        this.canvas = React.createRef();
        this.state = {
            chars: [CharData_1.getInitialCharState(props.controllableChar)].concat((props.mapData.chars || []).concat(props.chars).map((c) => CharData_1.getInitialCharState(c))),
            pressedKey: null,
            otherPressedKeys: []
        };
        this.onKeyDown = this.onKeyDown.bind(this);
        this.onKeyUp = this.onKeyUp.bind(this);
        this.tick = this.tick.bind(this);
        this.moveChar = this.moveChar.bind(this);
        this.moveCharTo = this.moveCharTo.bind(this);
        this.changeCharDir = this.changeCharDir.bind(this);
        this.onMouseDown = this.onMouseDown.bind(this);
        this.onMouseUp = this.onMouseUp.bind(this);
    }
    render() {
        const { top, left } = calculateViewport_1.default(this.props.viewport, this.props.mapData, this.controllableChar);
        return (React.createElement("div", { style: {
                overflow: 'hidden',
                width: this.props.viewport.width * exports.TILE_SIZE,
                height: this.props.viewport.height * exports.TILE_SIZE,
                position: 'relative'
            } },
            React.createElement("div", { style: {
                    position: 'absolute',
                    left: left,
                    top: top
                } },
                React.createElement("div", { style: {
                        position: 'relative',
                        imageRendering: 'pixelated',
                        width: this.props.mapData.width * exports.TILE_SIZE,
                        height: this.props.mapData.height * exports.TILE_SIZE,
                        backgroundImage: 'url(' + this.props.mapData.mapBackgroundImage + ')'
                    } },
                    React.createElement("canvas", { ref: this.canvas, width: this.props.mapData.width * exports.TILE_SIZE, height: this.props.mapData.height * exports.TILE_SIZE, style: { imageRendering: 'pixelated', position: 'absolute' } }))),
            React.createElement(TouchPad_1.default, { onMouseDown: this.onMouseDown, onMouseUp: this.onMouseUp })));
    }
    pressEnter() {
        const hoverChar = this.state.chars.find((c) => c.id !== this.controllableChar.id && c.x === this.controllableChar.x && c.y === this.controllableChar.y);
        if (hoverChar && this.props.onPressEnter) {
            this.props.onPressEnter(this.controllableChar.id, Object.assign({}, hoverChar));
        }
        const nextCoordinates = getNextCoordinates_1.default(this.state.chars);
        const nextChar = this.state.chars.find((c) => c.x === nextCoordinates.x && c.y === nextCoordinates.y && !c.walkThrough);
        if (nextChar) {
            if (!nextChar.lookNotInDirection) {
                this.changeChar(nextChar.id, { dir: getDir_1.getOppositeDir(this.controllableChar.dir) });
            }
            if (this.props.onPressEnter) {
                this.props.onPressEnter(this.controllableChar.id, Object.assign({}, nextChar));
            }
        }
    }
    onMouseDown(dir) {
        if (dir === 'Enter') {
            this.pressEnter();
            return;
        }
        if (typeof dir !== 'string') {
            this.pressDir(dir);
        }
    }
    onMouseUp(dir) {
        if (typeof dir !== 'string') {
            this.stopPressDir(dir);
        }
    }
    stopPressDir(dir) {
        let otherPressedKeys = this.state.otherPressedKeys.slice().filter((d) => d !== dir);
        const lastKey = otherPressedKeys[otherPressedKeys.length - 1];
        otherPressedKeys = otherPressedKeys.filter((d) => d !== lastKey);
        this.setState({
            pressedKey: lastKey || null,
            otherPressedKeys
        });
    }
    pressDir(dir) {
        this.setState({
            pressedKey: dir,
            otherPressedKeys: this.state.otherPressedKeys.slice()
                .concat(this.state.pressedKey ? [this.state.pressedKey] : null)
        });
        if (!this.interval) {
            this.tick();
            this.interval = window.setInterval(this.tick, exports.FRAME_DURATION);
        }
    }
    onKeyDown(e) {
        if (e.key === 'Enter' || e.key === ' ') {
            this.pressEnter();
            return;
        }
        const dir = getDir_1.default(e);
        if (dir) {
            this.pressDir(dir);
        }
    }
    onKeyUp(e) {
        let dir = getDir_1.default(e);
        if (dir) {
            this.stopPressDir(dir);
        }
    }
    changeCharDir(charId, dir) {
        return new Promise((resolve) => {
            this.changeChar(charId, { dir });
            setTimeout(resolve, exports.FRAME_DURATION);
        });
    }
    moveCharTo(charId, x, y, options) {
        options = options || {};
        return new Promise(async (resolve) => {
            const char = this.state.chars.find((c) => c.id === charId);
            if (!char) {
                resolve(false);
                return;
            }
            const dirs = findPath_1.default(this.props.mapData, this.state.chars, charId, x, y);
            for (let i = 0; i < dirs.length; i++) {
                await this.moveChar(charId, dirs[i], options);
            }
            resolve(true);
        });
    }
    moveChar(charId, dir, options) {
        options = options || {};
        return new Promise(async (resolve) => {
            const char = this.state.chars.find((c) => c.id === charId);
            if (!char) {
                resolve(false);
                return;
            }
            if (char.dir !== dir) {
                await this.changeCharDir(charId, dir);
            }
            if (!isNextFieldWalkable_1.default(this.props.mapData, this.state.chars, charId)) {
                resolve(false);
                return;
            }
            for (let i = 1; i < exports.FRAMES_PER_STEP; i++) {
                this.changeChar(charId, { progressFrame: i, animationFrame: i });
                await timeout_1.default(options.msPerFrame || exports.FRAME_DURATION);
            }
            this.finishStep(char.id);
            await timeout_1.default(options.msPerFrame || exports.FRAME_DURATION);
            resolve(true);
        });
    }
    componentDidMount() {
        this.redraw();
        document.addEventListener('keydown', this.onKeyDown);
        document.addEventListener('keyup', this.onKeyUp);
        this.interval = window.setInterval(this.tick, exports.FRAME_DURATION);
        this.actionHandler = {
            moveChar: this.moveChar,
            moveCharTo: this.moveCharTo,
            changeCharDir: this.changeCharDir,
            disableMovement: () => this.setState({ disabledMovement: true }),
            enableMovement: () => this.setState({ disabledMovement: false }),
            hideChar: (charId) => this.changeChar(charId, { hidden: true }),
            showChar: (charId) => this.changeChar(charId, { hidden: false })
        };
        if (this.props.onLoaded) {
            this.props.onLoaded(this.actionHandler);
        }
    }
    componentWillUnmount() {
        clearInterval(this.interval);
        this.interval = null;
        document.removeEventListener('keydown', this.onKeyDown);
        document.removeEventListener('keyup', this.onKeyUp);
    }
    componentDidUpdate() {
        this.redraw();
    }
    nextCharProgress() {
        if (this.controllableChar.progressFrame === exports.FRAMES_PER_STEP - 1) {
            this.finishStep();
            return;
        }
        this.changeControllableChar({
            progressFrame: this.controllableChar.progressFrame + 1,
            animationFrame: this.controllableChar.animationFrame + 1
        });
    }
    nextCharAnimation() {
        if (this.controllableChar.animationFrame === exports.FRAMES_PER_STEP - 1) {
            this.changeControllableChar({ animationFrame: 0 });
            return;
        }
        this.changeControllableChar({
            animationFrame: this.controllableChar.animationFrame + 1
        });
    }
    get controllableChar() {
        return this.state.chars[0];
    }
    changeControllableChar(newFields) {
        this.setState({
            chars: [Object.assign({}, this.controllableChar, newFields)].concat(this.state.chars.slice(1, this.state.chars.length))
        });
    }
    changeChar(charId, newFields) {
        const chars = this.state.chars.slice().map((c) => {
            if (c.id === charId) {
                return Object.assign({}, c, newFields);
            }
            return c;
        });
        this.setState({ chars });
    }
    clearAnimation() {
        clearInterval(this.interval);
        this.interval = null;
    }
    triggerOnWalksTo(charId, oldCoordinates) {
        if (this.props.onOver) {
            const overChar = this.state.chars.find((c) => c.id !== this.controllableChar.id && c.x === this.controllableChar.x && c.y === this.controllableChar.y);
            if (overChar) {
                this.props.onOver(charId, Object.assign({}, overChar));
            }
        }
        if (!this.props.onWalksTo) {
            return;
        }
        this.props.onWalksTo(charId, {
            prev: Object.assign({}, oldCoordinates, { special: this.props.mapData.specialTiles[oldCoordinates.y][oldCoordinates.x] || null }),
            next: {
                looksAt: getNextCoordinates_1.default(this.state.chars),
                x: this.controllableChar.x,
                y: this.controllableChar.y,
                special: this.props.mapData.specialTiles[this.controllableChar.y][this.controllableChar.x] || null
            }
        });
    }
    finishStep(charId) {
        let char = this.controllableChar;
        if (charId) {
            char = this.state.chars.find((c) => c.id === charId);
        }
        const { x, y } = getNextCoordinates_1.default(this.state.chars, char.id);
        const prevX = char.x;
        const prevY = char.y;
        this.changeChar(char.id, { x, y, progressFrame: 0, animationFrame: 0 });
        this.triggerOnWalksTo(char.id, { x: prevX, y: prevY });
    }
    tick() {
        // in-between, animate
        if (this.controllableChar.progressFrame !== 0) {
            this.nextCharProgress();
            return;
        }
        if (this.controllableChar.animationFrame !== 0) {
            this.nextCharAnimation();
            return;
        }
        // Final Step => clear interval
        if (!this.state.pressedKey) {
            this.clearAnimation();
            return;
        }
        // Forbid Movement
        if (this.state.disabledMovement) {
            return;
        }
        // First press => change dir only
        if (this.controllableChar.dir !== this.state.pressedKey) {
            this.changeControllableChar({ dir: this.state.pressedKey });
            this.triggerOnWalksTo(this.controllableChar.id, { x: this.controllableChar.x, y: this.controllableChar.y });
            return;
        }
        // Can not walk to next field
        if (!isNextFieldWalkable_1.default(this.props.mapData, this.state.chars, this.controllableChar.id)) {
            this.changeControllableChar({
                animationFrame: 1
            });
            return;
        }
        // Second press => start to walk
        this.changeControllableChar({
            progressFrame: 1,
            animationFrame: 1
        });
    }
    redraw() {
        if (!this.canvas.current) {
            return;
        }
        draw_1.default(this.canvas.current, this.props.mapData, this.state.chars);
    }
}
exports.default = WorldEngine;
//# sourceMappingURL=index.js.map
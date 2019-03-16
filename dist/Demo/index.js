"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const ReactDOM = require("react-dom");
const __1 = require("..");
const charset1 = require("./charset1.png");
const charset2 = require("./charset2.png");
const charset3 = require("./charset3.png");
const charset4 = require("./charset4.png");
const mapData = require('./demo.gamemap.json'); // created through http://world-editor.oakdex.org
let actionHandler;
async function onEnterStranger() {
    console.log('TRIGGERED STRANGER');
    if (!actionHandler) {
        return;
    }
    actionHandler.disableMovement();
    await actionHandler.changeCharDir('stranger-woman', __1.Direction.Left);
    await __1.timeout(300);
    await actionHandler.changeCharDir('stranger-woman', __1.Direction.Down);
    actionHandler.hideChar('stranger-woman');
    await __1.timeout(600);
    await actionHandler.changeCharDir('stranger-woman', __1.Direction.Right);
    actionHandler.showChar('stranger-woman');
    await __1.timeout(600);
    const up1 = await actionHandler.moveChar('stranger-woman', __1.Direction.Up, { msPerFrame: 100 });
    const up2 = await actionHandler.moveChar('stranger-woman', __1.Direction.Up);
    if (up1) {
        await actionHandler.moveChar('stranger-woman', __1.Direction.Down, { msPerFrame: 150 });
    }
    if (up2) {
        await actionHandler.moveChar('stranger-woman', __1.Direction.Down);
    }
    await actionHandler.moveCharTo('stranger-woman', 43, 12);
    await actionHandler.moveCharTo('stranger-woman', 32, 13);
    actionHandler.enableMovement();
    console.log('DONE');
}
ReactDOM.render(React.createElement(__1.default, { mapData: mapData, viewport: { width: 19, height: 15 }, controllableChar: { id: 'heroine', name: 'Heroine', image: charset1, x: 36, y: 12 }, chars: [
        { id: 'stranger-woman', name: 'Stranger', image: charset2, x: 32, y: 13, dir: __1.Direction.Up },
        { id: 'guy', image: charset3, x: 44, y: 12, lookNotInDirection: true },
        { id: 'umbrella-woman', image: charset4, x: 40, y: 20, dir: __1.Direction.Left, walkThrough: true }
    ], onLoaded: (mapActionHandler) => { actionHandler = mapActionHandler; }, onPressEnter: (charId, triggeredChar) => triggeredChar.id === 'stranger-woman' ? onEnterStranger() : console.log('Pressing Enter For', triggeredChar.id), onOver: (charId, triggeredChar) => console.log('Walked over', triggeredChar.id), onWalksTo: (charId, { prev, next }) => console.log(charId, 'walked to', next.x, next.y, next.looksAt.x, next.looksAt.y, next.special) }), document.getElementById('app'));
//# sourceMappingURL=index.js.map
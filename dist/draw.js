"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const drawChar_1 = require("./drawChar");
let loadedImages = {};
let currentMap = null;
function loadImage(key, src) {
    return new Promise((resolve) => {
        if (loadedImages[key]) {
            resolve();
            return;
        }
        const img = new Image();
        img.src = src;
        loadedImages[key] = img;
        img.onload = () => resolve();
    });
}
function loadImages(mapData, chars) {
    if (currentMap !== mapData.title) {
        loadedImages = {};
        currentMap = mapData.title;
    }
    return Promise.all([
        loadImage('foreground', mapData.mapForegroundImage)
    ].concat(chars.map((c) => loadImage('char-' + c.id, c.image))));
}
function default_1(canvas, mapData, charStates) {
    const ctx = canvas.getContext('2d');
    loadImages(mapData, charStates).then(() => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const sortedCharStates = charStates.slice().sort((a, b) => {
            if (a.walkThrough === b.walkThrough) {
                return a.y <= b.y ? -1 : 1;
            }
            return a.walkThrough ? -1 : 1;
        });
        sortedCharStates.forEach((charState) => {
            drawChar_1.default(ctx, loadedImages['char-' + charState.id], charState);
        });
        ctx.drawImage(loadedImages.foreground, 0, 0, canvas.width, canvas.height, 0, 0, canvas.width, canvas.height);
    });
}
exports.default = default_1;
//# sourceMappingURL=draw.js.map
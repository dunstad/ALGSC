"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.colors = void 0;
const chroma = require("chroma-js");
const settings_1 = require("./settings");
function applySaturation(color) {
    let result = chroma(color);
    let modifier = (settings_1.settings.saturation / 100) - .5;
    if (modifier < 0) {
        result = result.desaturate(Math.abs(modifier) * 8);
    }
    if (modifier > 0) {
        result = result.saturate(modifier * 8);
    }
    return result.hex();
}
exports.colors = {
    backgroundColor: applySaturation('#202330'),
    uiColor: applySaturation('cyan'),
    selectedColor: applySaturation('yellow'),
};

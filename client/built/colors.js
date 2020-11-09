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
let backgroundColor = '#202330';
let uiColor = 'cyan';
let uiBackgroundColor = chroma.mix(uiColor, backgroundColor, .9).hex();
let darkUiColor = chroma.mix(uiColor, backgroundColor, .75).hex();
let darkUiBackgroundColor = chroma.mix(darkUiColor, backgroundColor, .9).hex();
let selectedColor = 'hotpink';
let selectedBackgroundColor = chroma.mix(selectedColor, backgroundColor, .9).hex();
exports.colors = {
    backgroundColor: applySaturation(backgroundColor),
    uiColor: applySaturation(darkUiColor),
    uiBackgroundColor: applySaturation(darkUiBackgroundColor),
    selectedColor: applySaturation(selectedColor),
    selectedBackgroundColor: applySaturation(selectedBackgroundColor),
    errorColor: applySaturation('red'),
};

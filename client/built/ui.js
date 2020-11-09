"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.textboxOptions = exports.progressOptions = exports.inputOptions = exports.messageBoxOptions = exports.centeredMenuOptions = exports.errorStyle = exports.selectedStyle = exports.menuStyle = void 0;
const colors_1 = require("./colors");
exports.menuStyle = {
    fg: colors_1.colors.uiColor,
    bg: colors_1.colors.backgroundColor,
    border: {
        fg: colors_1.colors.uiColor,
        bg: colors_1.colors.uiBackgroundColor,
    },
    selected: {
        fg: colors_1.colors.selectedColor,
        bg: colors_1.colors.backgroundColor,
    },
    bar: {
        fg: colors_1.colors.uiColor,
        bg: colors_1.colors.backgroundColor,
    },
};
// used because checkboxes and sliders don't work
// with the css selectors for focus
exports.selectedStyle = {
    fg: colors_1.colors.selectedColor,
    bg: colors_1.colors.backgroundColor,
    bar: {
        fg: colors_1.colors.selectedColor,
        bg: colors_1.colors.backgroundColor,
    },
};
exports.errorStyle = Object.assign(Object.assign({}, exports.menuStyle), { fg: colors_1.colors.errorColor });
exports.centeredMenuOptions = {
    style: exports.menuStyle,
    border: {
        type: 'line'
    },
    width: '50%',
    top: 'center',
    left: 'center',
    tags: true,
    keys: true,
};
exports.messageBoxOptions = Object.assign(Object.assign({}, exports.centeredMenuOptions), { width: 'shrink', height: 'shrink', padding: 1 });
exports.inputOptions = {
    style: exports.menuStyle,
    width: '50%',
    height: 1,
    keys: true,
};
// InputOptions and PRogressBarOptions have different types
// for keys, so I had to copy all this >.>
// could probably handle it w/ and interface if needed
exports.progressOptions = {
    style: exports.menuStyle,
    width: '50%',
    height: 1,
    keys: true,
    ch: ':',
    filled: 50,
};
exports.textboxOptions = Object.assign(Object.assign({}, exports.inputOptions), { inputOnFocus: true });
/*

height: 1,
left: 10, // should probably use layout instead

filled: 50, // progress

inputOnFocus: true,
*/ 

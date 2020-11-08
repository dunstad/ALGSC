"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorStyle = exports.selectedStyle = exports.menuStyle = void 0;
const colors_1 = require("./colors");
exports.menuStyle = {
    fg: colors_1.colors.uiColor,
    bg: colors_1.colors.backgroundColor,
    border: {
        fg: colors_1.colors.uiColor,
        bg: colors_1.colors.backgroundColor,
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
// add error style
// add highlight style
/*
border: {
  type: 'line'
},
width: '50%',
tags: true,
top: 'center',
left: 'center',

// input
keys: true,

height: 1,
left: 10, // should probably use layout instead

filled: 50, // progress

// connection messages
width: 'shrink',
height: 'shrink',
padding: 1,

inputOnFocus: true,
*/ 

import {colors} from './colors';

export let menuStyle = {
  fg: colors.uiColor,
  bg: colors.backgroundColor,
  border: {
    fg: colors.uiColor,
    bg: colors.backgroundColor,
  },
  selected: {
    fg: colors.selectedColor,
    bg: colors.backgroundColor,
  },
  bar: {
    fg: colors.uiColor,
    bg: colors.backgroundColor,
  },
};

// used because checkboxes and sliders don't work
// with the css selectors for focus
export let selectedStyle = {
  fg: colors.selectedColor,
  bg: colors.backgroundColor,
  bar: {
    fg: colors.selectedColor,
    bg: colors.backgroundColor,
  },
};

export let errorStyle = {
  ...menuStyle,
  fg: colors.errorColor,
};

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
import { widget, Widgets } from 'blessed';
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

export let centeredMenuOptions: Widgets.BoxOptions = {
  style: menuStyle,
  border: {
    type: 'line'
  },
  width: '50%',
  top: 'center',
  left: 'center',
  tags: true,
  keys: true,
};

export let messageBoxOptions: Widgets.BoxOptions = {
  ...centeredMenuOptions,
  width: 'shrink',
  height: 'shrink',
  padding: 1,
}

export let inputOptions: Widgets.InputOptions = {
  style: menuStyle,
  width: '50%',
  height: 1,
  keys: true,
};

// InputOptions and PRogressBarOptions have different types
// for keys, so I had to copy all this >.>
// could probably handle it w/ and interface if needed
export let progressOptions: Widgets.ProgressBarOptions = {
  style: menuStyle,
  width: '50%',
  height: 1,
  keys: true,
  ch: ':',
  filled: 50,
};

export let textboxOptions: Widgets.TextboxOptions = {
  ...inputOptions,
  inputOnFocus: true,
};

/*

height: 1,
left: 10, // should probably use layout instead

filled: 50, // progress

inputOnFocus: true,
*/
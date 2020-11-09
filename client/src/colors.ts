import chroma = require('chroma-js');
import {settings} from './settings'

function applySaturation(color: string) {
  let result = chroma(color);
  let modifier = (settings.saturation / 100) - .5;
  if (modifier < 0) {
    result = result.desaturate(Math.abs(modifier) * 8);
  }
  if (modifier > 0) {
    result = result.saturate(modifier * 8);
  }
  return result.hex();
}

let backgroundColor = '#202330';
let uiColor = '#00ffff';
let uiBackgroundColor = chroma.mix(uiColor, backgroundColor, .9).hex()
let darkUiColor = chroma.mix(uiColor, backgroundColor, .75).hex();
let darkUiBackgroundColor = chroma.mix(darkUiColor, backgroundColor, .9).hex();
let selectedColor = '#ff9dc9';
let selectedBackgroundColor = chroma.mix(selectedColor, backgroundColor, .9).hex()

export let colors = {
  backgroundColor: applySaturation(backgroundColor),
  uiColor: applySaturation(darkUiColor),
  uiBackgroundColor: applySaturation(darkUiBackgroundColor),
  importantUiColor: applySaturation(uiColor),
  importantUiBackgroundColor: applySaturation(uiBackgroundColor),
  selectedColor: applySaturation(selectedColor),
  selectedBackgroundColor: applySaturation(selectedBackgroundColor),
  errorColor: applySaturation('red'),
};
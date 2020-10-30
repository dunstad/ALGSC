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

export let colors = {
  backgroundColor: applySaturation('#202330'),
  uiColor: applySaturation('cyan'),
  selectedColor: applySaturation('yellow'),
};
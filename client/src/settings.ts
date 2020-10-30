export type Settings = {
  check: boolean,
  slider: number,
  saturation: number,
  port: string,
}
// done this way so tsc copies the json to ../built
import s = require('./settings.json');
export let settings: Settings = s;
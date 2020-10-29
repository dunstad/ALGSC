let blessed = require('neo-blessed');
import { BlessedProgram, widget, Widgets } from "blessed";
import Colyseus = require("colyseus.js");
import fs = require('fs');
import settings = require('./settings.json');
let chroma = require('chroma-js');

let blessedScreen: Widgets.Screen = blessed.screen({
  smartCSR: true,
  terminal: 'xterm-256color',
  extended: true,
});

let currentMenu: Widgets.BoxElement;

let menuStyle = {
  fg: applySaturation('cyan'),
  bg: applySaturation('#202330'),
  border: {
    fg: applySaturation('cyan'),
    bg: applySaturation('#202330'),
  },
  selected: {
    fg: applySaturation('#ffff00'),
    // fg: 'yellow',
    bg: applySaturation('#202330'),
  },
  keyable: {
    fg: applySaturation('#ffff00'),
    // fg: 'yellow',
  }
};

let image: Widgets.ImageElement = blessed.image({
  parent: blessedScreen,
  file: './assets/city.png',
  top: 'center',
  left: 'center',
  height: Math.min(blessedScreen.height as number, 40),
  width: Math.min(blessedScreen.width as number, 83 * 2),
  tags: true,
  border: {
    type: 'line'
  },
  style: menuStyle,
});

function applySaturation(color: string) {
  let result = chroma(color);
  let modifier = (settings.saturation / 100) - .5;
  console.log(modifier)
  if (modifier < 0) {
    result = result.desaturate(Math.abs(modifier) * 8);
  }
  if (modifier > 0) {
    result = result.saturate(modifier * 8);
  }
  return result.hex();
}

function quit() {
  return process.exit(0);
}

function show(menu: Widgets.BoxElement) {
  if (currentMenu) {blessedScreen.remove(currentMenu);}
  blessedScreen.append(menu);
  menu.focus();
  currentMenu = menu;
  blessedScreen.render();
}

function highlightOnFocus(input: Widgets.InputElement) {
  input.on('focus', ()=>{
    if (input.style.bar) {
      input.style.bar.fg = menuStyle.selected.fg;
    }
    else {
      input.style.fg = menuStyle.selected.fg;
    }
    blessedScreen.render();
  });
  input.on('blur', ()=>{
    if (input.style.bar) {
      input.style.bar.fg = menuStyle.fg;
    }
    else {
      input.style.fg = menuStyle.fg;
    }
    blessedScreen.render();
  });
}

interface MenuItem {
  name: string,
  action(): void,
}

type MenuItems = MenuItem[];

let mainMenuItems: MenuItems = [
  {
    name: 'Single Player',
    action: ()=>{},
  },
  {
    name: 'Multiplayer',
    action: ()=>{show(multiplayerMenu);},
  },
  {
    name: 'Settings',
    action: ()=>{show(settingsMenu);},
  },
  {
    name: 'Quit',
    action: quit,
  },
];

// Create a box perfectly centered horizontally and vertically.
let mainMenu: Widgets.ListElement = blessed.list({
  top: 'center',
  left: 'center',
  width: '50%',
  height: 6,
  items: mainMenuItems.map((o)=>{return `{center}${o.name}{/center}`;}),
  keys: true,
  tags: true,
  border: {
    type: 'line'
  },
  style: menuStyle,
});
mainMenu.on('select', (item, index: number)=>{mainMenuItems[index].action();});

// Quit on Escape, q, or Control-C.
let backKeys: Array<string> = ['escape', 'q', 'C-c'];
mainMenu.key(backKeys, quit);

let settingsMenu: Widgets.FormElement<Widgets.FormOptions> = blessed.form({
  keys: true,
  left: 'center',
  top: 'center',
  width: '50%',
  height: 6,
  style: menuStyle,
  border: {
    type: 'line'
  },
  content: 'check\nslider\nsaturation ',
});

interface ValuedInput extends Widgets.Node {
  value: boolean | number;
  name: string;
}

function loadSettings(settings) {
  if (settings.check) {check.check();}
  progress.setProgress(settings.slider);
  saturation.setProgress(settings.saturation);
}

function quitSettings() {
  let settings = {};
  for (let child of settingsMenu.children as ValuedInput[]) {
    settings[child.name] = child.value;
  }
  fs.writeFile('./src/settings.json', JSON.stringify(settings), (err) => {
    if (err) {throw err;}
  });
  show(mainMenu);
}
settingsMenu.key(backKeys, quitSettings);

var check: Widgets.CheckboxElement = blessed.checkbox({
  parent: settingsMenu,
  keys: true,
  style: {...menuStyle},
  width: '50%',
  height: 1,
  left: 10,
  top: 0,
  name: 'check',
});
check.key(backKeys, quitSettings);
highlightOnFocus(check);

let progressOptions: Widgets.ProgressBarOptions = {
  parent: settingsMenu,
  keys: true,
  style: {
    bar: {
      fg: applySaturation('cyan'),
      bg: applySaturation('navy'),
    }
  },
  ch: ':',
  width: '50%',
  height: 1,
  left: 10,
  filled: 50,
}

let progress: Widgets.ProgressBarElement = blessed.progressbar({
  ...progressOptions,
  name: 'slider',
  top: 1,
  style: {bar: {...progressOptions.style.bar}},
});
progress.key(backKeys, quitSettings);
highlightOnFocus(progress);

let saturation: Widgets.ProgressBarElement = blessed.progressbar({
  ...progressOptions,
  name: 'saturation',
  top: 2,
  style: {...progressOptions.style},
});
saturation.key(backKeys, quitSettings);
highlightOnFocus(saturation);

let multiplayerMenu: Widgets.FormElement<Widgets.FormOptions> = blessed.form({
  keys: true,
  left: 'center',
  top: 'center',
  width: '50%',
  height: 3,
  style: menuStyle,
  border: {
    type: 'line'
  },
  content: 'Connect: ',
});
multiplayerMenu.key(backKeys, ()=>{show(mainMenu);});

var ipAddressInput: Widgets.TextboxElement = blessed.textbox({
  parent: multiplayerMenu,
  inputOnFocus: true,
  style: {...menuStyle},
  width: '50%',
  height: 1,
  left: 9,
  top: 0,
  name: 'ipAddressInput',
});
highlightOnFocus(ipAddressInput);
ipAddressInput.key(['enter'], ()=>{
  show(connectingMessage);
  
  let client: Colyseus.Client = new Colyseus.Client('ws://localhost:2567');
  client.joinOrCreate('my_room').then((room: Colyseus.Room)=>{
      console.log(room.sessionId, "joined", room.name);
      show(connectedMessage);
  }).catch(error => {
      console.log("JOIN ERROR", error);
  });

});

let connectingMessage: Widgets.BoxElement = blessed.box({
  style: menuStyle,
  border: 'line',
  width: 'shrink',
  height: 'shrink',
  left: 'center',
  top: 'center',
  padding: 1,
  name: 'connectingMessage',
  content: ' Connecting... ',
});
connectingMessage.key(backKeys, ()=>{show(multiplayerMenu);});

let connectedMessage: Widgets.BoxElement = blessed.box({
  style: menuStyle,
  border: 'line',
  width: 'shrink',
  height: 'shrink',
  left: 'center',
  top: 'center',
  padding: 1,
  name: 'connectedMessage',
  content: ' Connected! ',
});
connectedMessage.key(backKeys, ()=>{show(multiplayerMenu);});


function main() {
  loadSettings(settings);
  show(mainMenu);
}

main();
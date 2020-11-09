let blessed = require('neo-blessed');
import { Widgets } from "blessed";
import Colyseus = require("colyseus.js");
import fs = require('fs');
import {settings, Settings} from './settings'
import {centeredMenuOptions, progressOptions, errorStyle, inputOptions, menuStyle, messageBoxOptions, selectedStyle, textboxOptions} from './ui'

let blessedScreen: Widgets.Screen = blessed.screen({
  smartCSR: true,
  terminal: 'xterm-256color',
  extended: true,
});

let currentMenu: Widgets.BoxElement;

let stealth = settings.saturation < 35 ? 'stealth_' : '';

let image: Widgets.ImageElement = blessed.image({
  ...centeredMenuOptions,
  style: menuStyle,
  parent: blessedScreen,
  file: `./assets/${stealth}title.png`,
  height: Math.min(blessedScreen.height as number, 40),
  width: Math.min(blessedScreen.width as number, 83 * 2),
});

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
    input.style = selectedStyle;
    blessedScreen.render();
  });
  input.on('blur', ()=>{
    input.style = menuStyle;
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
    action: ()=>{
      show(multiplayerMenu);
      portInput.setValue(settings.port);
      blessedScreen.render()
    },
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
  ...centeredMenuOptions,
  height: 6,
  items: mainMenuItems.map((o)=>{return `{center}${o.name}{/center}`;}),
});
mainMenu.on('select', (item, index: number)=>{mainMenuItems[index].action();});

// Quit on Escape, q, or Control-C.
let backKeys: Array<string> = ['escape', 'q', 'C-c'];
mainMenu.key(backKeys, quit);

let settingsMenu: Widgets.FormElement<Widgets.FormOptions> = blessed.form({
  ...centeredMenuOptions,
  content: 'check\nslider\nsaturation ',
  height: 6,
});

interface ValuedInput extends Widgets.Node {
  value: boolean | number;
  name: string;
}

function loadSettings(settings: Settings) {
  if (settings.check) {check.check();}
  progress.setProgress(settings.slider);
  saturation.setProgress(settings.saturation);
}

function quitSettings() {
  let settings = {};
  for (let child of settingsMenu.children as ValuedInput[]) {
    settings[child.name] = child.value;
  }
  fs.writeFile('./built/settings.json', JSON.stringify(settings), (err) => {
    if (err) {throw err;}
  });
  show(mainMenu);
}
settingsMenu.key(backKeys, quitSettings);

var check: Widgets.CheckboxElement = blessed.checkbox({
  ...inputOptions,
  parent: settingsMenu,
  left: 10,
  top: 0,
  name: 'check',
});
check.key(backKeys, quitSettings);
highlightOnFocus(check);

let progress: Widgets.ProgressBarElement = blessed.progressbar({
  ...progressOptions,
  name: 'slider',
  top: 1,
  left: 10,
  parent: settingsMenu,
});
progress.key(backKeys, quitSettings);
highlightOnFocus(progress);

let saturation: Widgets.ProgressBarElement = blessed.progressbar({
  ...progressOptions,
  name: 'saturation',
  top: 2,
  left: 10,
  parent: settingsMenu,
});
saturation.key(backKeys, quitSettings);
highlightOnFocus(saturation);

let multiplayerMenu: Widgets.FormElement<Widgets.FormOptions> = blessed.form({
  ...centeredMenuOptions,
  height: 4,
  content: 'IP: \nPort: ',
});
multiplayerMenu.key(backKeys, ()=>{show(mainMenu);});

let connectingMessage: Widgets.BoxElement = blessed.box({
  ...messageBoxOptions,
  name: 'connectingMessage',
  content: ' Connecting... ',
});
connectingMessage.key(backKeys, ()=>{show(multiplayerMenu);});

let connectedMessage: Widgets.BoxElement = blessed.box({
  ...messageBoxOptions,
  name: 'connectedMessage',
  content: ' Connected! ',
});
connectedMessage.key(backKeys, ()=>{show(multiplayerMenu);});
connectedMessage.key('w', ()=>{ROOM.send('move', {y: 1});});
connectedMessage.key('a', ()=>{ROOM.send('move', {x: -1});});
connectedMessage.key('s', ()=>{ROOM.send('move', {y: -1});});
connectedMessage.key('d', ()=>{ROOM.send('move', {x: 1});});
connectedMessage.key('f', ()=>{ROOM.send('move', {z: -1});});
connectedMessage.key('r', ()=>{ROOM.send('move', {z: 1});});

let connectionFailedMessage: Widgets.BoxElement = blessed.box({
  ...messageBoxOptions,
  style: errorStyle,
  name: 'connectionFailedMessage',
  content: ' Connection Failed! ',
});
connectionFailedMessage.key(backKeys, ()=>{show(multiplayerMenu);});

let ipAddressInput: Widgets.TextboxElement = blessed.textbox({
  ...textboxOptions,
  parent: multiplayerMenu,
  left: 6,
  top: 0,
  name: 'ipAddressInput',
});
highlightOnFocus(ipAddressInput);
ipAddressInput.key(['enter'], connect);

let portInput: Widgets.TextboxElement = blessed.textbox({
  ...textboxOptions,
  parent: multiplayerMenu,
  left: 6,
  top: 1,
  name: 'portInput',
});
highlightOnFocus(portInput);
portInput.key(['enter'], connect);

let ROOM;
function connect() {
  show(connectingMessage);

  let client: Colyseus.Client = new Colyseus.Client(`ws://${ipAddressInput.value}:${portInput.value}`);
  client.joinOrCreate('my_room').then((room: Colyseus.Room)=>{
    
    console.log(room.sessionId, "joined", room.name);
    show(connectedMessage);
    
    room.onStateChange.once((state) => {
      console.log("this is the first room state!", state.mapJSON);
    });
    
    room.onStateChange((state) => {
      console.log("the room state has been updated:", state.mapJSON);
    });

    ROOM = room;

  }).catch(error => {
    show(connectionFailedMessage);
    console.log("JOIN ERROR", error);
  });
}

function main() {
  loadSettings(settings);
  show(mainMenu);
}

main();
var blessed = require('neo-blessed');

// Create a screen object.
var screen = blessed.screen();

let currentMenu;

var image = blessed.image({
  parent: screen,
  file: './city.png',
  top: 'center',
  left: 'center',
  height: Math.min(screen.height, 40),
  width: Math.min(screen.width, 83 * 2),
  // height: 13,
  // width: 80,
  tags: true,
  border: {
    type: 'line'
  },
  style: {
    fg: 'white',
    bg: 'magenta',
    border: {
      fg: '#ffffff'
    },
    hover: {
      bg: 'green'
    }
  }
});

let menuStyle = {
  fg: 'cyan',
    bg: 'navy',
    border: {
      fg: 'cyan'
    },
    selected: {
      fg: 'yellow',
    },
    keyable: {
      fg: 'yellow',
    }
};

function quit() {
  return process.exit(0);
}

function show(menu) {
  if (currentMenu) {screen.remove(currentMenu);}
  screen.append(menu);
  menu.focus();
  currentMenu = menu;
  screen.render();
}

let mainMenuItems = [
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
let mainMenu = blessed.list({
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
mainMenu.on('select', (item, index)=>{mainMenuItems[index].action();});

// Quit on Escape, q, or Control-C.
let backKeys = ['escape', 'q', 'C-c'];
mainMenu.key(backKeys, quit);

let settingsMenu = blessed.form({
  keys: true,
  left: 'center',
  top: 'center',
  width: '50%',
  height: 6,
  style: menuStyle,
  border: {
    type: 'line'
  },
  content: 'check\nslider ',
});
settingsMenu.key(backKeys, ()=>{show(mainMenu);});


var check = blessed.checkbox({
  parent: settingsMenu,
  keys: true,
  style: {...menuStyle},
  width: '50%',
  height: 1,
  left: 7,
  top: 0,
  name: 'check',
});
check.key(backKeys, ()=>{show(mainMenu);});
check.on('focus', ()=>{
  check.style.fg = menuStyle.selected.fg;
  screen.render();
});
check.on('blur', ()=>{
  check.style.fg = menuStyle.fg;
  screen.render();
});

var progress = blessed.progressbar({
  parent: settingsMenu,
  keys: true,
  style: {
    bar: {
      fg: 'cyan',
      bg: 'navy',
    }
  },
  ch: ':',
  width: '50%',
  height: 1,
  left: 7,
  top: 1,
  filled: 50,
});
progress.key(backKeys, ()=>{show(mainMenu);});
progress.on('focus', ()=>{
  progress.style.bar.fg = menuStyle.selected.fg;
  screen.render();
});
progress.on('blur', ()=>{
  progress.style.bar.fg = menuStyle.fg;
  screen.render();
});

let multiplayerMenu = blessed.form({
  keys: true,
  left: 'center',
  top: 'center',
  width: '50%',
  height: 6,
  style: menuStyle,
  border: {
    type: 'line'
  },
  content: 'Connect: ',
});
multiplayerMenu.key(backKeys, ()=>{show(mainMenu);});

var ipAddressInput = blessed.textbox({
  parent: multiplayerMenu,
  inputOnFocus: true,
  style: {...menuStyle},
  width: '50%',
  height: 3,
  left: 9,
  top: 0,
  name: 'ipAddressInput',
});
ipAddressInput.on('focus', ()=>{
  ipAddressInput.style.fg = menuStyle.selected.fg;
  screen.render();
});
ipAddressInput.on('blur', ()=>{
  ipAddressInput.style.fg = menuStyle.fg;
  screen.render();
});


show(mainMenu);
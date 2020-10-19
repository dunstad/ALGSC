// var blessed = require('@blessed/neo-blessed');
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
    action: ()=>{},
  },
  {
    name: 'Settings',
    action: ()=>{show(form);},
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

let form = blessed.form({
  keys: true,
  left: 'center',
  top: 'center',
  width: '50%',
  height: 6,
  style: menuStyle,
  border: {
    type: 'line'
  },
  content: 'foobar',
  scrollable: true,
  scrollbar: {
    ch: ' '
  }
});
form.key(backKeys, ()=>{show(mainMenu);});

show(mainMenu);
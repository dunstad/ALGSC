// var blessed = require('@blessed/neo-blessed');
var blessed = require('neo-blessed');

// Create a screen object.
var screen = blessed.screen();

let menuItems = [
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
    action: ()=>{},
  },
  {
    name: 'Quit',
    action: ()=>{return process.exit(0);},
  },
];

// Create a box perfectly centered horizontally and vertically.
var list = blessed.list({
  top: 'center',
  left: 'center',
  width: '50%',
  height: 6,
  content: 'Hello {bold}world{/bold}!',
  items: menuItems.map((o)=>{return `{center}${o.name}{/center}`;}),
  keys: true,
  tags: true,
  border: {
    type: 'line'
  },
  style: {
    fg: 'cyan',
    bg: 'navy',
    border: {
      fg: 'cyan'
    },
    selected: {
      fg: 'yellow',
    }
  }
});

list.on('select', (item, index)=>{menuItems[index].action();});

var image = blessed.image({
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

// Append our image to the screen.
screen.append(image);
screen.append(list);

// Quit on Escape, q, or Control-C.
screen.key(['escape', 'q', 'C-c'], function(ch, key) {
  return process.exit(0);
});

// Focus our element.
list.focus();

// Render the screen.
screen.render();

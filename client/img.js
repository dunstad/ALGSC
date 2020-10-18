// var blessed = require('@blessed/neo-blessed');
var blessed = require('neo-blessed');

// Create a screen object.
var screen = blessed.screen();

// Create a box perfectly centered horizontally and vertically.
var list = blessed.list({
  top: 'center',
  left: 'center',
  width: '50%',
  height: 6,
  // content: 'Hello {bold}world{/bold}!',
  items: [
    '{center}Single Player{/center}',
    '{center}Multiplayer{/center}',
    '{center}Settings{/center}',
    '{center}Quit{/center}',
  ],
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

var image = blessed.image({
  file: './city.png',
  top: 'center',
  left: 'center',
  height: 40,
  width: 83 * 2,
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

// If list is focused, handle `enter` and give us some more content.
list.key('enter', function() {
  list.setContent('{right}Even different {black-fg}content{/black-fg}.{/right}\n');
  list.setLine(1, 'bar');
  list.insertLine(1, 'foo');
  screen.render();
});

// Quit on Escape, q, or Control-C.
screen.key(['escape', 'q', 'C-c'], function(ch, key) {
  return process.exit(0);
});

// Focus our element.
list.focus();

// Render the screen.
screen.render();

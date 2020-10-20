var blessed = require('neo-blessed');
const Colyseus = require("colyseus.js")

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

function highlightOnFocus(input) {
  input.on('focus', ()=>{
    if (input.style.bar) {
      input.style.bar.fg = menuStyle.selected.fg;
    }
    else {
      input.style.fg = menuStyle.selected.fg;
    }
    screen.render();
  });
  input.on('blur', ()=>{
    if (input.style.bar) {
      input.style.bar.fg = menuStyle.fg;
    }
    else {
      input.style.fg = menuStyle.fg;
    }
    screen.render();
  });
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
highlightOnFocus(check);

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
highlightOnFocus(progress);

let multiplayerMenu = blessed.form({
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

var ipAddressInput = blessed.textbox({
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
  
  let client = new Colyseus.Client('ws://localhost:2567');
  client.joinOrCreate('my_room').then((room)=>{
      console.log(room.sessionId, "joined", room.name);
      show(connectedMessage);
  }).catch(e => {
      console.log("JOIN ERROR", e);
  });

});

let connectingMessage = blessed.box({
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

let connectedMessage = blessed.box({
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

show(mainMenu);
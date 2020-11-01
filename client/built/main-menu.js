"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
let blessed = require('neo-blessed');
const Colyseus = require("colyseus.js");
const fs = require("fs");
const colors_1 = require("./colors");
const settings_1 = require("./settings");
let blessedScreen = blessed.screen({
    smartCSR: true,
    terminal: 'xterm-256color',
    extended: true,
});
let currentMenu;
let menuStyle = {
    fg: colors_1.colors.uiColor,
    bg: colors_1.colors.backgroundColor,
    border: {
        fg: colors_1.colors.uiColor,
        bg: colors_1.colors.backgroundColor,
    },
    selected: {
        fg: colors_1.colors.selectedColor,
        bg: colors_1.colors.backgroundColor,
    },
    keyable: {
        fg: colors_1.colors.selectedColor,
    }
};
let stealth = settings_1.settings.saturation < 35 ? 'stealth_' : '';
let image = blessed.image({
    parent: blessedScreen,
    file: `./assets/${stealth}title.png`,
    top: 'center',
    left: 'center',
    height: Math.min(blessedScreen.height, 40),
    width: Math.min(blessedScreen.width, 83 * 2),
    tags: true,
    border: {
        type: 'line'
    },
    style: menuStyle,
});
function quit() {
    return process.exit(0);
}
function show(menu) {
    if (currentMenu) {
        blessedScreen.remove(currentMenu);
    }
    blessedScreen.append(menu);
    menu.focus();
    currentMenu = menu;
    blessedScreen.render();
}
function highlightOnFocus(input) {
    input.on('focus', () => {
        if (input.style.bar) {
            input.style.bar.fg = menuStyle.selected.fg;
        }
        else {
            input.style.fg = menuStyle.selected.fg;
        }
        blessedScreen.render();
    });
    input.on('blur', () => {
        if (input.style.bar) {
            input.style.bar.fg = menuStyle.fg;
        }
        else {
            input.style.fg = menuStyle.fg;
        }
        blessedScreen.render();
    });
}
let mainMenuItems = [
    {
        name: 'Single Player',
        action: () => { },
    },
    {
        name: 'Multiplayer',
        action: () => {
            show(multiplayerMenu);
            portInput.setValue(settings_1.settings.port);
            blessedScreen.render();
        },
    },
    {
        name: 'Settings',
        action: () => { show(settingsMenu); },
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
    items: mainMenuItems.map((o) => { return `{center}${o.name}{/center}`; }),
    keys: true,
    tags: true,
    border: {
        type: 'line'
    },
    style: menuStyle,
});
mainMenu.on('select', (item, index) => { mainMenuItems[index].action(); });
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
    content: 'check\nslider\nsaturation ',
});
function loadSettings(settings) {
    if (settings.check) {
        check.check();
    }
    progress.setProgress(settings.slider);
    saturation.setProgress(settings.saturation);
}
function quitSettings() {
    let settings = {};
    for (let child of settingsMenu.children) {
        settings[child.name] = child.value;
    }
    fs.writeFile('./built/settings.json', JSON.stringify(settings), (err) => {
        if (err) {
            throw err;
        }
    });
    show(mainMenu);
}
settingsMenu.key(backKeys, quitSettings);
var check = blessed.checkbox({
    parent: settingsMenu,
    keys: true,
    style: Object.assign({}, menuStyle),
    width: '50%',
    height: 1,
    left: 10,
    top: 0,
    name: 'check',
});
check.key(backKeys, quitSettings);
highlightOnFocus(check);
let progressOptions = {
    parent: settingsMenu,
    keys: true,
    style: Object.assign(Object.assign({}, menuStyle), { bar: {
            fg: colors_1.colors.uiColor,
            bg: colors_1.colors.backgroundColor,
        } }),
    ch: ':',
    width: '50%',
    height: 1,
    left: 10,
    filled: 50,
};
let progress = blessed.progressbar(Object.assign(Object.assign({}, progressOptions), { name: 'slider', top: 1, style: { bar: Object.assign({}, progressOptions.style.bar) } }));
progress.key(backKeys, quitSettings);
highlightOnFocus(progress);
let saturation = blessed.progressbar(Object.assign(Object.assign({}, progressOptions), { name: 'saturation', top: 2, style: { bar: Object.assign({}, progressOptions.style.bar) } }));
saturation.key(backKeys, quitSettings);
highlightOnFocus(saturation);
let multiplayerMenu = blessed.form({
    keys: true,
    left: 'center',
    top: 'center',
    width: '50%',
    height: 4,
    style: menuStyle,
    border: {
        type: 'line'
    },
    content: 'IP: \nPort: ',
});
multiplayerMenu.key(backKeys, () => { show(mainMenu); });
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
connectingMessage.key(backKeys, () => { show(multiplayerMenu); });
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
connectedMessage.key(backKeys, () => { show(multiplayerMenu); });
let connectionFailedMessage = blessed.box({
    style: Object.assign(Object.assign({}, menuStyle), { fg: colors_1.colors.errorColor }),
    border: 'line',
    width: 'shrink',
    height: 'shrink',
    left: 'center',
    top: 'center',
    padding: 1,
    name: 'connectionFailedMessage',
    content: ' Connection Failed! ',
});
connectionFailedMessage.key(backKeys, () => { show(multiplayerMenu); });
let ipAddressInput = blessed.textbox({
    parent: multiplayerMenu,
    inputOnFocus: true,
    style: Object.assign({}, menuStyle),
    width: '50%',
    height: 1,
    left: 6,
    top: 0,
    name: 'ipAddressInput',
});
highlightOnFocus(ipAddressInput);
ipAddressInput.key(['enter'], connect);
let portInput = blessed.textbox({
    parent: multiplayerMenu,
    inputOnFocus: true,
    style: Object.assign({}, menuStyle),
    width: '50%',
    height: 1,
    left: 6,
    top: 1,
    name: 'portInput',
});
highlightOnFocus(portInput);
portInput.key(['enter'], connect);
function connect() {
    show(connectingMessage);
    let client = new Colyseus.Client(`ws://${ipAddressInput.value}:${portInput.value}`);
    client.joinOrCreate('my_room').then((room) => {
        console.log(room.sessionId, "joined", room.name);
        show(connectedMessage);
        // console.log(JSON.stringify(room.state));
        // why is the state empty??
        room.onStateChange((state) => {
            console.log(state.mapJSON);
        });
    }).catch(error => {
        show(connectionFailedMessage);
        console.log("JOIN ERROR", error);
    });
}
function main() {
    loadSettings(settings_1.settings);
    show(mainMenu);
}
main();

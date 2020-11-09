"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
let blessed = require('neo-blessed');
const Colyseus = require("colyseus.js");
const fs = require("fs");
const settings_1 = require("./settings");
const ui_1 = require("./ui");
let blessedScreen = blessed.screen({
    smartCSR: true,
    terminal: 'xterm-256color',
    extended: true,
});
let currentMenu;
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
    style: ui_1.menuStyle,
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
        input.style = ui_1.selectedStyle;
        blessedScreen.render();
    });
    input.on('blur', () => {
        input.style = ui_1.menuStyle;
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
let mainMenu = blessed.list(Object.assign(Object.assign({}, ui_1.centeredMenuOptions), { height: 6, items: mainMenuItems.map((o) => { return `{center}${o.name}{/center}`; }) }));
mainMenu.on('select', (item, index) => { mainMenuItems[index].action(); });
// Quit on Escape, q, or Control-C.
let backKeys = ['escape', 'q', 'C-c'];
mainMenu.key(backKeys, quit);
let settingsMenu = blessed.form(Object.assign(Object.assign({}, ui_1.centeredMenuOptions), { content: 'check\nslider\nsaturation ', height: 6 }));
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
var check = blessed.checkbox(Object.assign(Object.assign({}, ui_1.inputOptions), { parent: settingsMenu, left: 10, top: 0, name: 'check' }));
check.key(backKeys, quitSettings);
highlightOnFocus(check);
let progress = blessed.progressbar(Object.assign(Object.assign({}, ui_1.progressOptions), { name: 'slider', top: 1, left: 10, parent: settingsMenu }));
progress.key(backKeys, quitSettings);
highlightOnFocus(progress);
let saturation = blessed.progressbar(Object.assign(Object.assign({}, ui_1.progressOptions), { name: 'saturation', top: 2, left: 10, parent: settingsMenu }));
saturation.key(backKeys, quitSettings);
highlightOnFocus(saturation);
let multiplayerMenu = blessed.form(Object.assign(Object.assign({}, ui_1.centeredMenuOptions), { height: 4, content: 'IP: \nPort: ' }));
multiplayerMenu.key(backKeys, () => { show(mainMenu); });
let connectingMessage = blessed.box(Object.assign(Object.assign({}, ui_1.messageBoxOptions), { name: 'connectingMessage', content: ' Connecting... ' }));
connectingMessage.key(backKeys, () => { show(multiplayerMenu); });
let connectedMessage = blessed.box(Object.assign(Object.assign({}, ui_1.messageBoxOptions), { name: 'connectedMessage', content: ' Connected! ' }));
connectedMessage.key(backKeys, () => { show(multiplayerMenu); });
connectedMessage.key('w', () => { ROOM.send('move', { y: 1 }); });
connectedMessage.key('a', () => { ROOM.send('move', { x: -1 }); });
connectedMessage.key('s', () => { ROOM.send('move', { y: -1 }); });
connectedMessage.key('d', () => { ROOM.send('move', { x: 1 }); });
connectedMessage.key('f', () => { ROOM.send('move', { z: -1 }); });
connectedMessage.key('r', () => { ROOM.send('move', { z: 1 }); });
let connectionFailedMessage = blessed.box(Object.assign(Object.assign({}, ui_1.messageBoxOptions), { style: ui_1.errorStyle, name: 'connectionFailedMessage', content: ' Connection Failed! ' }));
connectionFailedMessage.key(backKeys, () => { show(multiplayerMenu); });
let ipAddressInput = blessed.textbox(Object.assign(Object.assign({}, ui_1.textboxOptions), { parent: multiplayerMenu, left: 6, top: 0, name: 'ipAddressInput' }));
highlightOnFocus(ipAddressInput);
ipAddressInput.key(['enter'], connect);
let portInput = blessed.textbox(Object.assign(Object.assign({}, ui_1.textboxOptions), { parent: multiplayerMenu, left: 6, top: 1, name: 'portInput' }));
highlightOnFocus(portInput);
portInput.key(['enter'], connect);
let ROOM;
function connect() {
    show(connectingMessage);
    let client = new Colyseus.Client(`ws://${ipAddressInput.value}:${portInput.value}`);
    client.joinOrCreate('my_room').then((room) => {
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
    loadSettings(settings_1.settings);
    show(mainMenu);
}
main();

"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var blessed = require('neo-blessed');
var Colyseus = require("colyseus.js");
var blessedScreen = blessed.screen();
var currentMenu;
var image = blessed.image({
    parent: blessedScreen,
    file: './assets/city.png',
    top: 'center',
    left: 'center',
    height: Math.min(blessedScreen.height, 40),
    width: Math.min(blessedScreen.width, 83 * 2),
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
var menuStyle = {
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
    if (currentMenu) {
        blessedScreen.remove(currentMenu);
    }
    blessedScreen.append(menu);
    menu.focus();
    currentMenu = menu;
    blessedScreen.render();
}
function highlightOnFocus(input) {
    input.on('focus', function () {
        if (input.style.bar) {
            input.style.bar.fg = menuStyle.selected.fg;
        }
        else {
            input.style.fg = menuStyle.selected.fg;
        }
        blessedScreen.render();
    });
    input.on('blur', function () {
        if (input.style.bar) {
            input.style.bar.fg = menuStyle.fg;
        }
        else {
            input.style.fg = menuStyle.fg;
        }
        blessedScreen.render();
    });
}
var mainMenuItems = [
    {
        name: 'Single Player',
        action: function () { },
    },
    {
        name: 'Multiplayer',
        action: function () { show(multiplayerMenu); },
    },
    {
        name: 'Settings',
        action: function () { show(settingsMenu); },
    },
    {
        name: 'Quit',
        action: quit,
    },
];
// Create a box perfectly centered horizontally and vertically.
var mainMenu = blessed.list({
    top: 'center',
    left: 'center',
    width: '50%',
    height: 6,
    items: mainMenuItems.map(function (o) { return "{center}" + o.name + "{/center}"; }),
    keys: true,
    tags: true,
    border: {
        type: 'line'
    },
    style: menuStyle,
});
mainMenu.on('select', function (item, index) { mainMenuItems[index].action(); });
// Quit on Escape, q, or Control-C.
var backKeys = ['escape', 'q', 'C-c'];
mainMenu.key(backKeys, quit);
var settingsMenu = blessed.form({
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
settingsMenu.key(backKeys, function () { show(mainMenu); });
var check = blessed.checkbox({
    parent: settingsMenu,
    keys: true,
    style: __assign({}, menuStyle),
    width: '50%',
    height: 1,
    left: 7,
    top: 0,
    name: 'check',
});
check.key(backKeys, function () { show(mainMenu); });
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
progress.key(backKeys, function () { show(mainMenu); });
highlightOnFocus(progress);
var multiplayerMenu = blessed.form({
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
multiplayerMenu.key(backKeys, function () { show(mainMenu); });
var ipAddressInput = blessed.textbox({
    parent: multiplayerMenu,
    inputOnFocus: true,
    style: __assign({}, menuStyle),
    width: '50%',
    height: 1,
    left: 9,
    top: 0,
    name: 'ipAddressInput',
});
highlightOnFocus(ipAddressInput);
ipAddressInput.key(['enter'], function () {
    show(connectingMessage);
    var client = new Colyseus.Client('ws://localhost:2567');
    client.joinOrCreate('my_room').then(function (room) {
        console.log(room.sessionId, "joined", room.name);
        show(connectedMessage);
    }).catch(function (error) {
        console.log("JOIN ERROR", error);
    });
});
var connectingMessage = blessed.box({
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
connectingMessage.key(backKeys, function () { show(multiplayerMenu); });
var connectedMessage = blessed.box({
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
connectedMessage.key(backKeys, function () { show(multiplayerMenu); });
show(mainMenu);

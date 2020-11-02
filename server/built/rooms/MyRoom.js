"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MyRoom = void 0;
const colyseus_1 = require("colyseus");
const MyRoomState_1 = require("./schema/MyRoomState");
class MyRoom extends colyseus_1.Room {
    onCreate(options) {
        this.setState(new MyRoomState_1.MyRoomState());
        this.onMessage("move", (client, data) => {
            console.log("room received message from", client.sessionId, ":", data);
            this.state.movePlayer(client.sessionId, data);
        });
    }
    onJoin(client, options) {
        console.log('someone joined!');
        this.state.createPlayer(client.sessionId);
    }
    onLeave(client, consented) {
        console.log('someone left!');
        this.state.removePlayer(client.sessionId);
    }
    onDispose() {
    }
}
exports.MyRoom = MyRoom;

export {}; // fixes typescript errors, see https://stackoverflow.com/a/41975448
import { Room, Client } from "colyseus";
import {MyRoomState} from './schema/MyRoomState';

export class MyRoom extends Room<MyRoomState> {

  onCreate (options) {
    this.setState(new MyRoomState());

    this.onMessage("move", (client, data) => {
      console.log("room received message from", client.sessionId, ":", data);
      this.state.movePlayer(client.sessionId, data);
  });

  }

  onJoin (client: Client, options) {
    console.log('someone joined!')
    this.state.createPlayer(client.sessionId);
  }

  onLeave (client, consented) {
  }

  onDispose() {
  }

}

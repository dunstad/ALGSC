export {}; // fixes typescript errors, see https://stackoverflow.com/a/41975448
import { Room, Client } from "colyseus";
import {MyRoomState} from './schema/MyRoomState';

export class MyRoom extends Room<MyRoomState> {

  onCreate (options) {
    this.setState(new MyRoomState());

    this.onMessage("type", (client, message) => {
      //
      // handle "type" message.
      //
    });

  }

  onJoin (client, options) {
    console.log('someone joined!')
  }

  onLeave (client, consented) {
  }

  onDispose() {
  }

}

import {Schema, type} from '@colyseus/schema';
import {GameMap} from '../GameMap'

export class MyRoomState extends Schema {
  @type('string')
  map: GameMap;

  constructor() {
    super();
    this.map = new GameMap();
  }
}
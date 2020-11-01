import {Schema, type} from '@colyseus/schema';
import {GameMap} from '../GameMap'
import {tileTypes, Tile} from '../Tile'

export class MyRoomState extends Schema {
  @type('string')
  mapJSON: string;

  map: GameMap;

  constructor() {
    super();
    this.map = new GameMap();
    let rock: Tile = {
      ...tileTypes.rock,
      point: {x: -2, y: 0, z: 0},
      id: 0,
    }
    this.map.set(rock.point, rock);
    this.mapJSON = JSON.stringify(this.map);
  }
}
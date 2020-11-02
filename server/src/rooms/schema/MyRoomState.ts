import {Schema, type} from '@colyseus/schema';
import {GameMap} from '../GameMap'
import {tileTypes, Tile, Point3} from '../Tile'

export class MyRoomState extends Schema {
  @type('string')
  mapJSON: string;

  map: GameMap;
  players: {[key: string]: Point3};

  constructor() {
    super();
    this.map = new GameMap();
    let rock: Tile = {
      ...tileTypes.rock,
      point: {x: -2, y: 0, z: 0},
      id: 'id?',
    }
    this.map.set(rock.point, rock);
    this.mapJSON = JSON.stringify(this.map);
    this.players = {};
  }

  createPlayer(sessionId: string) {
    this.players[sessionId] = {x: 0, y: 0, z: 0};
    let player: Tile = {
      ...tileTypes.player,
      point: this.players[sessionId],
      id: sessionId,
    }
    this.map.set(player.point, player);
    this.mapJSON = JSON.stringify(this.map);
  }

  removePlayer(sessionId: string) {
    let air: Tile = {
      ...tileTypes.air,
      point: this.players[sessionId],
      id: 'ok but for real what do i do about these',
    }
    this.map.set(air.point, air);
    delete this.players[sessionId];
    this.mapJSON = JSON.stringify(this.map);
  }

  movePlayer (sessionId: string, movement: any) {
    let playerPoint = this.players[sessionId];
    let air: Tile = {
      ...tileTypes.air,
      point: {...playerPoint},
      id: 'test id?',
    }
    let player: Tile = this.map.get(playerPoint) as Tile;
    this.map.set(playerPoint, air);
    // todo: collision
    if (movement.x) {
        this.players[sessionId].x += movement.x;
        this.map.set({...playerPoint, x: playerPoint.x + 1}, player);
    } else if (movement.y) {
        this.players[sessionId].y += movement.y;
        this.map.set({...playerPoint, y: playerPoint.y + 1}, player);
    } else if (movement.z) {
        this.players[sessionId].z += movement.z;
        this.map.set({...playerPoint, z: playerPoint.z + 1}, player);
    }
    this.players[sessionId] = player.point;
    this.mapJSON = JSON.stringify(this.map);
  }
}
import {Point3, Tile} from './Tile'

/**
 * An organized way to store the tiles of a terrain map.
 */
export class GameMap {
  map: object;

  constructor() {
    this.map = {};
  }

  /**
   * Retrieve a tile from the map if it exists.
   */
  get(point: Point3) {
    let x = point.x;
    let y = point.y;
    let z = point.z;
    let result: Tile | false;
    if (this.map[x] && this.map[x][y] && this.map[x][y][z]) {
      result = this.map[x][y][z];
    }
    else {result = false;}
    return result;
  }

  /**
   * Store a tile in the map or remove one from it.
   */
  set(point: Point3, tile: Tile) {
    let x = point.x;
    let y = point.y;
    let z = point.z;
    if (!this.map[x]) {this.map[x] = {};}
    if (!this.map[x][y]) {this.map[x][y] = {};}
    this.map[x][y][z] = tile;
    return tile;
  }

  /**
   * Call this function on every tile in the map.
   */
  forEach(func: Function) {
    for (let xIndex in this.map) {
      for (let yIndex in this.map[xIndex]) {
        for (let zIndex in this.map[xIndex][yIndex]) {
          let point: Point3 = {
            x: parseInt(xIndex),
            y: parseInt(yIndex),
            z: parseInt(zIndex),
          };
          let tile = this.get(point);
          if (tile) {func(tile);}
        }
      }
    }
  }

}
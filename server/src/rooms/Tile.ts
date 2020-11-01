export type Point3 = {
  x: number,
  y: number,
  z: number,
}

export class TileType {
  solid: boolean;
  transparent: boolean;
  isPlayer?: boolean;
}

export class Tile extends TileType {
  point: Point3;
  id: string;
}

type TileTypes = {
  [key: string]: TileType;
}

export let tileTypes: TileTypes = {
  'air': {
    solid: false,
    transparent: true,
  },
  'rock': {
    solid: true,
    transparent: false,
  },
  'window': {
    solid: true,
    transparent: true,
  },
  'player': {
    solid: true,
    transparent: true,
    isPlayer: true,
  },
  'bush': {
    solid: false,
    transparent: false,
  },
};
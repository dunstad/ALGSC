export type Point3 = {
  x: number,
  y: number,
  z: number,
}

export class Tile {
  point: Point3;
  id: number;
  label: string;
  walkable: boolean;
  transparent: boolean;
}
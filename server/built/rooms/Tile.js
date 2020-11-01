"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tileTypes = exports.Tile = exports.TileType = void 0;
class TileType {
}
exports.TileType = TileType;
class Tile extends TileType {
}
exports.Tile = Tile;
exports.tileTypes = {
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

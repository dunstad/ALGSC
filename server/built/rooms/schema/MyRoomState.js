"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MyRoomState = void 0;
const schema_1 = require("@colyseus/schema");
const GameMap_1 = require("../GameMap");
const Tile_1 = require("../Tile");
class MyRoomState extends schema_1.Schema {
    constructor() {
        super();
        this.map = new GameMap_1.GameMap();
        let rock = Object.assign(Object.assign({}, Tile_1.tileTypes.rock), { point: { x: -2, y: 0, z: 0 }, id: 'id?' });
        this.map.set(rock.point, rock);
        this.mapJSON = JSON.stringify(this.map);
        this.players = {};
    }
    createPlayer(sessionId) {
        this.players[sessionId] = { x: 0, y: 0, z: 0 };
        let player = Object.assign(Object.assign({}, Tile_1.tileTypes.player), { point: this.players[sessionId], id: sessionId });
        this.map.set(player.point, player);
        this.mapJSON = JSON.stringify(this.map);
    }
    removePlayer(sessionId) {
        let air = Object.assign(Object.assign({}, Tile_1.tileTypes.air), { point: this.players[sessionId], id: 'ok but for real what do i do about these' });
        this.map.set(air.point, air);
        delete this.players[sessionId];
        this.mapJSON = JSON.stringify(this.map);
    }
    movePlayer(sessionId, movement) {
        let playerPoint = this.players[sessionId];
        let air = Object.assign(Object.assign({}, Tile_1.tileTypes.air), { point: Object.assign({}, playerPoint), id: 'test id?' });
        let player = this.map.get(playerPoint);
        this.map.set(playerPoint, air);
        // todo: collision
        if (movement.x) {
            this.players[sessionId].x += movement.x;
            this.map.set(playerPoint, player);
        }
        else if (movement.y) {
            this.players[sessionId].y += movement.y;
            this.map.set(playerPoint, player);
        }
        else if (movement.z) {
            this.players[sessionId].z += movement.z;
            this.map.set(playerPoint, player);
        }
        this.mapJSON = JSON.stringify(this.map);
    }
}
__decorate([
    schema_1.type('string')
], MyRoomState.prototype, "mapJSON", void 0);
exports.MyRoomState = MyRoomState;

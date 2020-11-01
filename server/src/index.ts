import http = require('http');
import express = require('express');
import cors = require('cors');
import colyseus = require('colyseus');
const monitor = require("@colyseus/monitor").monitor;
// const socialRoutes = require("@colyseus/social/express").default;

const MyRoom = require('./rooms/MyRoom').MyRoom;

import settings = require('./settings.json');
const port = settings.port || 2567;
const app = express()

app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const gameServer = new colyseus.Server({
  server: server,
});

// register your room handlers
gameServer.define('my_room', MyRoom);

/**
 * Register @colyseus/social routes
 *
 * - uncomment if you want to use default authentication (https://docs.colyseus.io/server/authentication/)
 * - also uncomment the require statement
 */
// app.use("/", socialRoutes);

// register colyseus monitor AFTER registering your room handlers
app.use("/colyseus", monitor());

gameServer.listen(port);
console.log(`Listening on ws://localhost:${ port }`)

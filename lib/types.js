'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var CONNECT = exports.CONNECT = 'connect';

var SOCKET_CONNECTED = exports.SOCKET_CONNECTED = 'socket-connected';
var SOCKET_OPEN = exports.SOCKET_OPEN = 'socket-open';
var SOCKET_CLOSE = exports.SOCKET_CLOSE = 'socket-close';
var SOCKET_ERROR = exports.SOCKET_ERROR = 'socket-error';
var SOCKET_PING = exports.SOCKET_PING = 'ping';
var SOCKET_PONG = exports.SOCKET_PONG = 'pong';

var ROCKET_SUB_MESSAGES = exports.ROCKET_SUB_MESSAGES = 'stream-room-messages';
var ROCKET_GET_ROOMS = exports.ROCKET_GET_ROOMS = 'rooms/get';
var ROCKET_LOGIN = exports.ROCKET_LOGIN = 'login';
var ROCKET_LOAD_HISTORY = exports.ROCKET_LOAD_HISTORY = 'loadHistory';
var ROCKET_SUBSCRIBTIONS = exports.ROCKET_SUBSCRIBTIONS = 'subscriptions/get';
var ROCKET_SEND_MESSAGE = exports.ROCKET_SEND_MESSAGE = 'sendMessage';
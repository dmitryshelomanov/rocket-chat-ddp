"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var getTimeFroLastMessage = exports.getTimeFroLastMessage = function getTimeFroLastMessage(messages) {
  return messages ? messages[messages.length - 1].ts : null;
};

var transform = exports.transform = function transform(data) {
  return data.result;
};
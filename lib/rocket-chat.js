'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.RocketChat = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _utils = require('./utils');

var _types = require('./types');

var types = _interopRequireWildcard(_types);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var RocketChat = exports.RocketChat = function () {
  function RocketChat(ddp) {
    _classCallCheck(this, RocketChat);

    this.ddp = ddp;
  }

  _createClass(RocketChat, [{
    key: 'loginWithPassword',
    value: function loginWithPassword(username, password) {
      return this.ddp.call(types.ROCKET_LOGIN, [{
        user: { username: username },
        password: password
      }]);
    }
  }, {
    key: 'loadHistory',
    value: function loadHistory(rid, messages) {
      var limit = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 50;

      return this.ddp.call(types.ROCKET_LOAD_HISTORY, [rid, (0, _utils.getTimeFroLastMessage)(messages), limit]).then(_utils.transform);
    }
  }, {
    key: 'sendMessage',
    value: function sendMessage(rid, msg) {
      return this.ddp.call(types.ROCKET_SEND_MESSAGE, [{
        rid: rid,
        msg: msg
      }]);
    }
  }, {
    key: 'getRooms',
    value: function getRooms() {
      return this.ddp.call(types.ROCKET_GET_ROOMS, []).then(_utils.transform);
    }
  }, {
    key: 'getSubscriptions',
    value: function getSubscriptions() {
      return this.ddp.call(types.ROCKET_SUBSCRIBTIONS, []).then(_utils.transform);
    }
  }, {
    key: 'getSubscriptionsWithLastMessage',
    value: function () {
      var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
        var rooms, i, _ref2, messages;

        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return this.getSubscriptions();

              case 2:
                rooms = _context.sent;
                i = 0;

              case 4:
                if (!(i < rooms.length)) {
                  _context.next = 13;
                  break;
                }

                _context.next = 7;
                return this.loadHistory(rooms[i].rid, null, 1);

              case 7:
                _ref2 = _context.sent;
                messages = _ref2.messages;


                rooms[i].lastMessage = messages[0];

              case 10:
                i++;
                _context.next = 4;
                break;

              case 13:
                return _context.abrupt('return', rooms);

              case 14:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function getSubscriptionsWithLastMessage() {
        return _ref.apply(this, arguments);
      }

      return getSubscriptionsWithLastMessage;
    }()
  }]);

  return RocketChat;
}();
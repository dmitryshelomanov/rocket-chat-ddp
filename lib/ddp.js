'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DDP = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _types = require('./types');

var types = _interopRequireWildcard(_types);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var DDP = exports.DDP = function () {
  function DDP(_ref) {
    var socket = _ref.socket,
        url = _ref.url,
        ee = _ref.ee;

    _classCallCheck(this, DDP);

    this.socket = socket;
    this.connection = null;
    this.url = url;
    this.id = 0;
    this.ee = new ee();
    this.subscribtions = {};
    this._timer = null;
    this.isConnected = false;
  }

  _createClass(DDP, [{
    key: 'connected',
    value: function connected() {
      var _this = this;

      return new Promise(function (res, rej) {
        _this.close();
        _this.connection = new _this.socket(_this.url);
        _this.connection.on('open', _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
          return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
              switch (_context.prev = _context.next) {
                case 0:
                  _context.prev = 0;

                  _this.ee.emit(types.SOCKET_OPEN);
                  _context.next = 4;
                  return _this.send({
                    msg: 'connect',
                    version: '1',
                    support: ['1', 'pre2', 'pre1']
                  }, true);

                case 4:

                  res(true);
                  _context.next = 11;
                  break;

                case 7:
                  _context.prev = 7;
                  _context.t0 = _context['catch'](0);

                  rej(_context.t0);
                  _this.ee.emit(types.SOCKET_ERROR);

                case 11:
                case 'end':
                  return _context.stop();
              }
            }
          }, _callee, _this, [[0, 7]]);
        })));
        _this.connection.on('error', function (error) {
          _this.ee.emit(types.SOCKET_ERROR);
        });
        _this.connection.on('message', function (data) {
          data = JSON.parse(data);

          if (data.msg === types.SOCKET_PING) {
            _this.send({ msg: types.SOCKET_PONG }, true);
          }

          if (data.msg === 'changed' && data.collection === types.ROCKET_SUB_MESSAGES) {
            try {
              var eventName = data.fields.eventName;


              _this.subscribtions[types.ROCKET_SUB_MESSAGES][eventName](data);
            } catch (error) {
              _this.ee.emit(types.SOCKET_ERROR, error);
            }
          }
          _this.ee.emit(data.id, data);
        });
        _this.connection.on('close', function (reason) {
          _this.ee.emit(types.SOCKET_CLOSE, reason);
        });
      });
    }
  }, {
    key: 'call',
    value: function call(method, params) {
      return this.send({
        msg: 'method',
        method: method,
        params: params
      });
    }
  }, {
    key: 'sub',
    value: function sub(name, params, callback) {
      if (_typeof(this.subscribtions[name]) !== 'object') {
        this.subscribtions[name] = {};
      }

      this.subscribtions[name][params[0]] = callback;

      return this.send({
        msg: 'sub',
        name: name,
        params: params
      }, true);
    }
  }, {
    key: 'send',
    value: function send(obj, ignore) {
      var _this2 = this;

      return new Promise(function (resolve, reject) {
        var id = 'ddp-react-native-' + _this2.id++;

        _this2.connection.send(JSON.stringify(_extends({}, obj, { id: id })));
        if (ignore) {
          resolve(null);
          return;
        }

        _this2.ee.once(id, function (data) {
          return data.error ? reject(data.error) : resolve(_extends({ id: id }, data));
        });
      });
    }
  }, {
    key: 'reconnect',
    value: function reconnect() {
      var _this3 = this;

      if (this._timer) {
        return;
      }

      delete this.connection;

      this._timer = setTimeout(_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _context2.prev = 0;

                delete _this3._timer;
                _context2.next = 4;
                return _this3.connected();

              case 4:
                _context2.next = 9;
                break;

              case 6:
                _context2.prev = 6;
                _context2.t0 = _context2['catch'](0);

                _this3.ee.emit(types.SOCKET_ERROR, _context2.t0);

              case 9:
              case 'end':
                return _context2.stop();
            }
          }
        }, _callee2, _this3, [[0, 6]]);
      })), 1000);
    }
  }, {
    key: 'close',
    value: function close() {
      try {
        if (this.connection && this.connection.close) {
          this.connection.close(300, 'disconnect');
          delete this.connection;
        }
      } catch (_) {}
    }
  }, {
    key: 'uniqueId',
    get: function get() {
      return this.id++;
    }
  }]);

  return DDP;
}();
import * as types from './types'


export class DDP {
  constructor({ socket, url, ee }) {
    this.socket = socket
    this.connection = null
    this.url = url
    this.id = 0
    this.ee = new ee()
    this.subscribtions = {}
    this._timer = null
    this.isConnected = false
  }

  get uniqueId() {
    return this.id++
  }

  connected() {
    return new Promise((res, rej) => {
      this.close()
      this.connection = new this.socket(this.url)
      this.connection.on('open', async () => {
        try {
          this.ee.emit(types.SOCKET_OPEN)
          await this.send({
            msg: 'connect',
            version: '1',
            support: ['1', 'pre2', 'pre1'],
          }, true)
  
          res(true)
        }
        catch(error) {
          rej(error)
          this.ee.emit(types.SOCKET_ERROR)
        }
      })
      this.connection.on('error', (error) => {
        this.ee.emit(types.SOCKET_ERROR)
      })
      this.connection.on('message', (data) => {
        data = JSON.parse(data)

        if (data.msg === types.SOCKET_PING) {
          this.send({ msg: types.SOCKET_PONG }, true)
        }

        if (data.msg === 'changed' && data.collection === types.ROCKET_SUB_MESSAGES) {
          try {
            const { eventName } = data.fields

            this.subscribtions[types.ROCKET_SUB_MESSAGES][eventName](data)
          }
          catch(error) {
            this.ee.emit(types.SOCKET_ERROR, error)
          }
        }
        this.ee.emit(data.id, data)
      })
      this.connection.on('close', (reason) => {
        this.ee.emit(types.SOCKET_CLOSE, reason)
      })
    })
  }

  call(method, params) {
    return this.send({
      msg: 'method',
      method,
      params,
    })
  }

  sub(name, params, callback) {
    if (typeof this.subscribtions[name] !== 'object') {
      this.subscribtions[name] = {}
    }

    this.subscribtions[name][params[0]] = callback

    return this.send({
      msg: 'sub',
      name,
      params,
    }, true)
  }

  send(obj, ignore) {
		return new Promise((resolve, reject) => {
      const id = `ddp-react-native-${ this.id++ }`

			this.connection.send(JSON.stringify({ ...obj, id }))
			if (ignore) {
        resolve(null)
				return
      }

      this.ee.once(id, (data) => data.error
        ? reject(data.error)
        : resolve({ id, ...data })
      )
		})
  }
  
  reconnect() {
		if (this._timer) {
			return
    }

    delete this.connection

		this._timer = setTimeout(async () => {
			try {
        delete this._timer
				await this.connected()
      }
      catch (error) {
        this.ee.emit(types.SOCKET_ERROR, error)
			}
		}, 1000)
  }
  
  close() {
		try {
			if (this.connection && this.connection.close) {
				this.connection.close(300, 'disconnect')
				delete this.connection
			}
    }
    catch (_) {

		}
	}
}

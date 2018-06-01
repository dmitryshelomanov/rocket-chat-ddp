import { getTimeFroLastMessage, transform } from './utils'
import * as types from './types'


export class RocketChat {
  constructor(ddp) {
    this.ddp = ddp
  }

  loginWithPassword(username, password) {
    return this.ddp
      .call(
        types.ROCKET_LOGIN, [{
          user: { username },
          password,
        }],
      )
  }

  loadHistory(rid, messages, limit = 50) {
    return this.ddp
      .call(
        types.ROCKET_LOAD_HISTORY,
        [rid, getTimeFroLastMessage(messages), limit],
      )
      .then(transform)
  }

  sendMessage(rid, msg) {
    return this.ddp
      .call(
        types.ROCKET_SEND_MESSAGE, [{
          rid,
          msg,
        }],
      )
  }

  getRooms() {
    return this.ddp
      .call(
        types.ROCKET_GET_ROOMS, [],
      )
      .then(transform)
  }

  getSubscriptions() {
    return this.ddp
      .call(types.ROCKET_SUBSCRIBTIONS, [])
      .then(transform)
  }

  async getSubscriptionsWithLastMessage() {
    const rooms = await this.getSubscriptions()

    for (let i = 0; i < rooms.length; i++) {
      const { messages } = await this.loadHistory(rooms[i].rid, null, 1)

      rooms[i].lastMessage = messages[0]
    }

    return rooms
  }
}

import WS from 'ws'
import EventEmitter from 'eventemitter3'
import { DDP, RocketChat, ROCKET_SUB_MESSAGES } from './src'


const ddp = new DDP({
  socket: WS,
  url: 'wss://chat.unitemp.ru/websocket',
  ee: EventEmitter,
})
const rocketChat = new RocketChat(ddp)


ddp.connected()
  .then(resolve)
  .catch(console.log)

async function resolve() {
  try {
    const user = await rocketChat.loginWithPassword('login', 'pass')
    const rooms = await rocketChat.getSubscriptionsWithLastMessage()

    for (let i = 0; i < rooms.length; i++) {
      ddp
        .sub(
          ROCKET_SUB_MESSAGES,
          [rooms[i].rid, true],
          () => console.log(`new messages in room ${rooms[i].rid}`),
        )
    }
  }
  catch({ error }) {
    console.log('error', error)
  }
}

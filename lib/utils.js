export const getTimeFroLastMessage = (messages) =>
  messages
    ? messages[messages.length - 1].ts
    : null

export const transform = (data) => data.result

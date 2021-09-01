async function createRoom() {
  const exp = Math.round(Date.now() / 1000) + 60 * 30;
  const options = {
    properties: {
      exp,
      enable_chat: true
    }
  }
  const response = await fetch('https://api.daily.co/v1/rooms', {
    method: 'POST',
    body: JSON.stringify(options),
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer 712b0e7e5ec78d82f77aec1715b445cb2650e6a2f39481ddeaba4c4ae559e24c`
    }
  })
  const room = await response.json();
  return room
}
export default {
  createRoom
}
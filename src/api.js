async function createRoom() {
  const exp = Math.round(Date.now() / 1000) + 60 * 30;
  const options = {
    properties: {
      exp,
      enable_chat: true
    }
  }
  const url = 'https://api.daily.co/v1/rooms';
  const response = await fetch(url, {
    method: 'POST',

    body: JSON.stringify(options),
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.VUE_APP_DAILY_API_KEY}`
    }
  })
  const room = await response.json();
  return room
}
export default {
  createRoom
}
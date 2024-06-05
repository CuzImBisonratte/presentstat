const WS_ADRESS = `ws://{HOST}:{WS_PORT}`;
let ws = new WebSocket(WS_ADRESS);

ws.onmessage = (message) => {
    console.log('Received message:', message.data);
}

// On connection error or close, try to reconnect
ws.onclose = ws.onerror = () => {
    for (let i = 0; i < 10; i++) setTimeout(() => location.reload(), 3000);
}
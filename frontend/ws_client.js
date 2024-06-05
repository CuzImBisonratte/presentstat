const ws = new WebSocket('ws://{HOST}:{WS_PORT}');

ws.onmessage = (message) => {
    console.log('Received message:', message.data);
}
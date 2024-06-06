const ws = require('ws');

const config = require('./config');

const ws_server = new ws.Server({ port: config.WS_PORT });

ws_server.on('connection', (ws) => {
    ws.on('message', (message) => {
        if (!JSON.parse(message)) return;
        message = JSON.parse(message);
        console.log('Received message:', message);
        switch (message.msg_type) {
            case 'register':
                if (!['controller', 'live_view', 'public'].includes(message.role)) return;
                ws.role = message.role;
                break;
            case 'start_question':
                if (ws.role !== 'controller') return;
                const question = message.question.questions[message.question.current];
                ws_server.clients.forEach((client) => {
                    if (client.role === 'public' || client.role === 'live_view') {
                        // Relay the question to public clients
                        client.send(JSON.stringify({ msg_type: 'start_question', question: question }));
                        // Set client current_answer to null
                        client.current_answer = null;
                    }
                });
                break;
            default:
                break;
        }
    });
});

console.log('Websocket server is running on port', config.WS_PORT);
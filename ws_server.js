const ws = require('ws');

const config = require('./config');

const ws_server = new ws.Server({ port: config.WS_PORT });

let current_questionset = null;
ws_server.on('connection', (ws) => {
    ws.on('message', (message) => {
        if (!JSON.parse(message)) return;
        message = JSON.parse(message);
        console.log('Received message:', message);
        switch (message.msg_type) {
            case 'register':
                if (!['controller', 'live_view', 'public'].includes(message.role)) return;
                ws.role = message.role;
                // Send current questionset to public client or live view
                if (message.role === 'public' || message.role === 'live_view') {
                    if (current_questionset) {
                        ws.send(JSON.stringify({ msg_type: 'start_question', question: current_questionset.questions[current_questionset.current] }));
                    }
                }
                break;
            case 'start_question':
                if (ws.role !== 'controller') return;
                current_questionset = message.question;
                const question = current_questionset.questions[message.question.current];
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
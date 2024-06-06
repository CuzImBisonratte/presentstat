const ws = require('ws');

const config = require('./config');

const ws_server = new ws.Server({ port: config.WS_PORT });

let votes = [0, 0, 0, 0];
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
                        // Check if the question should be shown
                        if (message.role === 'public' && !current_questionset.show.public) return;
                        if (message.role === 'live_view' && !current_questionset.show.live) return;
                        // Relay the question to public clients
                        ws.send(JSON.stringify({ msg_type: 'start_question', question: current_questionset.questions[current_questionset.current] }));
                    }
                }
                break;
            case 'start_question':
                // Check permissions
                if (ws.role !== 'controller') return;
                current_questionset = message.question;
                // Empty votes
                votes = [0, 0, 0, 0];
                // Send start question to public clients
                const question = current_questionset.questions[message.question.current];
                ws_server.clients.forEach((client) => {
                    if (client.role === 'public' || client.role === 'live_view') {
                        // Check if the question should be shown
                        if (client.role === 'public' && !current_questionset.show.public) return;
                        if (client.role === 'live_view' && !current_questionset.show.live) return;
                        // Relay the question to public clients
                        client.send(JSON.stringify({ msg_type: 'start_question', question: question }));
                        // Set client current_answer to null
                        client.current_answer = null;
                    }
                });
                break;
            case 'stop_question':
                // Check permissions
                if (ws.role !== 'controller') return;
                // Clear current questionset
                current_questionset = null;
                votes = [0, 0, 0, 0];
                // Send stop question to public clients
                ws_server.clients.forEach((client) => {
                    if (client.role === 'public' || client.role === 'live_view') {
                        // Relay the stop question to public clients
                        client.send(JSON.stringify({ msg_type: 'stop_question' }));
                    }
                });
                break;
            case 'show_questions':
                // Check permissions
                if (ws.role !== 'controller') return;
                // Show flags only apply when any question is active
                if (!current_questionset) return;
                // Store show flags before changing them
                const last_show = current_questionset.show;
                // Set show flags
                current_questionset.show = message.show;
                // Check if the show flags have changed
                if (last_show.public != current_questionset.show.public) {
                    if (current_questionset.show.public)
                        ws_server.clients.forEach((client) => {
                            if (client.role === 'public')
                                client.send(JSON.stringify({ msg_type: 'start_question', question: current_questionset.questions[current_questionset.current] }));
                        });
                    else ws_server.clients.forEach((client) => {
                        if (client.role === 'public')
                            client.send(JSON.stringify({ msg_type: 'stop_question' }));
                    });
                }
                if (last_show.live != current_questionset.show.live) {
                    if (current_questionset.show.live)
                        ws_server.clients.forEach((client) => {
                            if (client.role === 'live_view') {
                                client.send(JSON.stringify({ msg_type: 'start_question', question: current_questionset.questions[current_questionset.current] }));
                                client.send(JSON.stringify({ msg_type: 'vote', votes: votes }));
                            }
                        });
                    else ws_server.clients.forEach((client) => {
                        if (client.role === 'live_view')
                            client.send(JSON.stringify({ msg_type: 'stop_question' }));
                    });
                }
                break;
            case 'vote':
                // Check permissions
                if (ws.role !== 'public') return;
                // Check if the question is active
                if (!current_questionset) return;
                // Check if the option is valid
                if (message.option < 0 || message.option >= current_questionset.questions[current_questionset.current].options.length) return;
                // Store the vote
                votes[message.option]++;
                // Store the vote in the public client
                ws.current_answer = message.option;
                // Send the votes to the live view
                ws_server.clients.forEach((client) => {
                    if (client.role === 'live_view') {
                        client.send(JSON.stringify({ msg_type: 'vote', votes: votes }));
                    }
                });
                break;
            default:
                break;
        }
    });
});

console.log('Websocket server is running on port', config.WS_PORT);
const WebSocket = require('ws');
const wss = new WebSocket.Server({ noServer: true });

const userConnections = {};

wss.on('connection', (ws, request) => {
    console.log('New client connected');

    ws.send('Welcome to the WebSocket server!'); 

    const username = request.url.split('username=')[1];
    if (username) {
        userConnections[username] = ws;
    }

    ws.on('message', (message) => {
        console.log(`Received: ${message}`);
        ws.send(`Server received: ${message}`);
    });

    ws.on('close', () => {
        console.log('Client disconnected');
        // Remove the user connection from the object
        for (const uname in userConnections) {
            if (userConnections[uname] === ws) {
                delete userConnections[uname];
                break;
            }
        }
    });
    ws.on('error', (error) => {
        console.error(`WebSocket error: ${error}`);
    });
});

const sendMessageToUser = (username,message) => {
    const ws = userConnections[username];
    if (ws && ws.readyState === WebSocket.OPEN) {
        ws.send(message);
    }
};

module.exports = { wss, sendMessageToUser };
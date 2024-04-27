const WebSocket = require('ws');
const net = require('net');

const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', function connection(ws) {
    const client = new net.Socket();
    client.connect(55568, '127.0.0.1');

    client.on('data', (data) => {
        ws.send(data.toString());
    });

    ws.on('message', function incoming(message) {
        // 这里我们需要将接收到的消息广播给所有客户端
        wss.clients.forEach(function each(client) {
            if (client.readyState === WebSocket.OPEN) {
                client.send(message);
            }
        });
    });

    ws.on('close', function close() {
        client.end();
    });

    client.on('close', () => {
        ws.close();
    });
});

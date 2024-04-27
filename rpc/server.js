const net = require('net');

const host = '127.0.0.1';
const port = 55568;

const clients = [];

const server = net.createServer(client => {
    clients.push(client); // 添加客户端到列表

    client.on('data', buffer => {
        const message = buffer.toString('utf8').trim();

        // 解析接收到的JSON格式数据
        try {
            const data = JSON.parse(message);

            if (data.type === 'post') {
                // 构建要广播的消息，包括帖子内容和标签
                const broadcastMessage = JSON.stringify({
                    type: 'post',
                    username: data.username,
                    content: data.content,
                    tag: data.tag
                });

                // 广播消息到所有连接的客户端
                broadcastToAllClients(broadcastMessage, client);
            }
        } catch (e) {
            console.error("Error parsing message:", e);
        }
    });

    client.on('end', () => {
        // 客户端断开连接时从列表中移除
        const index = clients.indexOf(client);
        if (index > -1) {
            clients.splice(index, 1);
        }
    });
});

server.listen(port, host, () => {
    console.log(`Server is listening on ${host}:${port}`);
});

function broadcastToAllClients(message, sender) {
    clients.forEach(client => {
        client.write(message + '\n');
    });
}

// function disconnectClient(client, nickname) {
//     const index = clients.indexOf(client);
//     if (index !== -1) {
//         clients.splice(index, 1);
//         nicknames.splice(index, 1);
//         leaveChannel(client, nickname, true);
//         broadcast(`${nickname} has left.`, 'general', client);
//         console.log(`${nickname} disconnected`);
//     }
// }

// function leaveChannel(client, nickname, silent = false) {
//     const channel = getClientChannel(client);
//     if (channel) {
//         channels[channel] = channels[channel].filter(c => c !== client);
//         if (!silent) {
//             broadcast(`${nickname} has left ${channel}.`, channel);
//             joinChannel(client, 'general', nickname);
//         }
//     }
// }

// function joinChannel(client, channel, nickname) {
//     leaveChannel(client, nickname, true);
//     if (!channels[channel]) {
//         channels[channel] = [];
//     }
//     channels[channel].push(client);
//     broadcast(`${nickname} has joined ${channel}`, channel, client);
//     client.write(`You joined channel ${channel}\n`);
// }

// function sendPrivateMessage(sender, senderNickname, recipientNickname, content) {
//     const recipientIndex = nicknames.indexOf(recipientNickname);
//     if (recipientIndex !== -1) {
//         const recipient = clients[recipientIndex];
//         const senderChannel = getClientChannel(sender);
//         const recipientChannel = getClientChannel(recipient);
//         if (senderChannel === recipientChannel) {
//             const privateMessage = `${senderNickname} [private] ${recipientNickname}: ${content}`;
//             sender.write(privateMessage + '\n');
//             recipient.write(privateMessage + '\n');
//         } else {
//             sender.write(`${recipientNickname} is not in your channel.\n`);
//         }
//     } else {
//         sender.write(`User ${recipientNickname} not found.\n`);
//     }
// }

// function getClientChannel(client) {
//     for (let channel in channels) {
//         if (channels[channel].includes(client)) {
//             return channel;
//         }
//     }
//     return null;
// }

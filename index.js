const WebSocket = require('ws');
const GameServer = require('./server/socket_handler/GameServer');
const Client = require('./server/socket_handler/Client');
const server = new WebSocket.Server({ port: 8080 });
console.log("[o] | Server on :)")

let players = new Map();
let gameServers = new Map();

server.on('connection', function connection(socket) {
    console.log("[+] | Client connected")
    let client = new Client();
    let gameServer = new GameServer();

    socket.on('message', function incoming(message) {
        let data = JSON.parse(message);
        switch (data.type) {
            //Lors de la connexion, on assigne le joueur à une partie
            case 'login':
                client.login(`${data.playerID}`, socket)
                players.set(client.pseudo, client);
                client.startGame();
                gameServers.set(client.gameServer.serverID, client.gameServer)
                break;
            //Invitation de l'hôte à un joueur pour rejoindre sa partie
            case 'invite_in_current_game':
                for (let [loopedID, loopedclient] of players) {
                    if(loopedID == data.PlayerInvitedID) {
                        client.inviteClientInCurrentGame(loopedclient);
                    }
                }
                break;
            //Si le joueur accepte l'invitation de l'hôte
            case 'accept_game_invitation':
                for (let [loopedID, loopedclient] of players) {
                    if(loopedID == data.PlayerHostID) {
                        client.acceptClientInvitation(loopedclient);
                    }
                }
                break;
            case 'player_move':
                if(client.gameServer != undefined) {
                    for (let serverClient of client.gameServer.playersInGameServer) {
                        serverClient.socket.send(JSON.stringify({
                            type: 'player_move',
                            playerID: data.playerID,
                            x: data.x,
                            y: data.y
                        }));
                    }
                }
                break;
            case 'leave_game':
                client.disconnectFromCurrentGame()
                break;
            case 'generate_map':
                client.generateMap()
                break;
            case 'ping':
                socket.send(JSON.stringify({
                    type: 'pong'
                }))
                break;
            default:
                console.error('Message non reconnu reçu du client : ', data);
                break;
        }
    });

    socket.on('close', function close() {
        client.disconnect()
        console.log("[-] | Client disconnected")
    });
});
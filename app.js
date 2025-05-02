const express = require("express")
const path = require("path")
const logger = require("morgan")

const {Server} = require("socket.io")
const {createServer} = require("node:http")

const app = express();
let userCount = 0;
const port = process.env.PORT || 3000;

let activePlayersServer = [];
let waitingPlayers = [];
let rooms = {};
let roomsCount = 0;
const server = createServer(app)
const io = new Server(server, {
    connectionStateRecovery:{ },
    maxHttpBufferSize: 10e6 // Aumenta el límite de tamaño si es necesario, sin esto los equipos enviados hacia a cada cliente no podrian ser enviados por el tamaño excesivo

})

//Configuracion de socket.IO
io.on("connection",( socket ) => {
    userCount++
    console.log(`An user socketID: ${socket.id} has connected Total Users: ${userCount}`)
    io.emit("userCount", userCount)
    socket.emit("updateActiveUsers", activePlayersServer)
    io.emit("updateActiveUsers", activePlayersServer)//Sends all the active users to the client, useful when a new client connects to the server and it hasn´t the data of the players
    socket.on("disconnect", ( ) => {
            //Eliminar room
            for (let i = 1; i <= roomsCount; i++) {
                let roomID = `room-${i}`

                rooms[roomID].players = rooms[roomID].players.filter(player => player.id !== socket.id);
                waitingPlayers = waitingPlayers.filter(player => player.id !== socket.id);
                
                if(rooms[roomID].players.length == 0){
                    roomsCount--
                    delete rooms[roomID]
                    return "Room empty"
                }
            }
             // Eliminar al jugador desconectado de la lista activePlayersServer
            activePlayersServer = activePlayersServer.filter(player => player.id !== socket.id)
            console.table(activePlayersServer)
        userCount --;
        console.log(`An user has disconnected ${socket.id}, left users: ${userCount}`)
        io.emit("userCount", userCount)
        io.emit("updateActiveUsers", activePlayersServer)

    })

    socket.on("player-accepted", ( playerData ) => {
        activePlayersServer.push(playerData)
        io.emit("player-accepted", (playerData))
        console.table(activePlayersServer)

    })
    socket.on("join-room", ( playerData) => {
        playerData.socketId = socket.id; // Guardamos el id del socket para poder usarlo despues para unir al jugador 2 al mismo room que jugador 1.
        waitingPlayers.push(playerData); //Añade jugador a la sala de espera

        if(waitingPlayers.length === 1){
            roomsCount++;
            const roomID = `room-${roomsCount}`;

            rooms[roomID] = {
                id: roomID,
                players: [playerData]
            };
            playerData.roomID = roomID;
            socket.join(roomID);
            console.log(`new room: ${roomID} with ${playerData.id}`);
        } else if (waitingPlayers.length >= 2 ){
            const player1 = waitingPlayers.shift(); //Primer jugador que esperaba elimando de waiting players
            const player2 = waitingPlayers.shift(); //Segundo jugador que esperaba elimando de waiting players

            //Obtener la sala del priemer jugador
            const roomID = player1.roomID;
            //Añadir segundo jugador a la sala existente.
            rooms[roomID].players.push(player2);
            //Guardar roomID al segundo jugador tambien
            player2.roomID = roomID;
            //Buscar el socket del priemer jugador y unirlo si no lo esta
            const socket1 = io.sockets.sockets.get(player1.socketId);
            if(socket1){socket1.join(roomID)};
            socket.join(roomID); //También une al jugador 2 al socket actual
            console.log(`Room Full: ${roomID} with ${rooms[roomID].players})`)

            io.to(roomID).emit("start-game",rooms[roomID]);
        }

    })
    socket.on("updateData", (data, roomID) => {
        console.log("Refreshing the player database")
        activePlayersServer = data //Voltear el para que sea como estaba funcionando hace rato
        console.log(activePlayersServer)
        rooms[roomID] = {
            id: roomID,
            players: activePlayersServer

        }
        io.to(roomID).emit("updateData", rooms[roomID], roomID)
        // io.emit("updateData", activePlayersServer)
    })
    socket.on("showNewHealth", (pokemon, totalDamage, socketId, roomID) => {
        console.log({"socketId": socketId})
        console.log({pokemon, totalDamage})
        io.to(roomID).emit("showNewHealth", pokemon, totalDamage, socketId )
        // io.emit("showNewHealth", pokemon, totalDamage, socketId )
    })


    // socket.on("updatePlayers", ( data ) => {
    //     activePlayersServer = data
    //     console.table(activePlayersServer)
    //     io.emit("updatePlayers" , data)
    // })
})
app.use(express.static("public"));
app.use(express.static(path.join(__dirname, "public", "client")));
app.use(express.static(path.join(__dirname, "public", "client", "assets")));
app.use(logger("dev"));

app.get("/", ( req, res ) => {
    res.sendFile(path.join(__dirname, "/public/client","index.html"));
})

app.get("/game/selection-menu", ( req, res ) => {
    res.sendFile(path.join(__dirname, "/public/client","selection.html"));
})
app.get("/game/online/search-match", ( req, res) => {
    res.sendFile(path.join(__dirname, "/public/client", "search-match.html"));
})
app.get("/game/jrpg", ( req, res ) => {
    res.sendFile(path.join(__dirname, "/public/client","jrpg.html"));
})
app.get("/game/jrpgPVP", ( req, res ) => {
    res.sendFile(path.join(__dirname, "/public/client","jrpg-pvp.html"));
})

server.listen(port, "0.0.0.0" ,() => {
    console.log(`Server listening on http://localhost:${port}/`)
})

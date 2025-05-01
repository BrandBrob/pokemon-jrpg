const express = require("express")
const path = require("path")
const logger = require("morgan")

const {Server} = require("socket.io")
const {createServer} = require("node:http")

const app = express();
let userCount = 0;
const port = process.env.PORT || 3000;

let activePlayersServer = []
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
    socket.on("updateData", (data) => {
        console.log("Refreshing the player database")
        activePlayersServer = data //Voltear el para que sea como estaba funcionando hace rato
        console.log(activePlayersServer)
        io.emit("updateData", activePlayersServer)
    })
    socket.on("showNewHealth", (pokemon, totalDamage, socketId) => {
        console.log({"socketId": socketId})
        console.log({pokemon, totalDamage})
        io.emit("showNewHealth", pokemon, totalDamage, socketId )
    })

    
    socket.on("updatePlayers", ( data ) => {
        activePlayersServer = data
        console.table(activePlayersServer)
        io.emit("updatePlayers" , data)
    })
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

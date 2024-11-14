const express = require("express")
const path = require("path")
const logger = require("morgan")

const {Server} = require("socket.io")
const {createServer} = require("node:http")

const app = express();
let userCount = 0;
const port = process.env.PORT || 3000;

const server = createServer(app)
const io = new Server(server, {
    connectionStateRecovery:{ }
})

//Configuracion de socket.IO
io.on("connection",( socket ) => {
    userCount++
    console.log(`An user has connected Total Users: ${userCount}`)
    
    io.emit("userCount", userCount)
    
    socket.on("disconnect", ( ) => {
        userCount --;
        console.log("An user has disconnected")
        io.emit("userCount", userCount)
    })
    
    socket.on("player-accepted", ( e, id ) => {
        console.log("Jugador acceptado" + e)
        totalUsers = userCount
        io.emit("player-accepted", (e, id))
    })
})

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
app.get("/game/jrpgPVP/start", ( req, res ) => {
    res.sendFile(path.join(__dirname, "/public/client/code/online-code","online-jrpg.js"));
})


server.listen(port,() => {
    console.log(`Server listening on http://localhost:${port}/`)
})

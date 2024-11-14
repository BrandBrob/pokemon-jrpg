import {io} from "https://cdn.socket.io/4.8.1/socket.io.esm.min.js"
const socket = io()


const btnPlay = document.getElementById("search-match")
const btnStartMatch = document.getElementById("start-match-btn")
const playerPokemons = JSON.parse(localStorage.getItem("pokemons"))

const activePlayers = { players: []};
console.log(btnPlay)
socket.on("connect", () => {
    console.log("Connected to server")
})

socket.on("userCount",(userCount) => {
    console.log({totalPlayers: userCount})
})
socket.on("player-accepted", (team, id) => {
    console.log({idofPlayers: id})
    activePlayers.players.push({id: id, pokemons: playerPokemons})

    console.log(activePlayers)
    if(activePlayers.players.length === 2){
        const player0Id = activePlayers.players[0].id
        const player1Id = activePlayers.players[1].id
        console.log(player0Id, player1Id)
        document.querySelector(".h1-msg").innerHTML = "Player found, ready for a match"
        btnStartMatch.classList.remove("dis")

        btnStartMatch.addEventListener("click",()=> {

            document.getElementById("match-making-page").classList.add("dis")

            axios.get("/game/jrpgPVP")
            .then( (res) => {
                const jrpgPage = document.getElementById("jrpg-page")
                jrpgPage.innerHTML = res.data;
                jrpgPage.classList.remove("dis")

                      // Agregar el script de combate (online-jrpg.js) dinámicamente
                const combatScript = document.createElement("script");
                combatScript.src = "/game/jrpgPVP/start";
                combatScript.type = "module";
                jrpgPage.appendChild(combatScript);
            })
            .catch(error =>{
                console.log("error" + error)
            })
            assingDefaultPokemons(player0Id,player1Id)
        })
    }

})
btnPlay.addEventListener("click", (e) => {
    e.preventDefault()
    document.querySelector(".h1-msg").classList.remove("dis")
    btnPlay.classList.add("dis")

    socket.emit("player-accepted" , playerPokemons)
})


export{socket}
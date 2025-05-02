import {io} from "https://cdn.socket.io/4.8.1/socket.io.esm.min.js"

import {enemyHealthNumber,aplyDamage,aplyDamageToPlayer,playerHealthBar,enemyHealthBar,updateHealthBar,types} from "./online-damageDOM.js"
import {selecctedPokemon2,baseLevelPokemon,assingPokemonStats,calculateDamage,checkEfectivines,checkWeaknessType,calculateEnemyToPlayerDamage,dataTeam,addInformationPlayer,addInformationEnemy} from "./online-stats.js"
// import {cryPokemon,lowHp,BGaudio,playLowHpMusic,playBGmusic} from "./online-audio.js"
const socket = io()

const btnPlay = document.getElementById("search-match")
const btnStartMatch = document.getElementById("start-match-btn")
const playerPokemons = JSON.parse(localStorage.getItem("pokemons"))

let userCount
let activePlayers = [];
let roomID;

//Player
let playerName;
let playerAllowedToPlayOnline = false;


if(localStorage.getItem("pokemons")){
    playerAllowedToPlayOnline = true;
} else{
    document.getElementById("online-pop").classList.remove("dis");
}



socket.on("connect", () => {
    console.log("Connected to server")
    socket.on("updateActiveUsers", (actualPlayers) => {
        activePlayers = actualPlayers
    })
})

socket.on("userCount",(userCount) => {
    userCount = userCount
    socket.emit("userCount")
})

socket.on("start-game", (roomData) => {
    try{
        console.log("Hola pendejos inicio el juego muajaj")
        console.log(roomData)
        activePlayers = roomData.players;
        roomID = roomData.id;
    if(activePlayers.length === 2){
        document.querySelector(".h1-msg").innerHTML = "Player found, ready for a match"
        btnStartMatch.classList.remove("dis")


            document.getElementById("match-making-page").classList.add("dis")

            axios.get("/game/jrpgPVP")
            .then( (res) => {

                let player1 = activePlayers[0]
                let player2 = activePlayers[1]
                //Assings who is going to be the main player for the socket (page). So the players always look at his pokemon back
                let playerMain = null
                let playerTwo = null
                if(player1.id == socket.id){
                    playerMain = player1
                    playerTwo = player2
                }
                if(player2.id == socket.id){
                    playerMain = player2
                    playerTwo = player1
                }

                const jrpgPage = document.getElementById("jrpg-page")
                jrpgPage.innerHTML = res.data;
                jrpgPage.classList.remove("dis")
                startGame(playerMain, playerTwo, roomID) //Starts game, playerMain is the pokemon that is going to be controlled by the client, the other one is goign to be controlled by the other player

            })
            .catch(error =>{
                console.log("error" + error)
                console.log("Stack Trace: ", error.stack)
            })
        
    }
    }
    catch(error){
        console.log("error" + error)
        console.log("Stack Trace: ", error.stack)
    }
})


const startGame = (playerMain, playerTwo, roomID) => {
    const statusGame = {
        avaibleToAttacK: false
    }

    const principalMenu = document.querySelector(".selecction__div");
    //Menus div
    const menuFightDiv = document.querySelector(".menuPokemonFight");
    const menuBagDiv = document.querySelector(".menuPokemonBag");
    const menuPokemonDiv = document.querySelector(".menuPokemonPoke");
    const menuRunDiv = document.querySelector(".menuPokemonRun");
    //Menus
    const menuFight = document.getElementById("menu-fight");
    const menuBag = document.getElementById("menu-bag");
    const menuPokemon = document.getElementById("menu-pokemon");
    const menuRun = document.getElementById("menu-run");
    
const playerDiv = document.querySelector(".player__div");
const playerInfo = document.querySelector(".player-bar__div");
const playerName = document.getElementById("player-name");
const healthNum = document.querySelector(".health-num-player");
const playerType = document.getElementById("player-types");
const playerPokeImg = document.querySelector(".player-poke__img");

const enemyDiv = document.querySelector(".enemy__div");
const enemyName = document.getElementById("enemy-name");
const enemyInfo = document.querySelector(".enemy-bar__div")
const healthNumEnemy = document.querySelector(".enemy-health-num");
const enemyType = document.getElementById("enemy-types");
const enemyPokeImg  = document.querySelector(".enemy-poke__img");


const playerHealthNumber = document.querySelector(".health-num-player");
const enemyHealthNumber = document.querySelector(".enemy-health-num");
const playerHealthBar = document.querySelector(".player-health-bar");
const enemyHealthBar = document.querySelector(".enemy-health-bar");


    let enemySelecctedPokemon = 0
    let selectedPokemon = 0
    const playerPokemonDefeated = []
    const enemyPokemonDefeated = []
        const obtainPokemonTypes = (types)=>{
        let pokemonTypes = []
        types.forEach(element => {
            pokemonTypes.push(element.type.name)
        });
        return pokemonTypes
}

const triggerAnimation = (element,anim)=>{ // Animation names: "attackingToPlayer", "attacking","appear","animation-takeDamage" //Functions that triggers an animation for a pokemon
    element.classList.add(anim)
    setTimeout(()=>{element.classList.remove(anim)},1000)
}

const updateTypePokemon = (selectedPokemonTypes,selectedType)=>{
    if(selectedPokemonTypes.length == 1) selectedType.innerHTML = selectedPokemonTypes[0]
    else selectedType.innerHTML = `${selectedPokemonTypes[0]} ${selectedPokemonTypes[1]}`
}


    let playerPokemonTypes = obtainPokemonTypes(playerMain.pokemons[playerMain.selectedPokemon][1].types)
    let enemyPokemonTypes = obtainPokemonTypes(playerTwo.pokemons[playerTwo.selectedPokemon][1].types)
    assingPokemonStats(playerMain.pokemons)
    assingPokemonStats(playerTwo.pokemons)
    //Assing default pokemons
     //--------Enemy--------// //INICIALIZACIÓN
    enemyName.innerHTML = playerTwo.playerName;
    enemyPokeImg.src =playerTwo.pokemons[playerTwo.selectedPokemon][1].sprites.versions["generation-v"]["black-white"].animated["front_default"]
    enemyHealthNumber.innerHTML = `${playerTwo.pokemons[playerTwo.selectedPokemon][3].HP}/${playerTwo.pokemons[playerTwo.selectedPokemon][3].baseHealth}`
    updateTypePokemon(enemyPokemonTypes, enemyType);
    triggerAnimation(enemyPokeImg, "appear")
    // cryPokemon(playerMain.pokemons[playerMain.selectedPokemon])
    //--------Player--------// //INICIALIZACIÓN
    playerName.innerHTML = playerMain.playerName;
    playerPokeImg.src =playerMain.pokemons[0][1].sprites.versions["generation-v"]["black-white"].animated["back_default"]
    healthNum.innerHTML = `${playerMain.pokemons[0][3].HP}/${playerMain.pokemons[0][3].baseHealth}`
    updateTypePokemon(playerPokemonTypes, playerType); //
    triggerAnimation(playerPokeImg, "appear")

    //Asign events
for (let i = 1; i <= 4; i++) {
    const optionBtn = document.querySelector(`.option_btn-${i}`)
    const menuDiv = document.querySelector(`.menuPokemonDiv__div-${i}`)
    const menu = document.querySelector(`.menuPokemon__div-${i}`)

    optionBtn.addEventListener("click",(e)=>{
        e.preventDefault()
        principalMenu.classList.add("dis")
        menuDiv.classList.remove("dis")
        menu.classList.remove("dis")
    })
}


const pauseForAttack = () => {

    if(playerMain.enabledToAttack == false){
    principalMenu.classList.add("dis")
    menuPokemonDiv.classList.add("dis")
    menuPokemon.classList.add("dis")
     menuFightDiv.classList.add("dis")
     menuFight.classList.add("dis")

     
    } else{
        principalMenu.classList.remove("dis")
    }
 }
 pauseForAttack()


const updatePokemon = async (player)=>{
    playerDiv.classList.remove("dis")
    playerPokemonTypes = obtainPokemonTypes(playerMain.pokemons[playerMain.selectedPokemon][1].types)
    updateTypePokemon(playerPokemonTypes, playerType);
    playerName.innerHTML = playerMain.playerName
    playerPokeImg.src = playerMain.pokemons[playerMain.selectedPokemon][1].sprites.versions["generation-v"]["black-white"].animated["back_default"]
    healthNum.innerHTML = `${playerMain.pokemons[playerMain.selectedPokemon][3].HP}/${playerMain.pokemons[playerMain.selectedPokemon][3].baseHealth}`
    menuFight.innerHTML = "";
    createAttackButtons(playerMain.pokemons[playerMain.selectedPokemon][2])

    playerMain.pokemons[playerMain.selectedPokemon][2].forEach((element,index) => {
        document.querySelector(`.attack-btn-${index}__name`).innerHTML = playerMain.pokemons[playerMain.selectedPokemon][2][index]["name"].toUpperCase();
        document.querySelector(`.attack-btn-${index}__pp`).innerHTML = `PP ${playerMain.pokemons[playerMain.selectedPokemon][2][index]["pp"]}/${playerMain.pokemons[playerMain.selectedPokemon][2][index]["basePp"]}`
        document.querySelector(`.attack-btn-${index}__type`).innerHTML = `Type: ${playerMain.pokemons[playerMain.selectedPokemon][2][index]["type"]["name"]}`
    });

}
const updatePokemonEnemy = async () => {
    enemyDiv.classList.remove("dis")
    enemyPokemonTypes = obtainPokemonTypes(playerTwo.pokemons[playerTwo.selectedPokemon][1].types)
    updateTypePokemon(enemyPokemonTypes, enemyType);
    enemyName.innerHTML = playerTwo.playerName
    enemyPokeImg.src = playerTwo.pokemons[playerTwo.selectedPokemon][1].sprites.versions["generation-v"]["black-white"].animated["front_default"]
    enemyHealthNumber.innerHTML = `${playerTwo.pokemons[playerTwo.selectedPokemon][3].HP}/${playerTwo.pokemons[playerTwo.selectedPokemon][3].baseHealth}`
}

const updatePlayerTwoPlayerMainData = ( ) => {
    let player1 = activePlayers[0]
    let player2 = activePlayers[1]
    if(player1.id == socket.id){
        playerMain = player1
        playerTwo = player2
    }
    if(player2.id == socket.id){
        playerMain = player2
        playerTwo = player1
    }
    console.table(activePlayers)
}

socket.on("showNewHealth", async (pokemon,totalDamage,socketid, roomID) => {
    if(playerTwo.id === socketid){
        console.log("Player main updates his health")
      let newHP = aplyDamage(totalDamage,playerMain.pokemons[playerMain.selectedPokemon][3])
      playerMain.pokemons[playerMain.selectedPokemon][3].HP = newHP

    } else {
        console.log("Player two updates his health")
        let newHP = aplyDamage(totalDamage,playerTwo.pokemons[playerTwo.selectedPokemon][3])
        playerTwo.pokemons[playerTwo.selectedPokemon][3].HP = newHP
    }
    updatePokemon()
    updatePokemonEnemy()
    console.log(playerMain)
    // console.log(playerTwo)
    checkHealth(socket.id)
    if(playerMain.pokemons.length > 0 && playerTwo.pokemons.length > 0){
    updateHealthBar(enemyHealthBar,playerTwo.pokemons[playerTwo.selectedPokemon][3].HP,playerTwo.pokemons[playerTwo.selectedPokemon][3].baseHealth)
    updateHealthBar(playerHealthBar,playerMain.pokemons[playerMain.selectedPokemon][3].HP,playerMain.pokemons[playerMain.selectedPokemon][3].baseHealth)
    }

    console.log(playerMain,playerTwo)
})

let totalDamage
const calcuteDMGtoEnemy = async (move,index) => {
    move.pp += -1
    let playerTypes = obtainPokemonTypes(playerMain.pokemons[playerMain.selectedPokemon][1].types)
    let enemyTypes = obtainPokemonTypes(playerTwo.pokemons[playerTwo.selectedPokemon][1].types)
    totalDamage = await calculateDamage(playerTypes,enemyTypes,move.type.url,move,playerMain.pokemons[playerMain.selectedPokemon], playerMain.pokemons[playerMain.selectedPokemon][2][0].power,playerTwo.pokemons[playerTwo.selectedPokemon][3])
    return totalDamage

}
const hidePokemon = (pokemonDiv)=>{
    pokemonDiv.classList.add("dis")
}

const checkHealth = (socketid) => {
    console.log(playerMain);
    console.log(playerMain.pokemons[playerMain.selectedPokemon]);
    console.log(playerMain.pokemons[playerMain.selectedPokemon][3].HP) //Health of the player's pokemon
    //Checking health for the main player
    // if(playerMain.pokemons[playerMain.selectedPokemon][3].HP <= 0 ){
        if(playerMain.pokemons.length > 0){
        addInformationEnemy(`The pokemon enemy "${playerMain.pokemons[playerMain.selectedPokemon][0]}" is defeated, the enemy will change its pokemon`)
        if(playerMain.pokemons[playerMain.selectedPokemon][3].HP <= 0 ){
            playerPokemonDefeated.push(playerMain.pokemons[playerMain.selectedPokemon])
            playerMain.pokemons.splice(playerMain.selectedPokemon, 1);
            hidePokemon(playerDiv)
            createPokemonsButtons(playerMain.pokemons, playerPokemonDefeated)
            principalMenu.classList.add("dis")
            menuPokemonDiv.classList.remove("dis")
            menuPokemon.classList.remove("dis")
            
        }
    }

        if(playerTwo.pokemons.length > 0){ //Only if there are pokemons there is going occur the code which saves the defetead pokemons of the enemy
        if(playerTwo.pokemons[playerTwo.selectedPokemon][3].HP <= 0 ){
            enemyPokemonDefeated.push(playerTwo.pokemons[playerTwo.selectedPokemon])
            playerTwo.pokemons.splice(playerTwo.selectedPokemon, 1);
            hidePokemon(enemyDiv)
        }
    }
    
        if (playerMain.pokemons.length === 0) {
        document.querySelector(".principal-fight").classList.add("dis")
        document.querySelector(".menu__form").classList.add("dis")
        document.querySelector(".win").classList.remove("dis")
        document.getElementById("h4-final-msg").innerHTML = "you LOST!"
        return;
        }
        else if(playerTwo.pokemons.length === 0) {
            document.querySelector(".principal-fight").classList.add("dis")
            document.querySelector(".menu__form").classList.add("dis")
            document.querySelector(".win").classList.remove("dis")
            return;
        }

    //Checking health for the enemy player
}



let turn = {round: 0}
let actualTurn = turn.round

const nextTurn = ()=>{ //Function that continues the next turn after the player or the enemy does an attack
    turn.round++
    const turnPlayerDiv = document.querySelector(".information-side_bar__div-player")
    const turnEnemyDiv = document.querySelector(".information-side_bar__div-enemy")
    const infoPlayer = document.createElement("div")
    const infoEnemy = document.createElement("div")
    infoPlayer.classList.add("information")
    infoEnemy.classList.add("information")
    infoPlayer.innerHTML +=`<h4>TURN: ${turn.round}</h4>
    <h4>PLAYER</h4>`
    infoEnemy.innerHTML +=`<h4>TURN: ${turn.round}</h4>
    <h4>ENEMY</h4>`
    turnPlayerDiv.appendChild(infoPlayer)
    turnEnemyDiv.appendChild(infoEnemy)
    
}

socket.on("updateData", ( roomData, roomID ) => {
    activePlayers = roomData.players;
    if(playerMain.pokemons.length > 0 && playerTwo.pokemons.length > 0){
   updatePlayerTwoPlayerMainData();
    updatePokemon();
    updatePokemonEnemy();
    updateHealthBar(enemyHealthBar,playerTwo.pokemons[playerTwo.selectedPokemon][3].HP,playerTwo.pokemons[playerTwo.selectedPokemon][3].baseHealth)
    updateHealthBar(playerHealthBar,playerMain.pokemons[playerMain.selectedPokemon][3].HP,playerMain.pokemons[playerMain.selectedPokemon][3].baseHealth)
    pauseForAttack(playerMain);
    }
})
//Crea botones de ataque en donde se ejecutara el codigo principal de ataques hacia el enemigo y al jugador.
const createAttackButtons = (moves)=>{
    moves.forEach((move,index) => {
        // console.log("Movimiento del usuario:",move)
        const attackBtn = document.createElement("button")
        attackBtn.classList.add(`attack-btn-${index}`, "option_btn")
        attackBtn.setAttribute("move-index", index)
        attackBtn.innerHTML = `
        <h4 class="item-attack attack-btn-${index}__name">${move.name.toUpperCase()}</h4>
                <h4 class="item-attack attack-btn-${index}__pp">PP ${move.pp}/${move.basePp}</h4>
        <div class="attack-miniInfo-div">
        <h4 class="item-attack attack-btn-${index}__power">Power: ${move.power}</h4>
        <h4 class="item-attack attack-btn-${index}__type">Type: ${move.type.name}</h4>
        </div>
      `;
        menuFight.appendChild(attackBtn)

        //Elige el color dependiendo del tipo de movimiento, se obtiene las keys (nombres de los tipos) y verifica si concuerda con el tipo del movimiento, luego hace una busqueda al objeto types con el indice del tipo del movimiento y su contenido sera el color del movimiento
        attackBtn.style.background = types[move.type.name] || '#333';

        attackBtn.addEventListener ("click",async (e)=>{
            e.preventDefault()
            if(move.pp > 0){
                
                console.log(e)
                let indexMove = e.target.getAttribute("move-index") //Gets the index from the move that the user clicked
                console.log({"indexmove":indexMove})
                console.log(playerPokeImg)

            triggerAnimation(playerPokeImg,"attacking")
            triggerAnimation(enemyPokeImg,"animation-takeDamage") //Take Damage Animation
            playerTwo.enabledToAttack = true
            playerMain.enabledToAttack = false //The player who attacked to the other pokemon, its propiety "enabledToAttack" will be turned to false, and the function pauseForAttack() will hide (disable) his menu
            nextTurn()
            addInformationPlayer(`${playerMain.pokemons[playerMain.selectedPokemon][0]} use ${move.name}`)
                //Player damage to enemy
            totalDamage = await calcuteDMGtoEnemy(move, indexMove)
            console.log({"totalDamage": totalDamage})
            socket.emit("updateData", activePlayers, roomID)
            socket.emit("showNewHealth", playerTwo.pokemons[playerTwo.selectedPokemon][3],totalDamage, socket.id, roomID)
        }else{
            alert("You don't have enought PP")
        }})
    });
    
}



const createPokemonsButtons = (pokemons,defeatPokemons)=>{
    document.querySelector(".choosePokemon__div").innerHTML = ""
    pokemons.forEach((poke,index) => {
        const name = document.createElement("h4")
        const sprite = document.createElement("img")
        const pokeBtn = document.createElement("button")
        pokeBtn.classList.add("pokemon-btn")
        pokeBtn.classList.add("option_btn"); sprite.classList.add("item-poke-btn"); name.classList.add("item-poke-btn");
        pokeBtn.setAttribute("id",`pokemon-${index}`)
        pokeBtn.addEventListener("click",(e)=>{
            e.preventDefault()
            triggerAnimation(playerPokeImg,"appear") //Appear animation pokemon
            // Crea feed-back de que el jugador cambio de pokemon y se muestra en la information div.
            console.log(playerMain.selectedPokemon)
            if(playerMain.selectedPokemon != -1){addInformationPlayer(`Player saved ${playerPokemons[playerMain.selectedPokemon][0]}`)}

            addInformationPlayer(`Player changed to ${playerPokemons[playerMain.selectedPokemon][0]}`)
            
            if(playerMain.selectedPokemon == pokeBtn.getAttribute("id").split("-")[1]){ 
                alert("You cannot choose the same pokemon") 
                return}
            playerMain.selectedPokemon = pokeBtn.getAttribute("id").split("-")[1]
            playerTwo.enabledToAttack = true
            playerMain.enabledToAttack = false //The player who attacked to the other pokemon, its propiety "enabledToAttack" will be turned to false, and the function pauseForAttack() will hide (disable) his menu
            pauseForAttack()
            socket.emit("updateData", activePlayers, roomID)
            updatePokemon()
            updatePokemonEnemy()
            updateHealthBar(playerHealthBar,poke[3].HP,poke[3].baseHealth)
            updateMusic()
            cryPokemon(playerPokemons[playerMain.selectedPokemon])
            menuPokemonDiv.classList.add("dis")
            menuPokemon.classList.add("dis")
            principalMenu.classList.add("dis")

            nextTurn()
        })
        sprite.src = pokemons[index][1].sprites.versions["generation-v"]["black-white"].animated["front_default"]
        name.innerHTML = pokemons[index][0]
        pokeBtn.appendChild(sprite)
        pokeBtn.appendChild(name)
        menuPokemon.appendChild(pokeBtn)
    });
    if(defeatPokemons){
    defeatPokemons.forEach((poke,index) => {
        const name = document.createElement("h4")
        const sprite = document.createElement("img")
        const pokeBtn = document.createElement("button")
        pokeBtn.classList.add("pokemon-btn")
        pokeBtn.classList.add("option_btn")
        pokeBtn.classList.add("defeat_btn")
        pokeBtn.setAttribute("id",`pokemon-${index}`)
        pokeBtn.addEventListener("click",(e)=>{
            e.preventDefault()
            alert("This Pokemon has no health ")
        })
        sprite.src = defeatPokemons[index][1].sprites.versions["generation-v"]["black-white"].animated["front_default"]
        name.innerHTML = defeatPokemons[index][0]
        pokeBtn.appendChild(sprite)
        pokeBtn.appendChild(name)
        menuPokemon.appendChild(pokeBtn)
    });
}
}

const goBack = (menu,menuDiv)=>{
    menuDiv.classList.add("dis")
    menu.classList.add("dis")
    principalMenu.classList.remove("dis")
}

const backBtn = document.querySelectorAll(".btn-back")//Make back buttons with a lots of else if and if in there i tried my best
backBtn.forEach(btn => {
    btn.addEventListener("click",(e)=>{
        e.preventDefault()
        console.log(btn.getAttribute("data-menu"))
        if(btn.getAttribute("data-menu") == "menu-fight"){goBack(menuFight,menuFightDiv)}
        else if(btn.getAttribute("data-menu") == "menu-bag"){goBack(menuBag,menuBagDiv)}
        else if(btn.getAttribute("data-menu") == "menu-poke"){goBack(menuPokemon,menuPokemonDiv)}
        else if(btn.getAttribute("data-menu") == "menu-run"){goBack(menuRun,menuRunDiv)}

    })
});
createAttackButtons(playerMain.pokemons[playerMain.selectedPokemon][2])
createPokemonsButtons(playerMain.pokemons, playerPokemonDefeated)
}

if(playerAllowedToPlayOnline){
btnPlay.addEventListener("click", async (e) => {
    e.preventDefault()
    playerName = document.getElementById("input-name").value;
    document.querySelector(".h1-msg").classList.remove("dis")
    btnPlay.classList.add("dis")
    try{
    const  playerData =  {
        number: activePlayers.length + 1,
        id: socket.id,
        pokemons: playerPokemons,
        enabledToAttack: true,
        selectedPokemon: 0,
        playerName: playerName
        }
    if(playerData.number == 2){
        playerData.enabledToAttack = false
    }
    console.log(playerData)
    try{
    socket.emit("join-room", playerData)
     //socket.emit("player-accepted" , playerData)
     }
     catch(e){console.log(e); }
    }
    catch(e){
        console.log(e)
    }
})
} else{

}


export{socket}

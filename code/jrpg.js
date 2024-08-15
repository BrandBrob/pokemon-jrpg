//jrpg.js es el archivo principal en donde ocurrira todo el juego (jrpg) los demas archivos js son para darles funciones o añadir cosas extra al juego como musica.
const pokemonChooseDiv = document.querySelector(".choosePokemon__div");
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


const playerDiv = document.querySelector(".player__div")
const playerInfo = document.querySelector(".player-bar__div")
const playerName = document.getElementById("player-name")
const healthNum = document.querySelector(".health-num-player")
const playerType = document.getElementById("player-types")
const playerPokeImg = document.querySelector(".player-poke__img");

const enemyName = document.getElementById("enemy-name")
const enemyInfo = document.querySelector(".enemy-bar__div")
const healthNumEnemy = document.querySelector(".enemy-health-num")
const enemyType = document.getElementById("enemy-types")
const enemyPokeImg  = document.querySelector(".enemy-poke__img");



import{getItems,listItems,healingItems} from "./items.js"
import { playerPokemons,selecctedPokemon2,baseLevelPokemon,assingPokemonStats, calculateDamage, checkEfectivines,checkWeaknessType, calculateEnemyToPlayerDamage,dataTeam,addInformationPlayer,addInformationEnemy } from "./stats.js";
import {enemyHealthNumber,aplyDamage,aplyDamageToPlayer,playerHealthBar,enemyHealthBar,updateHealthBar,types} from "./damageTakedDom.js";
import {enemyAI,enemyAttacks} from "./enemyAI.js"
import {cryPokemon,lowHp,BGaudio,playLowHpMusic,playBGmusic} from "./audio.js"

//Obtiene datos guardados de los pokemones enemigos para poder usarlos en el todo el codigo. El json se creo mediante el main.js (la seleccion de los pokemon)
const getDataJson = async()=>{
 const res = await axios("/enemyPokemons.json")
 return res.data
}
let turn = { //No se para que sirve pero lo hice
    round: 0,
    playerAction: [],
    enemyAction: [],
    damageToPlayer: [],
    damageToEnemy:[]
}

window.addInformationPlayer = addInformationPlayer
let enemyPokemons = await getDataJson() //Obtains Enemy Pokemons from json
let enemySelecctedPokemon = Math.floor(Math.random()*enemyPokemons.length)
let selecctedPokemon = selecctedPokemon2
const playerPokemonDefeated = []
const enemyPokemonDefeated = []
const obtainPokemonTypes = (types)=>{
    let pokemonTypes = []
    types.forEach(element => {
        pokemonTypes.push(element.type.name)
    });
    return pokemonTypes
}
let playerPokemonTypes = obtainPokemonTypes(playerPokemons[selecctedPokemon][1].types)
let enemyPokemonTypes = obtainPokemonTypes(enemyPokemons[enemySelecctedPokemon][1].types)
assingPokemonStats(playerPokemons)
assingPokemonStats(enemyPokemons)
let movesEnemyAgainstPlayer
if(playerPokemonTypes.length == 1){movesEnemyAgainstPlayer = await enemyAI(enemyPokemons,enemySelecctedPokemon,obtainPokemonTypes(playerPokemons[selecctedPokemon][1].types),checkWeaknessType(playerPokemons[selecctedPokemon][1].types[0].type["url"]))}
else{movesEnemyAgainstPlayer = await enemyAI(enemyPokemons,enemySelecctedPokemon,obtainPokemonTypes(playerPokemons[selecctedPokemon][1].types),checkWeaknessType(playerPokemons[selecctedPokemon][1].types[0].type["url"]),checkWeaknessType(playerPokemons[selecctedPokemon][1].types[1].type["url"]))}
console.log(movesEnemyAgainstPlayer)
//Default POKEMONS
setTimeout(() => {
    cryPokemon(enemyPokemons[enemySelecctedPokemon])
    playerPokeImg.classList.remove("appear")
    enemyPokeImg.classList.remove("appear")
}, 1000);

enemyName.innerHTML = enemyPokemons[enemySelecctedPokemon][1].name.toUpperCase()
enemyPokeImg.src =enemyPokemons[enemySelecctedPokemon][1].sprites.versions["generation-v"]["black-white"].animated["front_default"]
enemyHealthNumber.innerHTML = `${enemyPokemons[enemySelecctedPokemon][3].HP}/${enemyPokemons[enemySelecctedPokemon][3].baseHealth}`

cryPokemon(playerPokemons[selecctedPokemon])
playerName.innerHTML = playerPokemons[0][1].name.toUpperCase()
playerPokeImg.src =playerPokemons[0][1].sprites.versions["generation-v"]["black-white"].animated["back_default"]
healthNum.innerHTML = `${playerPokemons[0][3].HP}/${playerPokemons[0][3].baseHealth}`

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
const turnPlayerDiv = document.querySelector(".information-side_bar__div-player")
const turnEnemyDiv = document.querySelector(".information-side_bar__div-enemy")

const nextTurn = (playerAction,enemyAction,dealDamageEnemy,dealDamagePlayer)=>{
    turn.round++
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
const updateMenuPokemon = (selectedPokemonTypes,selectedType)=>{
    if(selectedPokemonTypes.length == 1) selectedType.innerHTML = selectedPokemonTypes[0]
    else selectedType.innerHTML = `${selectedPokemonTypes[0]} ${selectedPokemonTypes[1]}`
}
updateMenuPokemon(playerPokemonTypes,playerType)
updateMenuPokemon(enemyPokemonTypes,enemyType)
const updatePokemonEnemy = async ()=>{
    enemyPokemonTypes = obtainPokemonTypes(enemyPokemons[enemySelecctedPokemon][1].types)
    updateMenuPokemon(enemyPokemonTypes,enemyType)
    enemyName.innerHTML = enemyPokemons[enemySelecctedPokemon][1].name.toUpperCase()
    enemyPokeImg.src = enemyPokemons[enemySelecctedPokemon][1].sprites.versions["generation-v"]["black-white"].animated["front_default"]
    enemyHealthNumber.innerHTML = `${enemyPokemons[enemySelecctedPokemon][3].HP}/${enemyPokemons[enemySelecctedPokemon][3].baseHealth}`
}

const updatePokemon = async ()=>{
    playerPokemonTypes = obtainPokemonTypes(playerPokemons[selecctedPokemon][1].types)
    if(playerPokemonTypes.length ==1){
        console.log("Pokemon de un tipo",playerPokemonTypes)
    }else{console.log("Pokemon de dos tipos",playerPokemonTypes)}
    if(playerPokemonTypes.length == 1){movesEnemyAgainstPlayer = await enemyAI(enemyPokemons,enemySelecctedPokemon,obtainPokemonTypes(playerPokemons[selecctedPokemon][1].types),checkWeaknessType(playerPokemons[selecctedPokemon][1].types[0].type["url"]))}
    else{movesEnemyAgainstPlayer = await enemyAI(enemyPokemons,enemySelecctedPokemon,obtainPokemonTypes(playerPokemons[selecctedPokemon][1].types),checkWeaknessType(playerPokemons[selecctedPokemon][1].types[0].type["url"]),checkWeaknessType(playerPokemons[selecctedPokemon][1].types[0].type["url"]))}
    console.log(movesEnemyAgainstPlayer)
    updateMenuPokemon(playerPokemonTypes,playerType)
    playerName.innerHTML = playerPokemons[selecctedPokemon][1].name.toUpperCase()
    playerPokeImg.src = playerPokemons[selecctedPokemon][1].sprites.versions["generation-v"]["black-white"].animated["back_default"]
    healthNum.innerHTML = `${playerPokemons[selecctedPokemon][3].HP}/${playerPokemons[selecctedPokemon][3].baseHealth}`
    menuFight.innerHTML = "";
    createAttackButtons(playerPokemons[selecctedPokemon][2])

    playerPokemons[selecctedPokemon][2].forEach((element,index) => {
        document.querySelector(`.attack-btn-${index}__name`).innerHTML = playerPokemons[selecctedPokemon][2][index]["name"].toUpperCase();
        document.querySelector(`.attack-btn-${index}__pp`).innerHTML = `PP ${playerPokemons[selecctedPokemon][2][index]["pp"]}/${playerPokemons[selecctedPokemon][2][index]["pp"]}`
        document.querySelector(`.attack-btn-${index}__type`).innerHTML = `Type: ${playerPokemons[selecctedPokemon][2][index]["type"]["name"]}`
    });

}
const updateMusic = ()=>{
    if(playerHealthBar.style.background === "tomato"){
        playLowHpMusic()
      }else{
        playBGmusic()
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

const hidePlayerPokemons = ()=>{
    playerDiv.classList.add("dis")
}

const triggerAnimation = (element,anim)=>{ // Animation names: "attackingToPlayer", "attacking","appear","animation-takeDamage"
    element.classList.add(anim)
    setTimeout(()=>{element.classList.remove(anim)},1000)
}
let menuPokemonToggle = false

let enemyMove = enemyAttacks(enemyPokemons[enemySelecctedPokemon],movesEnemyAgainstPlayer)

const enemyAttacksPlayer = async ()=>{
    triggerAnimation(enemyPokeImg,"attackingToPlayer")
    let playerTypes = obtainPokemonTypes(playerPokemons[selecctedPokemon][1].types)
    let enemyTypes = obtainPokemonTypes(enemyPokemons[enemySelecctedPokemon][1].types)

    enemyMove = enemyAttacks(enemyPokemons[enemySelecctedPokemon],movesEnemyAgainstPlayer)
    console.log("Movimiento Enemigo", enemyMove)
    addInformationEnemy(`The enemy pokemon ${enemyPokemons[enemySelecctedPokemon][0]} use ${enemyMove.name}`)
    let enemyTotalDamage = await calculateEnemyToPlayerDamage(enemyTypes,playerTypes,enemyMove.type.url,enemyMove,enemyPokemons[enemySelecctedPokemon],enemyMove.power,playerPokemons[selecctedPokemon][3])
        //   console.log(enemyTotalDamage)
  const newPlayerHp = aplyDamageToPlayer(enemyTotalDamage,playerPokemons[selecctedPokemon][3])
  playerPokemons[selecctedPokemon][3].HP = newPlayerHp

          if(newPlayerHp <= 0 ){
            playerPokemonDefeated.push(playerPokemons[selecctedPokemon])
            console.log(playerPokemonDefeated)
            playerPokemons.splice(selecctedPokemon, 1);
            addInformationPlayer("Tu pokemon fue derrotado, cambia de pokemon")
            principalMenu.classList.add("dis")
            menuPokemonDiv.classList.remove("dis")
            menuPokemon.classList.remove("dis")
            menuPokemonToggle = true
            hidePlayerPokemons()
            playerDiv.classList.add("dis")
            selecctedPokemon = -1
            //Reiniciar MenuPokemons
            menuPokemon.innerHTML = ""
            createPokemonsButtons(playerPokemons,playerPokemonDefeated)
          if (playerPokemons.length === 0) {
            alert("Has perdido la pelea!");
            document.querySelector(".principal-fight").classList.add("dis")
            document.querySelector(".menu__form").classList.add("dis")
            const mensaje = document.querySelector(".win"); mensaje.classList.remove("dis"); mensaje.innerHTML="Perdiste :("
            return;
            }
            return
          }
  aplyDamageToPlayer(enemyTotalDamage,playerPokemons[selecctedPokemon][3])
  updateMusic()

}
const playerAttacksEnemy = async (move,attackBtn,index,e)=>{
    move.pp += -1//Actualiza el pp del movimiento usado del jugador
    attackBtn.children[1].innerHTML =`PP ${move.pp}/${move.basePp}`
    let playerTypes = obtainPokemonTypes(playerPokemons[selecctedPokemon][1].types)
    let enemyTypes = obtainPokemonTypes(enemyPokemons[enemySelecctedPokemon][1].types)
   let totalDamage = await calculateDamage(playerTypes,enemyTypes,move.type.url,move,playerPokemons[selecctedPokemon], playerPokemons[selecctedPokemon][2][index].power,enemyPokemons[enemySelecctedPokemon][3])
   console.log(totalDamage)
   const newEnemyHp = aplyDamage(totalDamage,enemyPokemons[enemySelecctedPokemon][3])
   enemyPokemons[enemySelecctedPokemon][3].HP = newEnemyHp
        if(newEnemyHp <= 0 ){
            triggerAnimation(enemyPokeImg,"appear")
            addInformationEnemy("El pokemon fue derrotado, el enemigo cambiara de pokemon")
            enemyPokemonDefeated.push(enemyPokemons[enemySelecctedPokemon])
            enemyPokemons.splice(enemySelecctedPokemon, 1);
            console.log(enemyPokemons )

            if (enemyPokemons.length === 0) {
            alert("Has ganado la pelea!");
            document.querySelector(".principal-fight").classList.add("dis")
            document.querySelector(".menu__form").classList.add("dis")
            document.querySelector(".win").classList.remove("dis")
            return;
            }
            enemySelecctedPokemon = Math.floor(Math.random() * enemyPokemons.length);
            totalDamage = 0
            await updatePokemon()
            updatePokemonEnemy()
            cryPokemon(enemyPokemons[enemySelecctedPokemon])
            aplyDamage(totalDamage,enemyPokemons[enemySelecctedPokemon][3])
            goBack(menuFight,menuFightDiv)
            return
            
        }
   aplyDamage(totalDamage,enemyPokemons[enemySelecctedPokemon][3])
   
    triggerAnimation(enemyPokeImg,"animation-takeDamage") //Take Damage Animation
    //Enemy damage to player
    setTimeout(() => {
        enemyAttacksPlayer()
        triggerAnimation(playerPokeImg,"animation-takeDamage")
    }, 3000);
    menuFightDiv.classList.add("dis")
    menuFight.classList.add("dis")
    setTimeout(() => {
        principalMenu.classList.remove("dis")
        if(menuPokemonToggle == true){ principalMenu.classList.add("dis"), menuPokemonToggle = false}
    }, 4000);

}


//Crea botones de ataque en donde se ejecutara el codigo principal de ataques hacia el enemigo y al jugador.
const createAttackButtons = (moves)=>{
    moves.forEach((move,index) => {
        console.log("Movimiento del usuario:",move)
        const attackBtn = document.createElement("button")
        attackBtn.classList.add(`attack-btn-${index}`, "option_btn")
        attackBtn.innerHTML = `
        <h4 class="item-attack attack-btn-${index}__name">${move.name.toUpperCase()}</h4>
                <h4 class="item-attack attack-btn-${index}__pp">PP ${move.pp}/${move.basePp}</h4>
        <div class="attack-miniInfo-div">
        <h4 class="item-attack attack-btn-${index}__power">Power: ${move.power}</h4>
        <h4 class="item-attack attack-btn-${index}__type">Type: ${move.type.name}</h4>
        </div>
      `;
        menuFight.appendChild(attackBtn)
        
        let allTypes = Object.keys(types) //Elige el color dependiendo del tipo de movimiento, se obtiene las keys (nombres de los tipos) y verifica si concuerda con el tipo del movimiento, luego hace una busqueda al objeto types con el indice del tipo del movimiento y su contenido sera el color del movimiento
        attackBtn.style.background = types[move.type.name] || '#333';

        attackBtn.addEventListener ("click",async (e)=>{
            e.preventDefault()
            if(move.pp > 0){
                
            triggerAnimation(playerPokeImg,"attacking")
            principalMenu.classList.add("dis")
            nextTurn()
            addInformationPlayer(`${playerPokemons[selecctedPokemon][0]} use ${move.name}`)
                //Player damage to enemy
            playerAttacksEnemy(move,attackBtn,index,e)
        }else{
            alert("You don't have enought PP")
        }})
    });
    
}
const createPokemonsButtons = (pokemons,defeatPokemons)=>{
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
            console.log(selecctedPokemon)
            if(selecctedPokemon != -1){addInformationPlayer(`Player saved ${playerPokemons[selecctedPokemon][0]}`)}
            setTimeout(() => {
            addInformationPlayer(`Player changed to ${playerPokemons[selecctedPokemon][0]}`)
            }, 500);
            playerDiv.classList.remove("dis")
            if(selecctedPokemon == pokeBtn.getAttribute("id").split("-")[1]){ 
                alert("You cannot choose the same pokemon") 
                return}
            selecctedPokemon = pokeBtn.getAttribute("id").split("-")[1]
            updatePokemon()
            updateHealthBar(playerHealthBar,poke[3].HP,poke[3].baseHealth)
            updateMusic()
            cryPokemon(playerPokemons[selecctedPokemon])
            menuPokemonDiv.classList.add("dis")
            menuPokemon.classList.add("dis")
            principalMenu.classList.add("dis")
            setTimeout(() => {
                enemyAttacksPlayer()
                triggerAnimation(playerPokeImg,"animation-takeDamage")
                principalMenu.classList.remove("dis")
            }, 3000);
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
let money
let baseMoney = 200;
baseMoney += Math.round(Math.random()*1500);
let moneyString = baseMoney.toString();
if(parseInt(moneyString[1]) > 0 ){
money = parseInt(moneyString[0] + moneyString[0] + "0".repeat(moneyString.length -2));
}else{
 money = parseInt(moneyString[0] + "0".repeat(moneyString.length -1));} // Make the money have zeros insted of numbers from 1-9

        const moneyH4 = document.createElement("h4"); moneyH4.classList.add("money")
        moneyH4.innerHTML=`Money: $${money}`
        menuBag.appendChild(moneyH4)
const createItemButtons = ()=>{
    healingItems.forEach((item,index) => {
    
    if(item.name =="potion"|| item.name =="super-potion" || item.name =="hyper-potion"){
        console.log(item)
        const parts = item.effect_entries[0].short_effect.split(" ")
        const healthPoints = parseInt(parts[1],10);
        const itemBtn = document.createElement("button")
        itemBtn.classList.add("item-btn","option_btn")
        itemBtn.setAttribute("id",`item-${index}-${item.category.name}`)
        itemBtn.innerHTML = `
        <img class="item-item-btn" src=${item.sprites.default}>
        <h4 class="item-item-btn">${item.name}</h4>
        <h4 class="item-item-btn">${item.effect_entries[0].short_effect}</h4>
        <h4 class="item-item-btn">Cost: ${item.cost}</h4>
        `
        itemBtn.addEventListener("click",(e)=>{
            e.preventDefault()
            console.log(healthPoints)

            if(money >= item.cost){

            if(playerPokemons[selecctedPokemon][3].HP !== playerPokemons[selecctedPokemon][3].baseHealth){
            money -= item.cost
            moneyH4.innerHTML=`Money: ${money}`
            playerPokemons[selecctedPokemon][3].HP += healthPoints
            console.log(playerPokemons[selecctedPokemon][3].HP,healthPoints)
            if(playerPokemons[selecctedPokemon][3].HP > playerPokemons[selecctedPokemon][3].baseHealth){
                playerPokemons[selecctedPokemon][3].HP = playerPokemons[selecctedPokemon][3].baseHealth
                console.log(playerPokemons[selecctedPokemon][3].HP)
            }
            console.log(playerPokemons[selecctedPokemon][3])
            nextTurn()
            addInformationPlayer(`${playerPokemons[selecctedPokemon][0]} use ${item.name} it recovers HP: ${healthPoints}`)
            updateHealthBar(playerHealthBar,playerPokemons[selecctedPokemon][3].HP,playerPokemons[selecctedPokemon][3].baseHealth)
            updatePokemon()
            updateMusic() //Actualiza la musica si es que tiene la vida de diferente color
            goBack(menuBag,menuBagDiv)
            principalMenu.classList.add("dis")
            setTimeout(() => {
                enemyAttacksPlayer()
                principalMenu.classList.remove("dis")
            }, 3000);
            }else{
                alert("Your pokemon has full health!!")
                goBack(menuBag,menuBagDiv)
            }
        }else{
            alert("You dont have enought money")
            goBack(menuBag,menuBagDiv)
        }
        })
        menuBag.appendChild(itemBtn)
    }
    });
}
createAttackButtons(playerPokemons[selecctedPokemon][2])
createPokemonsButtons(playerPokemons)
createItemButtons()

document.getElementById("run-btn").addEventListener("click",()=>{
    alert("You cannot run from a friendly fight");
    goBack(menuRun,menuRunDiv);
})

console.log(playerPokemons)
console.log(enemyPokemons)
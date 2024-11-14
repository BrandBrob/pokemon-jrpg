const dataTeam = localStorage.getItem("pokemons");
let playerPokemons = [];
let selecctedPokemon2 = 0;
const baseLevelPokemon = 50;
let esStab = false
const turnPlayerDiv = document.querySelector(".information-side_bar__div-player")
const turnEnemyDiv = document.querySelector(".information-side_bar__div-enemy")

const addInformationPlayer = (info) => {
    const p = document.createElement("p");
    p.innerHTML = info;
    turnPlayerDiv.appendChild(p)
    
};
const addInformationEnemy = (info) => {
    const p = document.createElement("p");
    p.innerHTML = info;
    turnEnemyDiv.appendChild(p)
};
if(dataTeam){
    playerPokemons = JSON.parse(dataTeam)
    console.log(playerPokemons)
} else{
    console.log("No se ha encontrado ningun pokemon guardado")
}

const assingPokemonStats = (PlayerOrEnemy)=>{
    PlayerOrEnemy.forEach((pokemon,index) => {
        pokemon.push({
            baseHealth: Math.floor((PlayerOrEnemy[index][1].stats[0].base_stat*2+20+85/4)*baseLevelPokemon/100+50+10),
            HP: Math.floor((PlayerOrEnemy[index][1].stats[0].base_stat*2+20+85/4)*baseLevelPokemon/100+50+10),
            attack : Math.floor((PlayerOrEnemy[index][1].stats[1].base_stat*2+20+100/4)*baseLevelPokemon/100)+5,
            defense : Math.floor((PlayerOrEnemy[index][1].stats[2].base_stat*2+20+100/4)*baseLevelPokemon/100)+5,
            specialAttack : Math.floor((PlayerOrEnemy[index][1].stats[3].base_stat*2+20+100/4)*baseLevelPokemon/100)+5,
            specialDefense : Math.floor((PlayerOrEnemy[index][1].stats[4].base_stat*2+20+100/4)*baseLevelPokemon/100)+5,
            speed : Math.floor((PlayerOrEnemy[index][1].stats[5].base_stat*2+20+100/4)*baseLevelPokemon/100)+5,
        })
    })
    return
}

const checkEfectivines = async (playerType)=>{
const resPlayer = await axios(playerType);

let playerdamageRelations = resPlayer.data.damage_relations
// console.log(playerdamageRelations,enemydamageRelations)
let doubleDamageTo = Object.values(playerdamageRelations.double_damage_to)
let halfDamageTo = Object.values(playerdamageRelations.half_damage_to)
let noDamageTo = Object.values(playerdamageRelations.no_damage_to)
// console.log(doubleDamageTo)
const against={
    doubleDamageTo: doubleDamageTo,
    halfDamageTo: halfDamageTo,
    noDamageTo: noDamageTo
}
// console.log(against)
return against
}
const checkWeaknessType = async (playerType)=>{
    const resPlayer = await axios(playerType);
    
    let playerdamageRelations = resPlayer.data.damage_relations
    // console.log(playerdamageRelations,enemydamageRelations)
    let doubleDamageFrom = Object.values(playerdamageRelations.double_damage_from)
    let halfDamageFrom = Object.values(playerdamageRelations.half_damage_from)
    let noDamageFrom = Object.values(playerdamageRelations.no_damage_from)
    // console.log(doubleDamageTo)
    const against={
        doubleDamageFrom: doubleDamageFrom,
        halfDamageFrom: halfDamageFrom,
        noDamageFrom: noDamageFrom
    }
    // console.log(against)
    return against
    }

const calculateDamage = async(playerType,enemyType,playerTypeUrl,move,playerPokemon,power,enemyStats)=>{
const attack = playerPokemon[3].attack
const specialAttack = playerPokemon[3].specialAttack
const accuracy = move.accuracy
let defense = enemyStats.defense
let especialDefense = enemyStats.specialDefense
let baseDamage
if(move.damageClass.name == "physical" || move.damageClass.name =="special"){
if(playerType[0] == move.type.name){
    esStab = true
}else{esStab = false}

if(  power !== null){
if(move.damageClass.name =="physical"){
 baseDamage = ((2*50+10)/250)*(attack/defense)*power+2}
else if(move.damageClass.name =="special"){
    baseDamage = ((2*50+10)/250)*(specialAttack/especialDefense)*power+2
}

if(esStab == true){
    baseDamage*=1.5
    esStab = false
}
const against = Object.values(await checkEfectivines(playerTypeUrl));
console.log(against)
let superEfective = []
let halfEfective = []
let noDamage = []
against[0].forEach((type)=>{
    superEfective.push(type.name)
})
against[1].forEach((type)=>{
    halfEfective.push(type.name)
})
against[2].forEach((type)=>{
    noDamage.push(type.name)
})

if(superEfective.includes(enemyType[0])){
    baseDamage*=2
    addInformationPlayer("super efectivo")
}
else if(halfEfective.includes(enemyType[0])){
    baseDamage*=0.5
    addInformationPlayer("No es tan efectivo")
}
else if(noDamage.includes(enemyType[0])){
    baseDamage*=0
    addInformationPlayer("No hace daño a ese tipo")
}
let variation = Math.random()* 0.15 + 0.85
baseDamage*=variation
// console.log(move)
let finalDamage = Math.round(baseDamage)
// console.log(finalDamage)
addInformationPlayer(`You deal ${finalDamage} damage`)
return finalDamage
}
}
}

const calculateEnemyToPlayerDamage = async(enemyType,playerType,enemyTypeURL,move,enemyPokemon,power,playerStats)=>{
    const attack = enemyPokemon[3].attack
    const specialAttack = enemyPokemon[3].specialAttack
    let defense = playerStats.defense
    let especialDefense = playerStats.specialDefense
    let baseDamage
    if(move.damageClass.name == "physical" || move.damageClass.name =="special"){
    if(enemyType[0] == move.type.name){
        esStab = true
    }else{esStab = false}
    
    if(  power !== null){
        if(move.damageClass.name =="physical"){
         baseDamage = ((2*50+10)/250)*(attack/defense)*power+2}
        else if(move.damageClass.name =="special"){
            baseDamage = ((2*50+10)/250)*(specialAttack/especialDefense)*power+2
        }
    
    if(esStab == true){
        baseDamage*=1.5
        esStab = false
    }
    const against = Object.values(await checkEfectivines(enemyTypeURL));
    console.log(against)
    let superEfective = []
    let halfEfective = []
    let noDamage = []
    against[0].forEach((type)=>{
        superEfective.push(type.name)
    })
    against[1].forEach((type)=>{
        halfEfective.push(type.name)
    })
    against[2].forEach((type)=>{
        noDamage.push(type.name)
    })
    if(superEfective.includes(playerType[0])){
        baseDamage*=2
        addInformationEnemy("super efectivo")
    }
    else if(halfEfective.includes(playerType[0])){
        baseDamage*=0.5
        addInformationEnemy("No es tan efectivo :(")
    }
    else if(noDamage.includes(playerType[0])){
        baseDamage*=0
        addInformationEnemy("nope")
    }
    let variation = Math.random()* 0.15 + 0.85
    baseDamage*=variation
    // console.log(move)
    let finalDamage = Math.round(baseDamage)
    // console.log(finalDamage)
    addInformationEnemy(`The enemy deal ${finalDamage} damage`)
    return finalDamage
}
    }
    
    }
export{playerPokemons,selecctedPokemon2,baseLevelPokemon,assingPokemonStats,calculateDamage,checkEfectivines,checkWeaknessType,calculateEnemyToPlayerDamage,dataTeam,addInformationPlayer,addInformationEnemy}
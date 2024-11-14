
const enemyAI = async (enemyPokemons,selecctedEnemy,playerTypes,checkWeaknessFirtsType,checkWeaknessSecoundType)=>{
    console.log(playerTypes)
    let movesTypes = []
   enemyPokemons[selecctedEnemy][2].forEach((move,index) => {
        movesTypes.push([move ,move.type.name])
    });
    let superEffectiveFrom = []
    let halfEffectiveFrom = []
    let noDamageFrom = []
    const playerWeakness = Object.values(await checkWeaknessFirtsType)
    if(checkWeaknessSecoundType){
        const playerWeakness2 = Object.values(await checkWeaknessSecoundType)
        playerWeakness[0].forEach(element => {
            superEffectiveFrom.push(element.name)
        });
        playerWeakness[1].forEach(element => {
            halfEffectiveFrom.push(element.name)
        });
        playerWeakness[2].forEach(element => {
            noDamageFrom.push(element.name)
        });
        playerWeakness2[0].forEach(element => {
            superEffectiveFrom.push(element.name)
        });
        playerWeakness2[1].forEach(element => {
            halfEffectiveFrom.push(element.name)
        });
        playerWeakness2[2].forEach(element => {
            noDamageFrom.push(element.name)
        });
    }else{
        playerWeakness[0].forEach(element => {
            superEffectiveFrom.push(element.name)
        });
        playerWeakness[1].forEach(element => {
            halfEffectiveFrom.push(element.name)
        });
        playerWeakness[2].forEach(element => {
            noDamageFrom.push(element.name)
        });
    }


    
    
    //Saves all the posible moves that the enemy can use
    let moves = []
    let movesSuperEffective = ["Super Effective"]
    let movesHalfEffective = ["Half Effective"]
    let doesDamage = ["Does Damage"]
    let movesNodamage = ["No Damage"]
    movesTypes.forEach(([moveName, moveType]) => {
        if (superEffectiveFrom.includes(moveType)) {
            movesSuperEffective.push([moveName,moveType])
        }
        else if (halfEffectiveFrom.includes(moveType)) {
            movesHalfEffective.push([moveName,moveType])
        }
        else if (noDamageFrom.includes(moveType)) {
            movesNodamage.push([moveName,moveType])
        }
        else{
            doesDamage.push([moveName,moveType])
        }
    });
    // console.log(movesSuperEfective)
    // console.log(movesHalfEfective)
    // console.log(movesNodamage)
    return{
        superEffectiveToPlayer: movesSuperEffective,
        halfEffectiveToPlayer: movesHalfEffective,
        noDamageToPlayer: movesNodamage,
        doesDamageToPlayer: doesDamage
    }
     
}
//Return the best move to use towards the player
const enemyAttacks = (enemyPokemons,movesEffectivenesEnemyAgainstPlayer)=>{
    let moveToUse = ""
    console.log(movesEffectivenesEnemyAgainstPlayer)
    let movesSuperEffective = movesEffectivenesEnemyAgainstPlayer.superEffectiveToPlayer.slice(1);//Coloca los movimientos que puede usar el pokemon
    let movesdoesDamage = movesEffectivenesEnemyAgainstPlayer.doesDamageToPlayer.slice(1);
    let movesHalfEffective = movesEffectivenesEnemyAgainstPlayer.halfEffectiveToPlayer.slice(1);
    let movesNoDamage = movesEffectivenesEnemyAgainstPlayer.noDamageToPlayer.slice(1);

    if (movesSuperEffective.length > 0) {
        const n = Math.floor(Math.random()*movesSuperEffective.length)
        console.log(n)
        moveToUse = movesSuperEffective[n][0]; // Chooses a super effective move
    } else if (movesdoesDamage.length > 0) {
        const n = Math.floor(Math.random()*movesdoesDamage.length)
        console.log(n)
        moveToUse = movesdoesDamage[n][0]; // Chooses a no damage move
    } else if (movesHalfEffective.length > 0) {
        const n = Math.floor(Math.random()*movesHalfEffective.length)
        console.log(n)
        moveToUse = movesHalfEffective[n][0]; // Chooses a half effective move
    } else if (movesNoDamage.length > 0) {
        const n = Math.floor(Math.random()*movesNoDamage.length)
        console.log(n)
        moveToUse = movesNoDamage[n][0]; // Chooses a no damage move
    }
    return moveToUse

    
}
export{enemyAI,enemyAttacks}
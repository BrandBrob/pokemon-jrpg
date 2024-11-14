const playerHealthNumber = document.querySelector(".health-num-player")
const enemyHealthNumber = document.querySelector(".enemy-health-num")
const playerHealthBar = document.querySelector(".player-health-bar")
const enemyHealthBar = document.querySelector(".enemy-health-bar")

const updateHealthBar = (healthBar, health, baseHealth) => {
    const percentage = (health / baseHealth) * 100;
    if(percentage > 70){healthBar.style.background ="#009010"}
    if(percentage < 50){healthBar.style.background ="yellow"}
    if(percentage < 30){healthBar.style.background ="tomato"}
    healthBar.style.width = `${percentage}%`;
  }
const aplyDamage = (damage,enemyStats)=>{
    const damageToEnemy = enemyStats.HP - damage
    enemyHealthNumber.innerHTML = `${enemyStats.HP}/${enemyStats.baseHealth}`
    updateHealthBar(enemyHealthBar,enemyStats.HP,enemyStats.baseHealth)
    return damageToEnemy 
}
const aplyDamageToPlayer = (damage,playerStats)=>{
    const damageToPlayer = playerStats.HP - damage
    playerHealthNumber.innerHTML = `${playerStats.HP}/${playerStats.baseHealth}`
    updateHealthBar(playerHealthBar,playerStats.HP,playerStats.baseHealth)
    return damageToPlayer
    
}
const types = {
    normal: "#e0e0e0",
    fire: "#ff5733",
    water: "#4784f5",
    electric: "#f5f247",
    grass: "#8fd653",
    ice: "#00ebff",
    fighting: "#ffb800",
    poison: "#9e0ca3",
    ground: "##94662e",
    flying: "#96c8d3",
    psychic: "#ca96d3",
    bug: "#179e0c",
    rock: "#8b7d77",
    ghost: "#b99cdd",
    dragon: "#7e4fb8",
    dark: "#333",
    steel:"#434b4d",
    fairy:"#fbe3e3",
}
export{enemyHealthNumber,aplyDamage,aplyDamageToPlayer,playerHealthBar,enemyHealthBar,updateHealthBar,types}
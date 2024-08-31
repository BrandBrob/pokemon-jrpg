const openBtn = document.getElementById("open-menuBtn")
const closeBtn = document.getElementById("close-menuBtn")
const continueGame = document.getElementById("continue-game-a")
const sidebar = document.getElementById("sidebar")
const dataTeam = localStorage.getItem("pokemons")
const startBtn = document.getElementById("start-btn")
if(dataTeam){
    continueGame.href = "jrpg.html"
}else{
    continueGame.addEventListener("click",()=>{alert("You dont have any team saved, for playing a game, make one and then come over!")})
}
openBtn.addEventListener("click",()=>{
    sidebar.classList.toggle("dis")
})
closeBtn.addEventListener("click",()=>{
    sidebar.classList.toggle("dis")
})
startBtn.addEventListener("click",()=>{
    if(dataTeam){
        window.open("jrpg.html")
    } else{
        window.open("selection.html")
    }
})
export{}
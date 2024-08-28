const presetsPokemons = []
let playerPokemons = []
const teamPresetsDiv = document.getElementById("teampresets")

const addPresetToDOM = (pokemon,num) => {
    let teamPreset = document.getElementById(`team-preset-${num}`)
    if(teamPreset){
        teamPreset.classList.remove("dis")
        if(num == 0){teamPreset.innerHTML +="<h3>3 Brothers</h3>"}
        else if(num ==1){teamPreset.innerHTML +="<h3>Cynthia Team</h3>"}
        teamPreset.innerHTML += `<button id= use-preset-btn-${num}>Use Preset</button>`
    }
        pokemon.forEach(poke => {
            console.log(poke)
            teamPreset.innerHTML += `
            <div id = preset-${num}>
                <h4 class="preset-item">${poke[0]}</h4>
                <img class="preset-item preset-img" src=${poke[1]["sprites"]["front_default"]}>
            </div>
            `
        });
        const btn = document.getElementById(`use-preset-btn-${num}`);
        if (btn) {
            btn.addEventListener("click", (e) => {
                console.log(e)
                playerPokemons = pokemon
                const dataTeam = JSON.stringify(playerPokemons);
                localStorage.setItem("pokemons",dataTeam)
                window.open("jrpg.html")
            });
        }
};
const getPresets = async(num)=>{
    const res = await axios(`./assets/presetsJson/preset${num}.json`)
    console.log("pene",res.data)
    presetsPokemons.push(res.data)
    addPresetToDOM(res.data,num)

}

export{getPresets}
const presetsPokemons = [];
let playerPokemons = [];
const teamPresetsDiv = document.getElementById("teampresets");
let catsSelected = false;
const addPresetToDOM = async (pokemon,num) => {
    let teamPreset = document.getElementById(`team-preset-${num}`)
    if(teamPreset){
        teamPreset.classList.remove("dis")
        if(num == 0){teamPreset.innerHTML +="<h3>3 Brothers</h3>"}
        else if(num ==1){teamPreset.innerHTML +="<h3>Cynthia Team</h3>"}
        else if(num == 2){teamPreset.innerHTML += "<h3>Papu team</h3>"; teamPreset.classList.add("team-cats");}
        teamPreset.innerHTML += `<button id= use-preset-btn-${num} class="special-cat-version">Use Preset</button>`
        if(document.getElementById("use-preset-btn-2")){
        document.getElementById("use-preset-btn-2").addEventListener("click", async () => {
            catsSelected = true;
            console.log(catsSelected)
        })
    }
    }


        pokemon.forEach((poke, num) => {
            
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
                // history.pushState("null", "", "/game/jrpg") //Actualiza la ruta hacia el area de jrpg
                location.reload() //Refresca la pagina para que se vean los cambios
            });
        }
};
const getPresets = async(num)=>{
    console.log(num)
    const res = await axios(`/assets/presetsJson/preset${num}.json`)
    console.log(res.data)
    presetsPokemons.push(res.data)
    addPresetToDOM(res.data,num)

}

export{getPresets, catsSelected}
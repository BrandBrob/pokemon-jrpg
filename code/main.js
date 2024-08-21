
const pokemonSelection = document.getElementById("pokemon-selection");
const div = document.querySelector(".pokemon-div");
const ChoosenPokemonDiv = document.querySelector(".choosen-pokemon-div");
const MovesPokemonDiv = document.querySelector(".div-moves")
const btnNext = document.querySelector(".next");
const btnBack = document.querySelector(".back");
const inpPoke = document.getElementById("inp-text");
const inpGene = document.getElementById("inp-gener");
const inpGame = document.getElementById("inp-game");
const inpSearch = document.getElementById("inp-btn");
const inpConfirmPokemon = document.getElementById("inp-confirm");
const dataListPokemon = document.getElementById("inp-text1");
const dataListgen = document.getElementById("inp-gener1");
const dataListgame = document.getElementById("inp-game1");
const pokemonStatsDiv = document.getElementById("stats");
const eraseBtn = document.getElementById("erase-btn");
const confirmAllPokemon = document.getElementById("confirm-all-btn");
const confirmTeam = document.getElementById("confirm-changes")
const pokemonSelectedForMoves = document.getElementById("pokemon-selected-for-moves")
const confirmMovesBtn = document.getElementById("btn-confirmMoves")
const divLocalStorage = document.getElementById("saved-pokemon")

let pokemon = "";
const PokemonAbilities = [];
let playerPokemons = []; //Array principal donde se guardan los pokemones del jugador se usara durante todo el tiempo
const chooseMovesButtons =[]
let statsArray = [];
const movesMax = [1,2,3,4]
const inputsMove = [1,2,3,4]
let dataListMoves = []
let choosePokemonIndex = ""
let timesPlayerConfirmMoves = 0
let localStoragePokemons //Storage all the pokemons from the localStorage
import { getPokemonSpecificMovesAxios ,getAllMoves } from "./moves.js";

const getAllPokemonsNames = async () => {
    for (let i = 1; i < 6; i++) {
        const res = await axios(`https://pokeapi.co/api/v2/generation/${i}/`);
        const pokemons = Object.values(res.data.pokemon_species);
        pokemons.forEach(poke => {
            createOptionPokemon(poke.name);
        });
    }

};

const createOptionPokemon = (pokemon) => {
    try{
    const newOption = document.createElement("option");
    newOption.innerHTML = pokemon;
    dataListPokemon.appendChild(newOption);
    }
    catch(e){ console.log("No se pudo conectar con el servidor") }
};

const getPokemonAxios = async () => {
    try{
    const res = await axios(`https://pokeapi.co/api/v2/pokemon/${pokemon}/`);
    console.log(res.data);
    showName(res.data.name);
    showPokemonId(res.data.id);
    if (res.data.types.length >= 2) {
        showType(res.data.types[0]["type"]["name"], res.data.types[1]["type"]["name"]);
    } else {
        showType(res.data.types[0]["type"]["name"]);
    }
    showImage(res.data.sprites.versions["generation-v"]["black-white"]["animated"]["front_default"]);
    showStats(res.data.stats);
    } catch(e){
        console.log(alert("Este pokemon no existe"))
    }
};

const savePokemons = async (data) => {
    try{
    const res = await axios(`https://pokeapi.co/api/v2/pokemon/${pokemon}/`);
    if (playerPokemons.length < 6) {
        if(res){
        playerPokemons.push([res.data.name, res.data]);}

        const pokemonDiv = document.createElement("div");
        const tinyEraseBtn = document.createElement("button"); tinyEraseBtn.classList.add("eraseBtn")

        pokemonDiv.classList.add("pokemon");
        pokemonDiv.setAttribute("id", playerPokemons.length);
        tinyEraseBtn.innerHTML = "X";
        tinyEraseBtn.classList.add("dis") 

        pokemonDiv.innerHTML += `
        <p>${playerPokemons[playerPokemons.length - 1][0].toUpperCase()}</p>
        <button class="chooseMovesButton dis">Choose the pokemon moves</button>
        <button class="settingBtn dis">Show Skills</button>
        <div class="hasMoves dis">Moves Selected<div>
        `
        tinyEraseBtn.addEventListener("click", () => {
            eliminatePokemonFromArray(pokemonDiv.getAttribute("id"));
        });

        ChoosenPokemonDiv.appendChild(pokemonDiv);
        pokemonDiv.appendChild(tinyEraseBtn);
        eraseButtonsActive(tinyEraseBtn);
        console.log(playerPokemons);

        if (playerPokemons.length === 6) {
            alert("The limit is 6 Pokémon!");
        }
        confirmAllPokemonsFunction();
    }
} 
catch(e){
    console.log(e)
    alert("Try to search the pokemon with the button search")
    return
}


};

const usePokemonFromLocalStorage = async (data) => {
    try{
    const res = await axios(`https://pokeapi.co/api/v2/pokemon/${pokemon}/`);
    if (playerPokemons.length < 6) {
        if(data){
        playerPokemons.push(data)}
        console.log(data)
        const pokemonDiv = document.createElement("div");
        const tinyEraseBtn = document.createElement("button"); tinyEraseBtn.classList.add("eraseBtn");

        pokemonDiv.classList.add("pokemon");
        pokemonDiv.setAttribute("id", playerPokemons.length);
        tinyEraseBtn.innerHTML = "X";
        tinyEraseBtn.classList.add("dis") 

        pokemonDiv.innerHTML += `
        <p>${playerPokemons[playerPokemons.length - 1][0].toUpperCase()}</p>
        <button class="chooseMovesButton dis">Choose the pokemon moves</button>
        <button class="settingBtn dis">Show Skills</button>
        <div class="hasMoves dis">Moves Selected<div>
        `
        
        tinyEraseBtn.addEventListener("click", () => {
            eliminatePokemonFromArray(pokemonDiv.getAttribute("id"));
        });


        ChoosenPokemonDiv.appendChild(pokemonDiv);
        pokemonDiv.appendChild(tinyEraseBtn);
        eraseButtonsActive(tinyEraseBtn);
        console.log(playerPokemons);

        if (playerPokemons.length === 6) {
            alert("The limit is 6 Pokémon!");
        }
        confirmAllPokemonsFunction();
    }
} 
catch(e){
    console.log(e)
    return
}


};

const eraseButtonsActive = (tinyEraseBtn) => {
    eraseBtn.addEventListener("click", () => {
        console.log("Pene")
        tinyEraseBtn.classList.remove("dis");
    });
};

const eliminatePokemonFromArray = (id) => { //Funciona Que elimina un pokemon del playerPokemons y que tambien actualiza su id, // ERROR 
    const index = parseInt(id) - 1;
    playerPokemons.splice(index, 1);
    console.log(playerPokemons); // Shows the actual array
    document.querySelector(`.pokemon[id='${id}']`).remove();
    // Adjust the IDs of the remaining Pokémon divs
    document.querySelectorAll(".pokemon").forEach((div, newIndex) => {
        div.setAttribute("id", newIndex + 1);
    });
};

const showName = (name) => {
    const h2 = document.querySelector(".name");
    h2.classList.remove("dis");
    h2.textContent = name.toUpperCase();
};

const showPokemonId = (pokemonId) => {
    const h3 = document.querySelector(".id");
    h3.classList.remove("dis");
    h3.textContent = `Id: ${pokemonId}`;
};

const showType = (type1, type2 = "") => {
    const h3 = document.querySelector(".type");
    h3.classList.remove("dis");
    h3.textContent = `${type1} ${type2}`;
};

const showImage = (image) => {
    div.innerHTML = `<img src=${image}>`;
};

const showStats = (stats) => {
    stats.forEach((stat, index) => {
        let p = document.createElement("p");
        p.classList.add("stat");
        p.innerHTML = `${stat["stat"]["name"]} ${stat["base_stat"]}`;
        pokemonStatsDiv.appendChild(p);
        statsArray.push(p);
        inpSearch.addEventListener("click", () => {
            p.remove();
        });
    });
};

inpSearch.addEventListener("click", () => {
    pokemon = inpPoke.value.trim().toLowerCase();
    if (pokemon) {
            getPokemonAxios();
            div.innerHTML = "";
    }
});

inpConfirmPokemon.addEventListener("click", ()=>{
    pokemon = inpPoke.value.trim().toLowerCase();
    if(pokemon){
        savePokemons()
    }
});

const confirmAllPokemonsFunction = () => {
    if (playerPokemons.length >= 1) {
        confirmAllPokemon.classList.remove("dis");
        confirmAllPokemon.removeEventListener("click", confirmAllPokemonsHandler); // To avoid multiple bindings
        confirmAllPokemon.addEventListener("click", confirmAllPokemonsHandler);
    }
};
const hasMovesHandler = ()=>{
    const hasMovesDiv = document.querySelectorAll(".hasMoves")
    const chooseMovesButtons = document.querySelectorAll(".chooseMovesButton")
    hasMovesDiv.forEach((hasMoves,index)=>{
        if(playerPokemons[index].length == 3){
            hasMoves.classList.remove("dis")
        } else{
            hasMoves.classList.add("dis")
        }
    });
    chooseMovesButtons.forEach((btn,index)=>{
        if(playerPokemons[index].length == 3){
            btn.innerHTML = " Double-click to change the moves "
        } else{
            btn.innerHTML =" Choose the pokemon moves "
        }
    })

}
const confirmAllPokemonsHandler = () => {
        //Ocultar todos los bottones de borrar
        const eraseBtns = document.querySelectorAll(".eraseBtn")
        eraseBtns.forEach(btn => {btn.classList.add("dis")});
        document.querySelector(".continue-game").classList.add("dis")
        hasMovesHandler()

        playerPokemons.forEach(poke => { //If All pokemons has moves selected it allows the player to continue and play the game
            console.log(poke)
            if(poke.length == 3){
                timesPlayerConfirmMoves++
            }
            console.log(timesPlayerConfirmMoves)
        });
        if(timesPlayerConfirmMoves == playerPokemons.length){
            confirmTeam.classList.remove("dis")
        }
    console.log(playerPokemons);
    confirmAllPokemon.classList.add("dis");
    eraseBtn.classList.add("dis");
    pokemonSelection.classList.add("dis");
    MovesPokemonDiv.classList.remove("dis")
    document.querySelector(".div-main").classList.add("dis")

    const settingButtons = document.querySelectorAll(".settingBtn")

    settingButtons.forEach((button, index) => {
        button.classList.remove("dis");

        button.setAttribute("id", `settings-${index + 1}`);
        button.removeEventListener("click", settingsButtonHandler); // To avoid multiple bindings
        button.addEventListener("click", settingsButtonHandler);
    });

    const chooseMovesBtn = document.querySelectorAll(".chooseMovesButton")

    chooseMovesBtn.forEach((button, index) => {
        chooseMovesButtons.push(index)
        button.classList.remove("dis");
        button.setAttribute("id", `chooseMoves-${index + 1}`);
        button.addEventListener("click", async (e) => {
            e.target.disabled = true
            hasMovesHandler()
            if(document.getElementById(e.target.attributes[1].nodeValue).classList.contains("loadAnim") ||  document.getElementById(e.target.attributes[1].nodeValue).style.background == "green"){
            document.getElementById(e.target.attributes[1].nodeValue).classList.remove("loadAnim")}
            else{
                document.getElementById(e.target.attributes[1].nodeValue).classList.add("loadAnim")
            }
            const moveDiv = document.querySelectorAll(".move-container")
            moveDiv.forEach(div=>{ div.classList.remove("done") })

            if (playerPokemons[index].length === 2) {
            let name = playerPokemons[index][0];
            let availableMoves = await getAllMoves(`https://pokeapi.co/api/v2/pokemon/${name}/`);
            playerPokemons[index].push([availableMoves]);
            console.log(playerPokemons);
            if (dataListMoves.length > 1) {
                removeOptionsMoves(availableMoves, index);
            }
            putOptionsMoves(availableMoves, index);
            addEventListenerToInputsMove(index);
            disableChooseMoveBtn(document.getElementById(`chooseMoves-${index + 1}`))
            return availableMoves;
            } else {
            enableChooseMoveBtn()
            playerPokemons[index].splice(2,1);
            removeAllValueInput()
            removeOptionsMoves();
            console.log(playerPokemons);
        }
    });
});

};

const putOptionsMoves = (availableMoves, pokemonIndex) => {
    movesMax.forEach((moveIndex) => {
        const dataListMove = document.getElementById(`move-list-${moveIndex}`);
        dataListMove.innerHTML = '';
        availableMoves.forEach(move => {
            const newOption = document.createElement("option");
            dataListMoves.push(newOption);
            newOption.classList.add("option");
            newOption.innerHTML = `${move.name.toUpperCase()}`;
            dataListMove.appendChild(newOption);
        });
    });
};

const removeOptionsMoves = ()=>{
    dataListMoves.forEach(option => {
        option.remove()
    });
    dataListMoves = []
}

const removeAllValueInput = ()=>{
    for (let i = 1; i <= 4; i++) {
        const input = document.getElementById(`input-move-searcher-${i}`)
        input.value = ""
    }
}

const disableChooseMoveBtn = (choosen)=>{
    const choosenButton = choosen
    for (let i = 1; i <= chooseMovesButtons.length; i++) {
        const button = document.getElementById(`chooseMoves-${i}`)
            button.style.background = "#ccc"
            button.disabled = true
    }
            choosenButton.disabled = false
            choosenButton.style.background = "green"
}

const enableChooseMoveBtn = ()=>{
    for (let i = 1; i <= chooseMovesButtons.length; i++) {
        console.log(i)
        const button = document.getElementById(`chooseMoves-${i}`)
        button.style.background = "#444"
        button.disabled = false;
    }

}
const settingsButtonHandler = (e) => {
    let button = e.target
    let buttonId = e.target.getAttribute("id");
    let buttonIndex = parseInt(buttonId.split("-")[1]) - 1;
    button.disabled = true
    button.classList.add("dis")
    showPokemonsAbilities(buttonIndex);
};

const showPokemonsAbilities = (index) => {
    const finalPlayerPokemons = playerPokemons;
    let defaultAbi = finalPlayerPokemons[index][1].abilities;
    const pokemonDivSelected = document.getElementById(index + 1);
    const abilitiesDiv = document.createElement("div");
    abilitiesDiv.innerHTML =`<p class="skills">Skills</p>`
    abilitiesDiv.classList.add("pokemon-abilitiesDiv");
    abilitiesDiv.classList.add(index + 1);
    pokemonDivSelected.appendChild(abilitiesDiv);
    defaultAbi.forEach(ability => {
        console.log(finalPlayerPokemons)
        let name = finalPlayerPokemons[index][0]
        PokemonAbilities.push({[name]:ability.ability.name})
        console.log(PokemonAbilities)
        const abilityDiv = document.createElement("p");
        abilityDiv.innerHTML = ability.ability.name;
        abilitiesDiv.appendChild(abilityDiv);
    });
};

let finalMoves = [];
const addEventListenerToInputsMove = (index) => {
    choosePokemonIndex = index
    console.log(choosePokemonIndex)
    const moves = playerPokemons[index][2][0];

    inputsMove.forEach(number => {
        const input = document.getElementById(`input-move-searcher-${number}`);
        
        input.addEventListener("keypress", async (e) => {
            if (e.key === 'Enter') {
                console.log(e.target)
                let inputId = input.getAttribute("id");
                let id = inputId.split("-")[3];
                const moveName = input.value.trim().toLowerCase();
                const foundMove = moves.find(move => move.name.toLowerCase() === moveName);

                if (foundMove) {
                    document.getElementById(`move-name-${id}`).innerHTML = `Name: ${foundMove.name.toUpperCase()}`;
                    document.getElementById(`move-type-${id}`).innerHTML = `Type: ${foundMove.type.name.toUpperCase()}`;
                    document.getElementById(`move-power-${id}`).innerHTML = `Power: ${foundMove.power}`;
                    document.getElementById(`move-accuracy-${id}`).innerHTML = `Accuracy: ${foundMove.accuracy}`;
                    document.getElementById(`move-pp-${id}`).innerHTML = `PP: ${foundMove.pp}`;
                    
                    document.getElementById(`move-effect-${id}`).innerHTML = foundMove.entries?.effect ?? 'No effect available.';
                    console.log(finalMoves)
                    if(finalMoves.length < 4){ //Condicionales que hacen que el jugador puede sobreescribir movimientos finales :)
                    finalMoves.push(foundMove);
                    } 
                    else if(finalMoves.length == 4){
                        finalMoves.splice(id - 1,1, foundMove )
                    }
                    input.value = "";

                    if (finalMoves.length >= 4) {
                        confirmMovesBtn.classList.remove("dis");
                        // Eliminar cualquier listener previo
                        confirmMovesBtn.removeEventListener("click", handleConfirmMovesClick);
                        // Añadir el nuevo listener
                        confirmMovesBtn.addEventListener("click", handleConfirmMovesClick);
                    }
                }
            }
        });
    });
};

const handleConfirmMovesClick = () => {
    hasMovesHandler() //Makes FeedBack to the player, he can see if he choosed moves for the pokemon
    // timesPlayerConfirmMoves.push(1)
    playerPokemons.forEach(poke => {
        console.log(poke)
        if(poke.length == 3){
            timesPlayerConfirmMoves++
        }
        console.log(timesPlayerConfirmMoves)
    });
    if(timesPlayerConfirmMoves == playerPokemons.length){
        confirmTeam.classList.remove("dis")
    }
    let index = choosePokemonIndex;
    const moveDiv = document.querySelectorAll(".move-container")
    moveDiv.forEach(div=>{ div.classList.remove("done") })

    for (let i = 1; i <= finalMoves.length; i++) {
        document.getElementById(`move-name-${i}`).innerHTML = "";
        document.getElementById(`move-type-${i}`).innerHTML = "";
        document.getElementById(`move-power-${i}`).innerHTML = "";
        document.getElementById(`move-accuracy-${i}`).innerHTML = "";
        document.getElementById(`move-pp-${i}`).innerHTML = "";
        document.getElementById(`move-effect-${i}`).innerHTML = "";
    }

    confirmMovesBtn.classList.add("dis");
    
    enableChooseMoveBtn()
    playerPokemons[index].splice(2,1);
    playerPokemons[index].push(finalMoves);
    finalMoves = [];
    console.log(playerPokemons);
};
confirmTeam.addEventListener("click",()=>{
    const dataTeam = JSON.stringify(playerPokemons);
    localStorage.setItem("pokemons",dataTeam)
    window.open("jrpg.html")


})

const dataTeam = localStorage.getItem("pokemons")
if(dataTeam){
    document.querySelector(".continue-game").classList.remove("dis")
    const continueBtn = document.getElementById("continue-btn")
    const useLocalStoragePokemonsBtn = document.getElementById("use-pokemons-btn")
    useLocalStoragePokemonsBtn.addEventListener("click",()=>{
        if(playerPokemons.length + localStoragePokemons.length > 6){
            alert("You must erase some pokemons to use these pokemons")
        }else{
            localStoragePokemons.forEach(poke => {
                usePokemonFromLocalStorage(poke)
            });
            console.log(playerPokemons)
            document.querySelector(".continue-game").classList.add("dis")
        }

    })
    continueBtn.addEventListener("click",()=>{
        window.open("jrpg.html")}
    )
    localStoragePokemons = JSON.parse(dataTeam)
    console.log(localStoragePokemons)
    localStoragePokemons.forEach(poke => {
        console.log(poke)
        divLocalStorage.innerHTML +=`<div class="continue-item continue-pokemon_div" id="localStorage-pokemon">
                                        <h4>${poke[0].toUpperCase()[0]}${poke[0].substring(1)}</h4>
                                        <img src =${poke[1].sprites.versions["generation-v"]["black-white"]["animated"]["front_default"]}>
                                    </div>`
    });

}else {
    document.querySelector(".continue-game").classList.add("dis")
    console.log("There are no pokemons in the localStorage")
}


getAllPokemonsNames()//Datalist Options
confirmAllPokemonsFunction();// Start the function
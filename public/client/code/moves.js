

const getPokemonSpecificMovesAxios = async(url)=>{
    const res = await axios(url)
    return res.data.moves
}

const getAllMovesDetails = async(url)=>{
    const res = await axios(url)
    return res.data
}

const getAllMoves = async(url)=>{
    const chooseBtn = document.querySelector(".chooseMovesButton")
    const allMoves = await getPokemonSpecificMovesAxios(url)
    const moves = []
    const totalMoves = allMoves.length
    for(const move of allMoves){
        // console.log(move)
        const movesDetails = await getAllMovesDetails(move.move.url)
        console.log(movesDetails)
        if(movesDetails.damage_class.name == "physical" && movesDetails.power !=null|| movesDetails.damage_class.name == "special" && movesDetails.power !=null){
            moves.push({
                name: movesDetails.name,
                power: movesDetails.power,
                accuracy: movesDetails.accuracy,
                priority: movesDetails.priority,
                basePp: movesDetails.pp,
                pp: movesDetails.pp,
                type: movesDetails.type,
                learned_by:  movesDetails.learned_by_pokemon,
                entries:  movesDetails.effect_entries[0],
                large_entries: movesDetails.flavor_text_entries[7],
                damageClass: movesDetails.damage_class,
                URL: move.move.url,
            })
        }
    }
    const btns = document.querySelectorAll(".chooseMovesButton")
    btns.forEach(btn => {btn.classList.remove("loadAnim")});
    
    const moveDiv = document.querySelectorAll(".move-container")
    moveDiv.forEach(div=>{ div.classList.add("done") })
    

    console.log(totalMoves)
    console.log(moves)
    return moves;
}
export{getPokemonSpecificMovesAxios,getAllMoves}
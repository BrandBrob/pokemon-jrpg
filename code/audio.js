

const BGaudio = new Audio("/assets/Pokémon Black & White - Trainer Battle Music (HQ).mp3")
const lowHp = new Audio("/assets/Pokémon Black & White - Critical Health Music (HQ).mp3")
const body = document.getElementById("body")
BGaudio.play()
BGaudio.loop = true

const cryPokemon = (pokemon)=>{
const cry = new Audio(pokemon[1].cries.latest)
cry.play()
}
const playBGmusic = ()=>{
    lowHp.pause()
    BGaudio.play()
}
const playLowHpMusic = ()=>{
    BGaudio.pause()
    lowHp.play()
    lowHp.loop = true
}
export{cryPokemon,lowHp,BGaudio,playLowHpMusic,playBGmusic}
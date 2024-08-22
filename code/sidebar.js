const openBtn = document.getElementById("open-menuBtn")
const closeBtn = document.getElementById("close-menuBtn")
const sidebar = document.getElementById("sidebar")
openBtn.addEventListener("click",()=>{
    sidebar.classList.toggle("dis")
})
closeBtn.addEventListener("click",()=>{
    sidebar.classList.toggle("dis")
})

export{}
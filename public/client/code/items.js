const getItems = async()=>{
    const res = await axios("https://pokeapi.co/api/v2/item-category/healing/")
    return res.data.items
}
const getItemDetails = async(itemUrl) =>{
    const res = await axios(itemUrl)
    try{
    return res.data
}catch(e){

}
}

let listItems = await getItems()
let healingItems = []
for (const item of listItems) {
   const details = await getItemDetails(item.url)
   if(details){
    healingItems.push(details)
   }
}


export{getItems,listItems,healingItems}
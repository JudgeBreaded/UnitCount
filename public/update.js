
const armyDelete = document.getElementById('armyDelete')
const armySubmit = document.getElementById('armySubmit')


if (armySubmit){
armySubmit.addEventListener("click", (e) =>{
    e.preventDefault()
    const armyTitle = document.getElementById("armyTitle").value
    const faction = document.getElementById("faction").value
    const pointValue = document.getElementById("pointValue").value

    fetch("/armygen", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
            title: armyTitle,
            faction: faction,
            totalPoints: pointValue,
        })
    }
    ).then(res => res.json())
    .then(() => {
        window.location.reload()
    })
})
}
armyDelete.addEventListener("click", (e) => {
    const val = armyDelete.value
    removeItem(val)
})

function removeItem(id) {
    fetch(`/deleteArmy`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json', 
        },
        body: JSON.stringify({ id }),
    }).then(res => res.json())
    .then(() => {
        window.location.reload()
    })
}


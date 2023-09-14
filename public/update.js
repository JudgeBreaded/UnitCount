
const armyDelete = document.getElementById('armyDelete')
const armySubmit = document.getElementById('armySubmit')
const armyRemove = document.querySelectorAll(".armyRemove")

armyRemove.forEach(function (cm) {
    cm.addEventListener('click', function () {
        const val = armyDelete.value
        console.log(val)
        removeItem(val)
    });
});

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

if (armySubmit) {
    armySubmit.addEventListener("click", (e) => {
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





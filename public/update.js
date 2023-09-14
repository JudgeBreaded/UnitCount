//Army Variables
const armyDelete = document.getElementById('armyDelete')
const armySubmit = document.getElementById('armySubmit')
const armyRemove = document.querySelectorAll(".armyRemove")
//Unit Variables
const unitForms = document.querySelectorAll('.unitInfoForm');
const unitSumbit = document.getElementById("unitInfoSubmit")
const unitRemove = document.querySelectorAll('.unitRemove')
const unitSpread = document.querySelectorAll('.unitSpread')
const unitDelete = document.getElementById('unitDelete')
const unitAdd = document.querySelectorAll('unitSubmitClass')
const container = document.querySelectorAll('.container');

armyRemove.forEach(function (cm) {
    cm.addEventListener('click',  function() {
        const val = armyDelete.value
        console.log(val)
        removeItem(val)
    });
});
// Adjust the selector as needed
unitRemove.forEach(function (cm) {
    cm.addEventListener('click', function (event) {
        const clickedElement = event.target;

            const unitId = clickedElement.getAttribute('data-unit-id');
            console.log(unitId); // Optionally, log the unitId
            removeUnit(unitId); // Send the delete request
        })
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
function removeUnit(id) {
    fetch("/unit", {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            id
        })

    })
    .then(response => {
        if (response.ok) {
            console.log(`Unit with ID ${id} was deleted.`);
            window.location.reload();
        } else {
            console.error(`Failed to delete unit with ID ${id}.`);
        }
    })
    .catch(error => {
        console.error(`Error: ${error}`);
    });
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

unitForms.forEach(form => {
    form.addEventListener("submit", (e) => {
        e.preventDefault();
        const armyId = form.getAttribute('data-army-id');
        const unitName = form.querySelector(".unitNameInput").value;
        const unitType = form.querySelector(".unitTypeInput").value;
        const unitTier = form.querySelector(".unitTierInput").value;
        const unitPoint = form.querySelector('.unitPointInput').value;

        fetch("/unit", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                unitName: unitName,
                unitType: unitType,
                unitTier: unitTier,
                unitPoint: unitPoint,
                armyId: armyId
            })
        }).then(res => res.json())
            .then(() => {
                window.location.reload();
            });
    });
});



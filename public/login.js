
document.getElementById('loginPage').addEventListener('submit', (e) => {
    e.preventDefault();
    const emailInput = document.getElementById('inputEmail').value
    const passwordInput = document.getElementById('inputPassword').value
    fetch("/", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            "email": emailInput,
            "password": passwordInput
        }),
    })
        .then((response) => {
            if (!response.ok) {
                throw new Error('There was an Error with the Server Request');
            }
            return response.json();
        })
        .then((data) => {
            if (data.success) {
                // Redirect to the URL specified in the JSON response
                window.location.href = data.redirect;
            } else {
                // Handle unsuccessful login
                console.log('Login failed');
            }
        })
        .catch((error) => {
            console.error('Fetch error:', error);
        });
})

document.getElementById("registerRedirect").addEventListener("click", (e)=>{
    fetch("/register", {
        headers: {
            'Content-Type': 'application/json',
        }
    }).then(res => res.json)
    .then(data => console.log(data))
})
function removeItem(id) {
    fetch(`"/deleteArmy/"${id}"`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json', // Specify the content type if needed
            // Add any other headers as needed
        }
    }).then(res => res.json())

};
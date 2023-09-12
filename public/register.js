document.getElementById("userRegister").addEventListener("submit", (e) =>{
    const email = document.getElementById("emailInput").value
    const username = document.getElementById("usernameInput").value
    const password = document.getElementById("passwordInput").value
    const firstName =  document.getElementById("firstNameInput").value
    const lastName = document.getElementById("lastNameInput").value
    const favfaction = document.getElementById("favFactionInput").value
    const location = document.getElementById("locationInput").value
    e.preventDefault()
    console.log(email,username,password, firstName, lastName, favfaction, location)
    fetch("/register", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
            firstName: firstName,
            lastName: lastName,
            username: username,
            email: email,
            password: password,
            location: location,
            favfaction: favfaction,
        })
    }
    ).then(res => res.json())
    .then((data) => {
        if (data.success) {
            // Redirect to the URL specified in the JSON response
            window.location.href = data.redirect;
        } else {
            // Handle unsuccessful login
            console.log('Login failed');
        }
    })
})
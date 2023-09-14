document.getElementById("userUpdate").addEventListener("click", (e) => {
    const userName = document.getElementById("usernameUpdate").value
    const email = document.getElementById("emailUpdate").value
    const firstName = document.getElementById("firstNameUpdate").value
    const lastName = document.getElementById("lastNameUpdate").value
    console.log(userName, email, firstName, lastName)
    e.preventDefault()
    fetch("/settings" , {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            userName: userName,
            email : email,
            firstName : firstName,
            lastName: lastName,
        })
    }).then(res => res.json())
    .then(data => {
        if (data.success) {
            // Redirect to the URL specified in the JSON response
            window.location.href = "/settings";
        } else {
            // Handle unsuccessful login
            console.log('Update Failed');
        }})
    
})
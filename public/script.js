document.getElementById('loginPage').addEventListener('submit', (Event) => {
    Event.preventDefault();
    const emailInput = document.getElementById('InputEmail').value
    const passwordInput = document.getElementById('InputPassword').value
    fetch("/", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            "email": `"${emailInput}"`,
            "password": `"${passwordInput}"`
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
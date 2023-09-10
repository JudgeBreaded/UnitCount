function removeItem(id) {
        fetch(`"/deleteArmy/"${id}"`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json', // Specify the content type if needed
                // Add any other headers as needed
            }
        }).then(results => results.json())
        .then(data => {console.log(data)})
    }


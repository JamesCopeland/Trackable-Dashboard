function callApi(endpoint, token) {
    console.log(token)
    const headers = new Headers();
    const bearer = `Bearer ${token}`;
  
    headers.append("Authorization", bearer);
    headers.append("Content-Type", "application/json")
  
    const options = {
        method: "GET",
        headers: headers
      };
  
    logMessage('Calling web API...');
    
    return (fetch(endpoint, options)
      .then(response => response.json())
      .catch(error => {
        console.error(error);
      })
    );
  }
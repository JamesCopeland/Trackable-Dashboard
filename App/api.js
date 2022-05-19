function callApi(endpoint, token, options, headers) {

    headers = headers || new Headers();
    const bearer = `Bearer ${token}`;
  
    headers.append("Authorization", bearer);
  
    const defaultOptions = {
      method: "GET",
      headers: headers
    };

    options = options || defaultOptions;
  
    logMessage('Calling web API...');
    
    return (fetch(endpoint, options)
      .then(response => {
        if(response.status == 204) {
          return response
        }
        return response.json()
      })
      .catch(error => {
        console.error(error);
      })
    );
  }
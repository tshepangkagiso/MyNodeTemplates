'use strict';
const clientListDiv = document.getElementById("clientList");
const btnAllClients = document.getElementById("get");
// app.js
function fetchData(url) {
    return fetch(url)
      .then(function (response) {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(function (allClients) {
        return allClients; // Return the data here
      })
      .catch(function (error) {
        console.error('Error:', error);
        throw error; // Rethrow the error to be handled elsewhere if needed
      });
}
  
btnAllClients.addEventListener('click',() =>{
    fetchData('http://localhost:3000/home')
    .then(function (allClients) {
      console.log(allClients); // You can access allClients here
      // Perform further processing or rendering as needed
      const clientListHTML = allClients.map(client => {
          return `
            <div class="client">
              <p><strong>ID:</strong> ${client.ClientID}</p>
              <p><strong>Name:</strong> ${client.FirstName} ${client.LastName}</p>
              <p><strong>Address:</strong> ${client.Address}</p>
              <p><strong>Age:</strong> ${client.Age}</p>
              <p><strong>Gender:</strong> ${client.Gender}</p>
            </div>
          `;
        }).join(''); // Join the array of HTML strings into a single string
        
        // Set the innerHTML of the clientListDiv to display the client information
        clientListDiv.innerHTML = clientListHTML;
    })
    .catch(function (error) {
      // Handle errors here
      console.error('Error:', error);
    });
});

  
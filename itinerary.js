const { app, BrowserWindow } = require('electron');
const fs = require('fs');
const path = require('path');
const axios = require('axios'); // Make sure to install axios for API calls

var btnCreate = document.getElementById('btnCreate');
var btnRead = document.getElementById('btnRead');
var btnUpdate = document.getElementById('btnUpdate');
var btnDelete = document.getElementById('btnDelete');

var country = document.getElementById('country');
var placeVisited = document.getElementById('placeVisited');
var date = document.getElementById('date');
var activity = document.getElementById('activity');

var itineraryList = document.getElementById('itineraryList');
var countryInfo = document.getElementById('countryInfo');
var infoContent = document.getElementById('infoContent');

let pathName = path.join(__dirname, 'Files');

// Load and display itineraries
function loadItineraries() {
    fs.readdir(pathName, (err, files) => {
        if (err) {
            return console.log("Error reading directory:", err);
        }
        itineraryList.innerHTML = ""; // Clear previous itineraries
        files.forEach(file => {
            let filePath = path.join(pathName, file);
            fs.readFile(filePath, 'utf8', (err, data) => {
                if (err) {
                    return console.log("Error reading file:", err);
                }
                const itineraryDiv = document.createElement('div');
                itineraryDiv.className = 'itinerary-item';
                itineraryDiv.innerHTML = `
                    <strong>${file.replace('.txt', '')}</strong><br>
                    ${data.replace(/\n/g, '<br>')}
                    <div class="button-container">
                        <button class="btn btn-default update-btn" data-file="${file}">Update</button>
                        <button class="btn btn-default delete-btn" data-file="${file}">Delete</button>
                    </div>
                `;
                itineraryDiv.onclick = () => fetchCountryInfo(file.replace('.txt', '')); // Add click event to fetch country info
                itineraryList.appendChild(itineraryDiv);
            });
        });
    });
}

// fetch country information from an API
function fetchCountryInfo(countryName) {
    const apiUrl = `https://restcountries.com/v3.1/name/${countryName}`; // Example API URL

    axios.get(apiUrl)
        .then(response => {
            const countryData = response.data[0]; // Get the first result
            const continent = countryData.region; // Get continent
            const capital = countryData.capital ? countryData.capital[0] : 'N/A'; // Get capital
            const currency = countryData.currencies ? Object.values(countryData.currencies)[0].name : 'N/A'; // Get currency
            const language = countryData.languages ? Object.values(countryData.languages).join(', ') : 'N/A'; // Get languages

            infoContent.innerHTML = `
                <p><strong>Continent:</strong> ${continent}</p>
                <p><strong>Capital City:</strong> ${capital}</p>
                <p><strong>Travelling Tips:</strong></p>
                <ul>
                    <li>1. Make sure you have changed your currency to ${currency}.</li>
                    <li>2. Learn some basic phrases in ${language}.</li>
                    <li>3. Be aware of tourist scams in ${capital}.</li>
                </ul>
            `;
            countryInfo.style.display = 'block'; // Show the country info section
        })
        .catch(err => {
            console.log("Error fetching country information:", err);
            alert("Could not fetch country information.");
        });
}

// Event delegation for update and delete buttons
itineraryList.addEventListener('click', function(event) {
    if (event.target.classList.contains('update-btn')) {
        const fileName = event.target.getAttribute('data-file');
        loadItineraryForEditing(fileName);
    } else if (event.target.classList.contains('delete-btn')) {
        const fileName = event.target.getAttribute('data-file');
        deleteItinerary(fileName);
    }
});

// Load itinerary for editing
function loadItineraryForEditing(fileName) {
    const file = path.join(pathName, fileName);
    fs.readFile(file, 'utf8', function(err, data) {
        if (err) {
            return console.log("Error reading file:", err);
        }
        const lines = data.split('\n');
        if (lines.length >= 3) {
            // Extracting only the relevant parts
            date.value = lines[0].replace('Date: ', '').trim();
            placeVisited.value = lines[1].replace('Place Visited: ', '').trim();
            activity.value = lines[2].replace('Activities: ', '').trim();
            country.value = fileName.replace('.txt', ''); // Set the country field
        } else {
            alert("The file is not in the expected format.");
        }
    });
}

// Function to delete itinerary
function deleteItinerary(country) {
    const file = path.join(pathName, country.value);
    fs.unlink(file, function(err) {
        if (err) {
            return console.log("Error deleting file:", err);
        }
        alert("Itinerary for " + fileName.replace('.txt', '') + " was deleted.");
        loadItineraries(); // Reload itineraries after deletion
    });
}

// call loadItineraries on initial load
loadItineraries();

// create itinerary
btnCreate.addEventListener('click', function() {
    let file = path.join(pathName, country.value);
    let contents = `Date: ${date.value}\nPlace Visited: ${placeVisited.value}\nActivities: ${activity.value}`;

    fs.writeFile(file, contents, function(err) {
        if (err) {
            return console.log("Error creating file:", err);
        }
        alert("Itinerary for " + country.value + " was created.");
        console.log("The file was created");
        country.value = "";
        placeVisited.value = "";
        date.value = "";
        activity.value = "";
        loadItineraries();
    });
});

// read itinerary
btnRead.addEventListener('click', function() {
    let file = path.join(pathName, country.value); 

    fs.readFile(file, 'utf8', function(err, data) {
        if (err) {
            return console.log("Error reading file:", err);
        }
        const lines = data.split('\n');
        if (lines.length >= 3) {
            // Extracting only the relevant parts
            date.value = lines[0].replace('Date: ', '').trim();
            placeVisited.value = lines[1].replace('Place Visited: ', '').trim();
            activity.value = lines[2].replace('Activities: ', '').trim();
        } else {
            alert("The file is not in the expected format.");
        }

        alert("Itinerary for " + country.value + " has been read.");
        console.log("Itinerary loaded successfully!");
    });
});

// update itinerary
btnUpdate.addEventListener('click', function() {
    let file = path.join(pathName, country.value); 
    let contents = `Date: ${date.value}\nPlace Visited: ${placeVisited.value}\nActivities: ${activity.value}`;

    fs.writeFile(file, contents, function(err) {
        if (err) {
            return console.log("Error updating file:", err);
        }
        alert("Itinerary for " + country.value + " was updated.");
        console.log("The file was updated");
        loadItineraries();
        clearForm();
    });
});

// delete itinerary
btnDelete.addEventListener('click', function() {
    let file = path.join(pathName, country.value); 
    fs.unlink(file, function(err) {
        if (err) {
            return console.log("Error deleting file:", err);
        }
        alert("Itinerary for " + country.value + " was deleted.");
        country.value = "";
        placeVisited.value = "";
        date.value = "";
        activity.value = "";
        console.log("Itinerary deleted!");
        loadItineraries(); 
    });
});
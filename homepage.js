function searchTrails(event) {
    event.preventDefault(); // Prevent the default form submission
    const country = document.getElementById('country').value.trim(); 
    if (country) {
        const url = `https://www.alltrails.com/${encodeURIComponent(country)}`; 
        window.open(url, '_blank'); 
    } else {
        alert('Please enter a country name.'); 
    }
}
// area, continent, region and subregion, capital city, language spoken, time zone, flag & coat of arms, maps, location, population
function buttonClicked() {
    var countryName = document.getElementById("country_input").value;

    fetch(`https://restcountries.com/v3.1/name/${countryName}`)
        .then((response) => response.json())
        .then((data) => {
            document.getElementById("countryName").innerHTML = data[0].name.common;
            document.getElementById("area").innerHTML = data[0].area;
            document.getElementById("continent").innerHTML = data[0].continents;
            document.getElementById("region").innerHTML = data[0].region;
            document.getElementById("subregion").innerHTML = data[0].subregion;
            document.getElementById("capital").innerHTML = data[0].capital;
            document.getElementById("languages").innerHTML = Object.values(data[0].languages).join(", ");
            document.getElementById("timezone").innerHTML = data[0].timezones[0];
            
            const flag = document.getElementById("flag");
            flag.src = data[0].flags.png;
            flag.style.display = "inline";

            const coatOfArms = document.getElementById("coatOfArms")
            coatOfArms.src = data[0].coatOfArms.png;
            coatOfArms.style.display = "inline";

            const latLng = data[0].latlng; // get latitude and longitude
            // provide link to OpenStreetMap
            const mapLink = document.getElementById("mapLink");
            mapLink.href = `https://www.openstreetmap.org/#map=6/${latLng[0]}/${latLng[1]}`; // link to OpenStreetMap
            mapLink.innerHTML = "View Map"; // set link text

            document.getElementById("location").innerHTML = data[0].latlng.join(", ");
            document.getElementById("population").innerHTML = data[0].population;
        });
}

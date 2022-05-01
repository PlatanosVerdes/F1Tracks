let idTrack = sessionStorage.getItem('idTrack');
var nomTrack = idTrack;

async function fetchJSON() {
    const response = await fetch('f1tracks.json');
    if (!response.ok) {
        const message = `An error has occured: ${response.status}`;
        throw new Error(message);
    }
    const data = await response.json();
    return data;
}
fetchJSON().catch(error => {
    error.message; // 'An error has occurred: 404'
});

function getYears(data) {
    var year = data.datos_extra.years;
    var s = "";
    for (var i = 0; i < year.length; i++) {

        if (i == year.length - 1) {
            s += year[i];
        } else {
            s += year[i] + " ,";
        }
    }
    return s;
}

function getPilot(data, idPilot) {

    let pilot = data.participant;

    var plt = {
        id: null,
        name: null,
        lastName: null,
        alternateName: null,
        nationality: null,
        memberOf: null
    }

    for (var i = 0; i < pilot.length; i++) {
        if (pilot[i].id == idPilot) {
            plt.id = pilot[i].id;
            plt.name = pilot[i].name;
            plt.lastName = pilot[i].lastName;
            plt.alternateName = pilot[i].alternateName;
            plt.nationality = pilot[i].nationality;
            plt.memberOf = pilot[i].memberOf;
            break;
        }
    }

    return plt;
}

function getClassification(data, i) {
    var c = data.track[i].datos_extra.classification;
    var ClassificationNames = {
        name: null,
        lastName: null
    }

    let classificationArray = [];

    for (var i = 0; i < c.length; i++) {

        var pilot = getPilot(data, c[i][0]);
        var ClassificationNames = {
            name: pilot.name,
            lastName: pilot.lastName,
            time: c[i][1]
        }
        classificationArray.push(ClassificationNames);
    }

    document.getElementById('primeroNombre').innerHTML = `${classificationArray[0].name} ${classificationArray[0].lastName}`;
    document.getElementById('primeroTiempo').innerHTML = `${classificationArray[0].time}`;
    document.getElementById('segundoNombre').innerHTML = `${classificationArray[1].name} ${classificationArray[1].lastName}`;
    document.getElementById('segundoTiempo').innerHTML = ` + ${classificationArray[1].time}`;
    document.getElementById('terceroNombre').innerHTML = `${classificationArray[2].name} ${classificationArray[2].lastName}`;
    document.getElementById('terceroTiempo').innerHTML = ` + ${classificationArray[2].time}`;
    document.getElementById('cuartoNombre').innerHTML = `${classificationArray[3].name} ${classificationArray[3].lastName}`;
    document.getElementById('cuartoTiempo').innerHTML = ` + ${classificationArray[3].time}`;

}

async function printTrackMainInfo(data) {
    let tracks = data.track;

    var i;
    for (i = 0; i < tracks.length; i++) {
        if (tracks[i].identifier == nomTrack) {
            break;
        }
    }

    maps(tracks, i);
    var idPilot = tracks[i].datos_extra.lapRecord.pilot;
    var pilot = getPilot(data, idPilot)
    var years = getYears(tracks[i]);

    document.getElementById('img-track').src = `assets/img/tracks/${tracks[i].image[0]}`;
    document.getElementById('alterName-track').innerHTML = `${tracks[i].alternateName}`;
    document.getElementById('name-track').innerHTML = `${tracks[i].name}`;
    document.getElementById('location-track').innerHTML = `${tracks[i].GeoCoordinates.addressCountry}`;
    document.getElementById('distance-track').innerHTML = `${tracks[i].datos_extra.trackDistance} km`;
    document.getElementById('laps-track').innerHTML = `${tracks[i].datos_extra.numberLaps}`;
    document.getElementById('years-track').innerHTML = `${years}`;
    document.getElementById('record-time-track').innerHTML = `${tracks[i].datos_extra.lapRecord.time}`;


    let img = document.createElement("img");
    img.setAttribute("class", "img-fluid rounded");
    img.setAttribute("alt", "Flag Country");
    img.src = "assets/img/flags/" + pilot.nationality + ".svg";

    let detailLapRecord = document.createElement("div");
    detailLapRecord.setAttribute("class", "detail-info-content");
    detailLapRecord.innerHTML = `${pilot.name} ${pilot.lastName}`;

    let lapRecord = document.getElementById("pilot-record-track");
    lapRecord.appendChild(img);
    lapRecord.appendChild(detailLapRecord);

    document.getElementById('record-time-track').innerHTML = `${tracks[i].datos_extra.lapRecord.time}`;
    document.getElementById('description-track').innerHTML = `${tracks[i].description}`;

    var classi = getClassification(data, i);
}

window.addEventListener('load', initTrack)
async function initTrack() {
    let data = await fetchJSON();
    
    playAudio();
    printTrackMainInfo(data);
}

/* Funcion que reproduce un audio al cargar la pagina */
function playAudio() {
    audio = document.getElementById("index-audio");
    audio.muted = false;
    audio.play();
    audio.volume = 0.35;
}

//API MAPS
function maps(listacirc, num) {
    let coor = listacirc[num].GeoCoordinates;
    let long = coor.longitude;
    let lat = coor.latitude;
    const bounds = [
        [lat, long], // [west, south]
        [lat, long]  // [east, north]
    ];
    var map = L.map('map2').setView([lat, long], 14);
    L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
        attribution: `${listacirc[num].GeoCoordinates.addressCountry},${listacirc[num].GeoCoordinates.addressLocality}`,
        maxZoom: 18,
        minZoom: 5,
        id: 'mapbox/streets-v11',
        tileSize: 512,
        zoomOffset: -1,
        accessToken: 'pk.eyJ1IjoicGF1aW5kYW5pY29sYXUiLCJhIjoiY2wyazhmZm80MGF5cDNicGtlazdyN3kxbyJ9.zoF8CP2CPUgGrw0U8e2_cA'
    }).addTo(map);
    map.setMaxBounds(bounds);

    var marker = L.marker([lat, long]).addTo(map);
    marker.bindPopup(`<b>${listacirc[num].name}</b><br>${listacirc[num].alternateName}`);
}

function trackfav() {
    console.log("hello")
}
trackFav = document.getElementById("ico-fav");
trackFav.addEventListener('click', trackfav);
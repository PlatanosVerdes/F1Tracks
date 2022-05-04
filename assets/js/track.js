const nameTrack = sessionStorage.getItem('nameTrack');
const idTrack = sessionStorage.getItem('idTrack');

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

function sessionVarWhenClickNav(save) {
    sessionStorage.setItem('navClicked', save);
    location.href = "index.html";
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
    if (c[0] != null) {
        for (var i = 0; i < c.length; i++) {
            var pilot = getPilot(data, c[i][0]);
            var ClassificationNames = {
                name: pilot.name,
                lastName: pilot.lastName,
                time: c[i][1],
            };
            classificationArray.push(ClassificationNames);
        }

        document.getElementById(
            "primeroNombre"
        ).innerHTML = `${classificationArray[0].name} ${classificationArray[0].lastName}`;
        document.getElementById(
            "primeroTiempo"
        ).innerHTML = `${classificationArray[0].time}`;
        document.getElementById(
            "segundoNombre"
        ).innerHTML = `${classificationArray[1].name} ${classificationArray[1].lastName}`;
        document.getElementById(
            "segundoTiempo"
        ).innerHTML = ` + ${classificationArray[1].time}`;
        document.getElementById(
            "terceroNombre"
        ).innerHTML = `${classificationArray[2].name} ${classificationArray[2].lastName}`;
        document.getElementById(
            "terceroTiempo"
        ).innerHTML = ` + ${classificationArray[2].time}`;
        document.getElementById(
            "cuartoNombre"
        ).innerHTML = `${classificationArray[3].name} ${classificationArray[3].lastName}`;
        document.getElementById(
            "cuartoTiempo"
        ).innerHTML = ` + ${classificationArray[3].time}`;
    }

}

async function printTrackMainInfo(data) {
    let tracks = data.track;

    var i;
    for (i = 0; i < tracks.length; i++) {
        if (tracks[i].identifier == nameTrack) {
            break;
        }
    }

    maps(tracks, i);
    var idPilot = tracks[i].datos_extra.lapRecord.pilot;
    var pilot = getPilot(data, idPilot)
    var years = getYears(tracks[i]);

    let parentIcoFav = document.getElementById("col-ico-fav");
    let bt = document.createElement("button");

    let icon = document.createElement("i");
    icon.setAttribute("id", "ico-fav");
    let name = document.createElement("h10");
    name.setAttribute("id", "alterName-track");
    name.innerHTML = `${tracks[i].alternateName}`;

    var tracksFav = [];
    tracksFav = JSON.parse(localStorage.getItem("favs"));
    icon.setAttribute("class", "bi bi-star");
    if (tracksFav != null) {
        if (tracksFav.includes(nameTrack)) {
            icon.setAttribute("class", "bi bi-star-fill");
        }
    }

    icon.setAttribute("onclick", "trackfav()");

    bt.appendChild(icon);
    parentIcoFav.appendChild(bt);
    parentIcoFav.appendChild(name);

    document.getElementById('img-track').src = `assets/img/tracks/${tracks[i].image[0]}`;
    document.getElementById('img-track').alt = tracks[i].image[0];
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

    getClassification(data, i);
    videosTrack(tracks, i);
}

function createMenuCircuitsTrack(year) {
    let index = document.getElementById("years");
    indexYear = currentDate().getFullYear() - year;
    index.innerHTML = ``;
    for (let i = 0; i < year; i++) {
        let li = document.createElement("li");
        li.setAttribute("id", "years");
        li.setAttribute("title", indexYear + i);

        let button = document.createElement("button");
        button.addEventListener("click", () => sessionVarWhenClickNav(indexYear + i));

        let a = document.createElement("a");
        a.setAttribute("href", "#");
        a.innerHTML = indexYear + i;

        button.appendChild(a);
        li.appendChild(button);
        index.appendChild(li);
    }

    document.getElementById("bt-az").addEventListener("click", () => sessionVarWhenClickNav("name"));
    document.getElementById("bt-favs").addEventListener("click", () => sessionVarWhenClickNav("favs"));
}

window.addEventListener('load', initTrack)
async function initTrack() {
    let data = await fetchJSON();
    printTrackMainInfo(data);
    createMenuCircuitsTrack(3,data);
    playAudio();
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

function removeItemArray(array, item) {
    let pos;
    for (var i = 0; i < array.length; i++) {
        if (array[i] == item) {
            pos = i;
            break;
        }
    }
    array[pos] = array[array.length - 1];
    array.pop();
    return array;
}

function trackfav() {
    let tracksFav = [];
    tracksFav = JSON.parse(localStorage.getItem("favs"));
    let icon = document.getElementById("ico-fav");

    if (tracksFav != null) {
        if (tracksFav.includes(nameTrack)) {
            console.log("esta");
            tracksFav = removeItemArray(tracksFav, nameTrack);
            icon.className = "bi bi-star";

        } else {
            console.log("no esta");
            tracksFav.push(nameTrack);
            icon.className = "bi bi-star-fill";
        }
    } else {
        console.log("vacio");
        tracksFav = [nameTrack];
        icon.className = "bi bi-star-fill";
    }

    localStorage.setItem("favs", JSON.stringify(tracksFav));
    console.log(tracksFav)
}

function videosTrack(data, i) {

    if (data[i].video[1] == null) {
        document.getElementById('video-title').innerHTML = `Video
        <button style="visibility:hidden; onclick="document.getElementById('video-track').src = '${data[i].video[0]}'">TrackView</button>`;


    } else {
        console.log(data[i].video[1]);
        document.getElementById('video-title').innerHTML =
            `<button onclick="document.getElementById('video-track').src = '${data[i].video[0]}'">TrackView</button>
            <button onclick="document.getElementById('video-track').src = '${data[i].video[1]}'">Highlight</button>`;
    }
    document.getElementById('iframe-video').innerHTML =
        `<iframe id="video-track" src="${data[i].video[0]}" frameborder="0" allowfullscreen controls=2 ></iframe>`;

}

function tiempo() {
    fetch('https://api.openweathermap.org/data/2.5/forecast?lat=40.373073379592306&lon=49.85324597023271&units=metric&appid=bb95d1c6a9cadc0d98a84cf2a738c977&lang=es')
        .then(response => response.json())
        .then(data => console.log(data));
}

function processTiempo(data) {
    var dia = {
        date: null,
        temp: null,
        feels_like: null,
        temp_min: null,
        temp_max: null,
        humidity: null,
        main: null,
        wind: null,
        icon: null
    }
    for (var i = 0; i < data.lists.length; i++) {

    }

}
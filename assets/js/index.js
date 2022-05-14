//Funcion que se ejecuta al clicckar una imagen de un track
function getIdTrackClick(row) {
    
    let img= row.firstChild.nextElementSibling.firstChild.nextElementSibling;
    sessionStorage.setItem('idTrack', img.alt);
    /* sessionStorage.setItem('posTrack', img.getAttribute("data-track-pos")); */
    
    location.href = "track.html";
}

/* Funcion que crea e iyecta todos los tracks del JSON en el INDEX */
function createTracksIndex(data) {
    let tracks = data.track;
    //Para guardar los ya cursados en orden:
    let tracksAux = [];

    //Ordenamos los tracks por orden de fecha
    tracks = orderTracksBy(tracks, 'date');

    let trackList = document.getElementById('track-list');
    trackList.innerHTML = '';
    for (var i = 0; i < tracks.length; i++) {

        /* Si ya han pasado se printean al final */
        if ((new Date(tracks[i].date) - currentDate()) < 0) {
            /* Guardar */
            tracksAux.push(tracks[i]);
        } else {
            /* Print */
            printTrackAlternateName(tracks[i], trackList);
        }
    }

    //Si hay elementos:
    if (tracksAux.length > 0) {
        //Añadir boton al Hero
        let btnHero = document.getElementById('btn-hero');
        btnHero.innerHTML = `
            <a href="#col-track-list" class="btn-get-started scrollto">Próximo circuito</a>
            <a href="#title-old-tracks" class="btn-get-started scrollto">Circuitos anteriores</a>
        `;


        let content = document.getElementById('page-content');

        /* AÑADIMOS UNA NUEVA FILA */
        let title = document.createElement("div");
        title.setAttribute("class", "row");
        title.setAttribute("id", "row-old-tracks-list");
        title.innerHTML = `
            <div clas="col-md-3">
                <h1 class="tile" id="title-old-tracks"> Circuitos Anteriores
                </h1>
            </div>
        `;
        content.appendChild(title);

        /* AÑADIMOS EL ESQUELETO DE LOS TRACKS ANTERIORES*/
        let rowOldTracks = document.createElement("div");
        rowOldTracks.setAttribute("class", "row");
        rowOldTracks.setAttribute("id", "parent-track-list-old");
        rowOldTracks.innerHTML = `
            <div class="col-md-1">
            </div>
            <div class="col-md-7">
                <div class="track-list" id="track-list-old">
                    <!-- ITEMS -->
                </div>
            </div>
        `;
        content.appendChild(rowOldTracks);

        /* AÑADIMOS LOS TRACKS ANTERIORES */
        let trackListOld = document.getElementById('track-list-old');
        trackListOld.innerHTML = '';
        for (var i = 0; i < tracksAux.length; i++) {
            printTrackAlternateName(tracksAux[i], trackListOld);
        }
    }
}

function createMenuCircuitsIndex(year, data) {
    let index = document.getElementById("years");
    indexYear = currentDate().getFullYear() - year;
    index.innerHTML = ``;
    for (let i = 1; i < (year + 1); i++) {
        let li = document.createElement("li");
        li.setAttribute("id", "years");
        li.setAttribute("title", indexYear + i);

        let button = document.createElement("button");
        button.addEventListener("click", () => ordenarBy(indexYear + i, data));

        let a = document.createElement("a");
        a.setAttribute("href", "#");
        a.innerHTML = indexYear + i;

        button.appendChild(a);
        li.appendChild(button);
        index.appendChild(li);
    }

    document.getElementById("bt-az").addEventListener("click", () => ordenarBy("name", data));
    document.getElementById("bt-favs").addEventListener("click", () => ordenarBy("favs", data));
}

window.addEventListener('load', initIndex)
async function initIndex() {
    let navClicked = sessionStorage.getItem('navClicked');

    let data = await fetchJSON();
    if (navClicked != null) {
        sessionStorage.removeItem('navClicked');
        ordenarBy(navClicked, data);
    }else{
        createTracksIndex(data);
    }
    
    createMenuCircuitsIndex(4, data);
    mapsIndex(data);
    carrouselEscuderias(data);
    let noticias = await jsonnoticias();
    //let noticias = fetchJSONExterno('https://api.currentsapi.services/v1/search?' +
    //'keywords=F1&page_size=10&'+ 
    //'apiKey=N59WCalcBtNE7Nu2xDtbxkC_BaUtplDjUmTOz0bGWRBC9W9Y');
    carrouselNoticias(noticias);

}

/*API MAPS*/
function mapsIndex(data) {
    let listacircuitos = data.track;
    let tracks = listacircuitos;
    tracks = orderTracksBy(tracks, 'date');
    var map = L.map('map1').setView([29.422157492346255, -12.87843904797674], 1);
    /*const bounds = [
        [-122.66336, 37.492987], // Southwest coordinates
        [-122.250481, 37.871651] // Northeast coordinates
        ];
    map.setMaxBounds(bounds);*/ 
    L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
        attribution: "Global Map",
        maxZoom: 18,
        minZoom: 1,
        id: 'mapbox/satellite-v9',
        tileSize: 512,
        zoomOffset: -1,
        accessToken: 'pk.eyJ1IjoicGF1aW5kYW5pY29sYXUiLCJhIjoiY2wyazhmZm80MGF5cDNicGtlazdyN3kxbyJ9.zoF8CP2CPUgGrw0U8e2_cA'
    }).addTo(map);

    for (var i = 0; i < listacircuitos.length; i++) {
        let coordenadas = listacircuitos[i].GeoCoordinates;
        let longitud = coordenadas.longitude;
        let latitud = coordenadas.latitude;

        var marker = L.marker([latitud, longitud]).addTo(map);
        marker.bindPopup(`<b>${listacircuitos[i].name}</b><br>${listacircuitos[i].alternateName}`);
    }
}

/*Carrousel Escuderias*/
function carrouselEscuderias(data) {
    let esc = data.organitation;
    let escList = document.getElementById('carousel-inner');
    escList.innerHTML += ``;

    for (var i = 0; i < esc.length; i++) {
        if (i == 0) {
            escList.innerHTML += `
                <div class="carousel-item active" data-bs-interval="9000">
                <img src="assets/img/escurerias/${esc[i].logo}" class="d-block w-100" alt="${esc[i].logo}">
                </div>
            `;
        } else {
            escList.innerHTML += `
                <div class="carousel-item" data-bs-interval="5000">
                <img src="assets/img/escurerias/${esc[i].logo}" class="d-block w-100" alt="${esc[i].logo}">
                </div>
            `;
        }
    }
}

async function jsonnoticias(){
    /*const response = await fetch('https://api.currentsapi.services/v1/search?' +
    'keywords=Formula1&page_size=10&'+ 
    'apiKey=N59WCalcBtNE7Nu2xDtbxkC_BaUtplDjUmTOz0bGWRBC9W9Y');*/
    const response = await fetch('https://newsapi.org/v2/everything?q=Formula1&sortBy=popularity&apiKey=f7fac1e5d56f49f28405fba01dccf8cb');
    if (!response.ok) {
        const message = `An error has occured: ${response.status}`;
        throw new Error(message);
    }
    const data = await response.json();
    console.log(data);
    return data;  
}

/*Carrousel noticias*/
function carrouselNoticias(data) {
    let notList = document.getElementById('carousel');
    notList.innerHTML += ``;
    /*for (var i = 0; i < data.news.length; i++) {
        if (i == 0 && data.news[i].image != "None") {
            notList.innerHTML += `
                <div class="carousel-item active" data-bs-interval="9000">
                <img src="${data.news[i].image}" class="d-block w-100" alt="${data.news[i].image}">
                </div>
            `;
        } else if(data.news[i].image != "None"){
            notList.innerHTML += `
                <div class="carousel-item" data-bs-interval="5000">
                <img src="${data.news[i].image}" class="d-block w-100" alt="${data.news[i].image}">
                </div>
            `;
        }else{

        }
    }*/

    for (var i = 0; i < data.articles.length; i++) {
        if (i == 0) {
            notList.innerHTML += `
                <div class="carousel-item active" data-bs-interval="9000">
                <img src="${data.articles[i].urlToImage}" class="d-block w-100" alt="${data.articles[i].urlToImage}">
                </div>
            `;
        } else{
            notList.innerHTML += `
                <div class="carousel-item" data-bs-interval="5000">
                <img src="${data.articles[i].urlToImage}" class="d-block w-100" alt="${data.articles[i].urlToImage}">
                </div>
            `;
        }

        
    }
}

function stadisticsF1Drivers(data){
    console.log(data);
    var standing = data.MRData.StandingsTable.StandingsLists[0].DriverStandings;
    console.log(standing);
}

function stadisticsF1Constructor(data){
    console.log(data);
    var standing = data.MRData.StandingsTable.StandingsLists[0].ConstructorStandings;
    console.log(standing);
}

async function F1DriverStanding() {
    var requestOptions = {
        method: "GET",
        redirect: "follow",
    };

    await fetch("https://ergast.com/api/f1/2022/driverStandings.json", requestOptions)
        .then((response) => response.json())
        .then((result) => stadisticsF1Drivers(result))
        .catch((error) => console.log("error", error));
}

async function F1ConstructorStanding() {
    var requestOptions = {
        method: "GET",
        redirect: "follow",
    };

    await fetch("https://ergast.com/api/f1/2022/constructorStandings.json", requestOptions)
        .then((response) => response.json())
        .then((result) => stadisticsF1Constructor(result))
        .catch((error) => console.log("error", error));
}
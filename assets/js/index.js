//Funcion que se ejecuta al clicckar una imagen de un track
function getIdTrackClick(row) {
    let img = row.firstChild.nextElementSibling.firstChild.nextElementSibling;
    sessionStorage.setItem("idTrack", img.alt);
    location.href = "track.html";
}

/* Funcion que crea e iyecta todos los tracks del JSON en el INDEX */
function createTracksIndex(data) {
    let tracks = data.track;
    //Para guardar los ya cursados en orden:
    let tracksAux = [];

    //Ordenamos los tracks por orden de fecha
    tracks = orderTracksBy(tracks, "date");

    let trackList = document.getElementById("track-list");
    trackList.innerHTML = "";
    for (var i = 0; i < tracks.length; i++) {
        /* Si ya han pasado se printean al final */
        if (new Date(tracks[i].date) - currentDate() < 0) {
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
        let btnHero = document.getElementById("btn-hero");
        btnHero.innerHTML = `
            <a href="#col-track-list" class="btn-get-started scrollto">Próximo circuito</a>
            <a href="#title-old-tracks" class="btn-get-started scrollto">Circuitos anteriores</a>
        `;

        let content = document.getElementById("page-content");

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
        let trackListOld = document.getElementById("track-list-old");
        trackListOld.innerHTML = "";
        for (var i = 0; i < tracksAux.length; i++) {
            printTrackAlternateName(tracksAux[i], trackListOld);
        }
    }
}

function createMenuCircuitsIndex(year, data) {
    let index = document.getElementById("years");
    indexYear = currentDate().getFullYear() - year;
    index.innerHTML = ``;
    for (let i = 1; i < year + 1; i++) {
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

    document
        .getElementById("bt-az")
        .addEventListener("click", () => ordenarBy("name", data));
    document
        .getElementById("bt-favs")
        .addEventListener("click", () => ordenarBy("favs", data));
}

window.addEventListener("load", initIndex);
async function initIndex() {
    let navClicked = sessionStorage.getItem("navClicked");

    let data = await fetchJSON();
    if (navClicked != null) {
        sessionStorage.removeItem("navClicked");
        ordenarBy(navClicked, data);
    } else {
        createTracksIndex(data);
    }

    createMenuCircuitsIndex(4, data);
    let noticias = await jsonNoticias();
    carrouselNoticias(noticias);
    mapsIndex(data);
    carrouselEscuderias(data);
    F1DriverStanding();
    createSVG(stadisticsF1Drivers());

}

window.addEventListener("resize", stadisticsResize);
function stadisticsResize() {
    var driverStats = document.getElementById("DriverSVG");
    driverStats.parentNode.removeChild(driverStats);
    createSVG(stadisticsF1Drivers());
}

/*API MAPS*/
function mapsIndex(data) {
    let listacircuitos = data.track;
    let tracks = listacircuitos;
    tracks = orderTracksBy(tracks, "date");
    var map = L.map("map1").setView([29.422157492346255, -12.87843904797674], 1);
    const bounds = [
        [-74.72371974567177, -210], // [west, south]
        [82.25330477102183, 250], // [east, north]
    ];
    map.setMaxBounds(bounds);
    L.tileLayer(
        "https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}",
        {
            attribution: "Global Map",
            maxZoom: 18,
            minZoom: 1,
            id: "mapbox/satellite-v9",
            tileSize: 512,
            zoomOffset: -1,
            accessToken:
                "pk.eyJ1IjoicGF1aW5kYW5pY29sYXUiLCJhIjoiY2wyazhmZm80MGF5cDNicGtlazdyN3kxbyJ9.zoF8CP2CPUgGrw0U8e2_cA",
        }
    ).addTo(map);

    for (var i = 0; i < listacircuitos.length; i++) {
        let coordenadas = listacircuitos[i].GeoCoordinates;
        let longitud = coordenadas.longitude;
        let latitud = coordenadas.latitude;

        var marker = L.marker([latitud, longitud]).addTo(map);
        marker.bindPopup(
            `<b>${listacircuitos[i].name}</b><br>${listacircuitos[i].alternateName}<br><img loading="lazy" src="assets/img/flags/${listacircuitos[i].datos_extra.flag}" width="30px" hight="30px" style="border:1px solid black;">`
        );
    }
}

/*Carrousel Escuderias*/
function carrouselEscuderias(data) {
    let esc = data.organitation;
    let escList = document.getElementById("carousel-inner");
    escList.innerHTML += ``;

    for (var i = 0; i < esc.length; i++) {
        if (i == 0) {
            escList.innerHTML += `
                <div class="carousel-item active" data-bs-interval="9000">
                <img src="assets/img/escurerias/${esc[i].logo}" loading="lazy" class="d-block w-100" alt="${esc[i].logo}">
                </div>
            `;
        } else {
            escList.innerHTML += `
                <div class="carousel-item" data-bs-interval="5000">
                <img src="assets/img/escurerias/${esc[i].logo}" loading="lazy" class="d-block w-100" alt="${esc[i].logo}">
                </div>
            `;
        }
    }
}

async function jsonNoticias() {
    const response = await fetch(
        "https://api.currentsapi.services/v1/search?" +
        "keywords=Formula One&page_size=10&" +
        "apiKey=N59WCalcBtNE7Nu2xDtbxkC_BaUtplDjUmTOz0bGWRBC9W9Y"
    );
    if (!response.ok) {
        const message = `An error has occured: ${response.status}`;
        throw new Error(message);
    }
    const data = await response.json();
    return data;
}

/*Carrousel noticias*/
function carrouselNoticias(data) {
    let notList = document.getElementById("carousel-noticias-content");
    notList.innerHTML += ``;
    for (var i = 0; i < data.news.length; i++) {
        let date = new Date(data.news[i].published);
        if (i == 0 && data.news[i].image != "None") {
            notList.innerHTML += `
                <div class="carousel-item active" data-bs-interval="9000">
                <img src="${data.news[i].image}" loading="lazy" class="d-block w-100" alt="${data.news[i].title
                }">
                <div class="overlay">                        
                        <div class="text">
                            <a href="${data.news[i].url}" target="_blank">${data.news[i].title
                }</a>
                            
                            <div>${date.getFullYear()}-${date.getMonth()}-${date.getDate()}</div>
                        </div>
                    </div>
                </div>
            `;
        } else if (data.news[i].image != "None") {
            notList.innerHTML += `
                <div class="carousel-item" data-bs-interval="5000">
                <img src="${data.news[i].image}" loading="lazy" class="d-block w-100" alt="${data.news[i].title
                }">
                <div class="overlay">                        
                        <div class="text">
                            <a href="${data.news[i].url}" target="_blank">${data.news[i].title
                }</a>
                            
                            <div>${date.getFullYear()}-${date.getMonth()}-${date.getDate()}</div>
                        </div>
                    </div>
                </div>
            `;
        }
    }
}

function stadisticsF1Drivers() {
    driverStands = JSON.parse(sessionStorage.getItem("driverStanding"));
    var standing =
        driverStands.MRData.StandingsTable.StandingsLists[0].DriverStandings;
    let standingsInfo = [];

    for (var i = 0; i < standing.length; i++) {
        var DriverStats = {
            driver: standing[i].Driver,
            points: standing[i].points,
        };
        standingsInfo.push(DriverStats);
    }
    return standingsInfo;
}

function createSVG(data) {
    var xmlns = "http://www.w3.org/2000/svg";

    var win = window,
        doc = document,
        docElem = doc.documentElement,
        body = doc.getElementsByTagName("body")[0],
        x = win.innerWidth || docElem.clientWidth || body.clientWidth,
        y = win.innerHeight || docElem.clientHeight || body.clientHeight;

    var w;
    if (x <= 750) {
        w = parseInt(x * 0.9);
    } else {
        w = parseInt(x * (1 / 2));
    }
    var h = 1000;
    var maxPoints = (w / data[0].points) * 0.7;

    let driverStats = document.getElementById("estadisticas");
    var svgElem = document.createElementNS(xmlns, "svg");
    svgElem.setAttributeNS(null, "id", "DriverSVG");
    svgElem.setAttributeNS(null, "viewBox", "0 0 " + w + " " + h);
    svgElem.setAttributeNS(null, "width", w);
    svgElem.setAttributeNS(null, "height", h);
    svgElem.style.display = "block";

    for (var i = 0; i < data.length; i++) {
        var bar = document.createElementNS(xmlns, "g");
        svgElem.appendChild(bar);
        bar.setAttributeNS(null, "transform", "translate(160,20)");

        var recta = document.createElementNS(xmlns, "rect");
        recta.setAttribute("class", "bar");
        recta.setAttribute("x", "10");
        recta.setAttribute("width", data[i].points * maxPoints);
        recta.setAttribute("y", 5 + i * 40);
        recta.setAttribute("height", "30");
        bar.appendChild(recta);

        var text = document.createElementNS(xmlns, "text");
        text.setAttributeNS(null, "transform", "translate(5,40)");
        text.setAttributeNS(null, "style", "fill: #ffffff;")
        svgElem.appendChild(text);
        text.setAttributeNS(null, "y", 5 + i * 40);
        text.setAttributeNS(null, "x", "1");
        text.innerHTML = `${i + 1} ${data[i].driver.givenName} ${data[i].driver.familyName}`;

        driverStats.appendChild(svgElem);
    }
}


function stadisticsF1Constructor(data) {
    console.log(data);
    var standing =
        data.MRData.StandingsTable.StandingsLists[0].ConstructorStandings;
    console.log(standing);
}

async function F1DriverStanding() {
    var requestOptions = {
        method: "GET",
        redirect: "follow",
    };

    await fetch(
        "https://ergast.com/api/f1/2022/driverStandings.json",
        requestOptions
    )
        .then((response) => response.json())
        .then((result) => {
            sessionStorage.setItem("driverStanding", JSON.stringify(result));
        })
        .catch((error) => console.log("error", error));
}

async function F1ConstructorStanding() {
    var requestOptions = {
        method: "GET",
        redirect: "follow",
    };

    await fetch("https://ergast.com/api/f1/2022/constructorStandings.json",requestOptions)
        .then((response) => response.json())
        .then((result) => stadisticsF1Constructor(result))
        .catch((error) => console.log("error", error));
}
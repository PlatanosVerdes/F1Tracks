//Funcion que se ejecuta al clicckar una imagen de un track
function getIdTrackClick(img) {
    sessionStorage.setItem('idTrack', img.alt);
    sessionStorage.setItem('posTrack', img.getAttribute("data-track-pos"));
    
    location.href = "track.html";
}

/* Inyectar en el html los tracks con el titulo que
tienen en el campeonato (AlternateName)
@track: el track del JSON
@trackPos: la posicion del Array del JSON
@whereId: El ID de la etiqueta del HTML donde se quiere inyectar
*/
function printTrackAlternateName(track, trackpos, whereId) {
    let trackItem = document.createElement("div");
    trackItem.setAttribute("class", "track-item");
    trackItem.setAttribute("id", "track-item");

    trackItem.innerHTML = `
        <div class="row">
            <div class="col-sm-12 col-md-6">
                <img class="img-fluid rounded mb-3 mb-md-0" src="assets/img/tracks/${track.identifier}.png" alt="${track.identifier}" data-track-pos="${trackpos}" onclick="getIdTrackClick(this)" id="imagencircuito">
                <div class="text">${track.date}</div>
                <div class="text">${track.GeoCoordinates.addressCountry}</div>
            </div>
            <div class="col-sm-12 col-md-6">
                <h3>${track.alternateName}</h3>
                <p>${track.description}</p>
            </div>
        </div>
    `;

    whereId.appendChild(trackItem);
}

/* Funcion que crea e iyecta todos los tracks del JSON en el INDEX */
function createTracksIndex(data) {
    let tracks = data.track;
    let tracksAux = [];
    let posTracksAux = [];

    //Ordenamos los tracks por orden de fecha
    tracks = orderTracksBy(tracks, 'date');

    let trackList = document.getElementById('track-list');
    trackList.innerHTML = '';
    for (var i = 0; i < tracks.length; i++) {

        /* Si ya han pasado se printean al final */
        if ((new Date(tracks[i].date) - currentDate()) < 0) {
            /* Guardar */
            tracksAux.push(tracks[i]);
            posTracksAux.push(i);
        } else {
            /* Print */
            printTrackAlternateName(tracks[i], i, trackList);
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
            printTrackAlternateName(tracksAux[i], posTracksAux[i], trackListOld);
        }
    }
}

/* Metodo que cambia los tracks en el indice y los muestra ordenados */
/* PENDIENTE ORDENAR POR AÑOS */
async function ordenar(order) {
    orderBy = order.currentTarget.myParam;

    //Borrar el titulo
    document.getElementById('presentation').remove();

    var hero = document.getElementById('hero');

    let newTitle = document.createElement("div");
    newTitle.setAttribute("class", "container-fluid");
    newTitle.setAttribute("id", "presentation");


    //Penemos nuevo titulo
    hero.appendChild(newTitle);

    //Eliminar titulo de la lista
    var titleTracksList = document.getElementById('title-trackslist');
    titleTracksList.innerHTML = "";

    //Borrar los tracks
    //Si hay circuitos ya hechos:
    let oldTracks = document.getElementById('parent-track-list-old');
    if (oldTracks) {
        oldTracks.remove();
        document.getElementById('row-old-tracks-list').remove();
    }

    var trackList = document.getElementById('track-list');
    trackList.initIndex = "";
    if (document.getElementById('row-old-tracks-list') != null) {
        document.getElementById('row-old-tracks-list').remove();
    }

    let data = await fetchJSON();

    //Cargar los tracks
    let tracks = data.track;

    if (orderBy == 'name') {
        newTitle.innerHTML = `  
            <h4>CIRCUITOS</h4>
                <br>
            <h3>TEMPORADA ${currentDate().getFullYear()}</h3>
        `;
        //Ordenamos los tracks por nombre
        tracks = orderTracksBy(tracks, orderBy);
    } else {
        //FAVS: PENDIENTE DE CAMBIAR ESTE ELSE
        newTitle.innerHTML = `  
            <h4>CIRCUITOS</h4>
                <br>
            <h3>TUS CIRCUITOS FAVORITOS</h3>
        `;
        let auxTracks = [];
        let tracksFav = JSON.parse(localStorage.getItem("favs"));

        if (tracksFav.length > 0) {
            for (let i = 0; i < tracks.length; i++) {
                if (tracksFav.includes(tracks[i].identifier)) {
                    auxTracks.push(tracks[i]);
                }
            }
            tracks = auxTracks;
        } else {
            alert("No tienes circutos favoritos");
            location.href = "index.html";
        }

    }

    let newTrackList = document.getElementById('track-list');
    newTrackList.innerHTML = '';

    for (let i = 0; i < tracks.length; i++) {
        let trackItem = document.createElement("div");
        trackItem.setAttribute("class", "track-item");
        trackItem.setAttribute("id", "track-item");

        trackItem.innerHTML = `
                    <div class="row">
                        <div class="col-sm-12 col-md-6">
                        <img class="img-fluid rounded mb-3 mb-md-0" src="assets/img/tracks/${tracks[i].identifier}.png" alt="${tracks[i].identifier}" onclick="getIdTrackClick(this)">
                        </div>
                        <div class="col-sm-12 col-md-6" id="idTrack">
                            <h3>${tracks[i].name}</h3>
                            <p>${tracks[i].description}</p>
                        </div>
                    </div>
                `;

        newTrackList.appendChild(trackItem);
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

/* //Funcion que le el JSON de nuestros datos
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
}); */

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
    
    createMenuCircuitsIndex(3, data);
    playAudio();
    mapsIndex(data);
    carrouselEscuderias(data);
    twitter();
}



window.addEventListener('storage', function (e) {
    console.log(e.key);
    console.log(e.oldValue);
    console.log(e.newValue);
    console.log(e.url);
    console.log(JSON.stringify(e.storageArea));
}, false);

/*API MAPS*/
function mapsIndex(data) {
    let listacircuitos = data.track;
    let tracks = listacircuitos;
    tracks = orderTracksBy(tracks, 'date');
    let c = tracks[0].GeoCoordinates;
    let lo = c.longitude;
    let la = c.latitude;
    const bounds = [
        [-74.72371974567177, -159.6901903462776], // [west, south]
        [82.25330477102183, 176.85430047701885]  // [east, north]
    ];
    var map = L.map('map1').setView([la, lo], 1);
    map.setMaxBounds(bounds);
    //map.setZoom(0);
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

        var marker = L.marker([latitud, longitud], {
            color: 'red'
        }).addTo(map);
        marker.bindPopup(`<b>${listacircuitos[i].name}</b><br>${listacircuitos[i].alternateName}`);
    }
}

/*Carrousel*/
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

/* API TWITTER ENSEÑAR 10 TWITTS MÁS RECIENTES */
function twitter() {
    /*CUARTA FORMA*/
    var url = "https://api.twitter.com/2/tweets/search/recent?tweet.fields=created_at&expansions=author_id&user.fields=profile_image_url,username&query=%23f1";

    var xhr = new XMLHttpRequest();
    xhr.open("GET", url);

    xhr.setRequestHeader("Accept", "application/json");
    xhr.setRequestHeader("Authorization", "Bearer {AAAAAAAAAAAAAAAAAAAAAFqsbwEAAAAALZT6ZmPRdRMBdVCuRY0im%2BEVF9Q%3Dri9P3NrF49frbmJzVQgV38gpfkoAwGmsoy6DKbi55pBw26Uj3B}");

    xhr.onreadystatechange = function () {
   if (xhr.readyState === 4) {
      console.log(xhr.status);
      console.log(xhr.responseText);
   }};

    xhr.send();


    /*TERCERA FORMA*/
    /*const response = await fetch('https://api.twitter.com/2/tweets/search/recent?tweet.fields=created_at&expansions=author_id&user.fields=profile_image_url,username&query=%23f1');
    if (!response.ok) {
        const message = `An error has occured: ${response.status}`;
        throw new Error(message);
    }
    const data = await response.json();
    console.log(data);*/

    /*SEGUNDA FORMA*/
    /*var tweets;
    const req = "https://api.twitter.com/2/tweets/search/recent?tweet.fields=created_at&expansions=author_id&user.fields=profile_image_url,username&query=%23f1";
    const request = new XMLHttpRequest();
    request.onreadystatechange = function(){
        if(request.readyState == 4 && request.status == 200){
            tweets = JSON.parse(request.responseText);
            console.log(tweets);
        }
    }
    request.open("GET",req);
    request.responseType = 'text';
    request.setRequestHeader("Authorization", "Bearer Token AAAAAAAAAAAAAAAAAAAAAFqsbwEAAAAALZT6ZmPRdRMBdVCuRY0im%2BEVF9Q%3Dri9P3NrF49frbmJzVQgV38gpfkoAwGmsoy6DKbi55pBw26Uj3B");
    request.send();*/


    /*PRIMERA FORMA NO FUNCIONA*/
    //var xhr = new XMLHttpRequest();
    //var Twit = fetch('twit');

    /*xhr.setRequestHeader({
        consumer_key: 'hYki2ZOYFDo7lCcWYFxY3GHiD',
        consumer_secret: 'Nq50V1zVI3ka6SdmotuSvIX5kGznLZWPeu2fOjcXjZViQYaJzH',
        access_token: '1376221813-xC5cTmFDFphzghw6NLvhneuefYpPA8OwTyRqLsx',
        access_token_secret: 'oBQVsioE5djzQOmuZO7z9iqnno5PnRRmn5OMEu294opzo'
    });*/

    //xhr.open("GET", "https://api.twitter.com/2/tweets/search/recent?tweet.fields=created_at&expansions=author_id&user.fields=profile_image_url,username&query=%23f1");
    

    //xhr.send();

    /*T.get('search/tweets', { q: '#F1 since:2020-07-11', count: 10 }, function (err, data, response) {
        console.log(data)
    });*/
    //created_at, text, user.screen_name, location, profile_image_url_https
    //user:profile_image_url,username
    //tweet:text,created_at
}
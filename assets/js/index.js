//Funcion para remover un elemento
function remove(item) {
    var elem = document.querySelectorAll(item);
    for (var i = 0; i < elem.length; i++) {
        var del = elem[i]; del.parentNode.removeChild(del);
    }
}

function currentDate() {
    let currentDate = new Date();
    let cDay = currentDate.getDate();
    let cMonth = currentDate.getMonth();
    let cYear = currentDate.getFullYear();

    return new Date(cYear, cMonth, cDay);
}


function printTrackSimply(track, whereId) {
    let trackItem = document.createElement("div");
    trackItem.setAttribute("class", "track-item");
    trackItem.setAttribute("id", "track-item");

    trackItem.innerHTML = `
        <div class="row">
            <div class="col-sm-12 col-md-6">
            <a href="track.html">
                <img class="img-fluid rounded mb-3 mb-md-0" src="assets/img/tracks/${track.identifier}.png" alt="Track">
            </a>
            </div>
            <div class="col-sm-12 col-md-6">
                <h3>${track.alternateName}</h3>
                <p>${track.description}</p>
            </div>
        </div>
    `;

    whereId.appendChild(trackItem);
}

function createTracksIndex(data) {

    let tracks = data.track;
    let tracksAux = [];

    //Ordenamos los tracks por orden de fecha
    tracks.sort((a, b) => new Date(a.date) - new Date(b.date));

    let trackList = document.getElementById('track-list');
    trackList.innerHTML = '';
    for (var i = 0; i < tracks.length; i++) {

        /* Si ya han pasado se printean al final */
        if ((new Date(tracks[i].date) - currentDate()) < 0) {
            /* Guardar */
            tracksAux.push(tracks[i]);
        } else {
            /* Print */
            printTrackSimply(tracks[i], trackList);
        }
    }

    //Si hay elementos:
    if (tracksAux.length > 0) {
        let content = document.getElementById('page-content');

        /* AÑADIMOS UNA NUEVA FILA */
        let title = document.createElement("div");
        title.setAttribute("class", "row");
        title.setAttribute("id", "row-old-tracks-list");
        title.innerHTML = `
            <div clas="col-md-3">
                <h1 class="tile"> Circuitos Anteriores
                </h1>
            </div>
        `;
        content.appendChild(title);

        /* AÑADIMOS EL ESQUELETO DE LOS TRACKS ANTERIORES*/
        let rowOldTracks = document.createElement("div");
        rowOldTracks.setAttribute("class", "row");
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
            printTrackSimply(tracksAux[i], trackListOld);
        }
    }
}


function leerJSON() {
    const xhttp = new XMLHttpRequest();
    xhttp.open('GET', 'f1tracks.json', true);
    xhttp.send(null);
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            /* console.log(this.responseText); */

            data = JSON.parse(this.responseText);

            //Cargar los tracks en el indice
            createTracksIndex(data);

            /* console.log(data); */
        }
    }
}



//PENDIENTE DE HACER
function ordenar(){
    let tracks = data.track;
    let tracksAux = [];

    //Ordenamos los tracks por orden de fecha
    tracks.sort();
    console.log(tracks);

    let trackList = document.getElementById('track-list');
    trackList.innerHTML = '';
    for (var i = 0; i < tracks.length; i++) {

        /* Si ya han pasado se printean al final */
        if ((new Date(tracks[i].date) - currentDate()) < 0) {
            /* Guardar */
            tracksAux.push(tracks[i]);
        } else {
            /* Print */
            printTrackSimply(tracks[i], trackList);
        }
    }
}

ordens = document.getElementById("az");
ordens.addEventListener('click', ordenar);


/* document.querySelectorAll(".track-item").forEach(el => {
    el.addEventListener("track-item", e => {
        const id = e.target.getAttribute("id");
        console.log("cliked")
        console.log("Se ha clickeado el id " + id);
    });
}); */

/* var trackItem = document.getElementById("track-item");
trackItem.addEventListener("click",)
function saveTrack() {
    var temp =
    
} */
/* sessionStorage.setItem('track', ''); */

//Funcion que reproduce el audio al entrar en la página
/* var body =document.getElementById("body"); */
window.addEventListener('load', initIndex)
function initIndex() {
    /* let path = window.location.href
    console.log(path) */

    playAudio();

    /* SI ESTAMOS EN EL index.html */
    //if (window.location.href.includes('index.html')) {
        leerJSON();
    //}

}

function playAudio() {
    audio = document.getElementById("index-audio");
    audio.muted = false;
    audio.play();
    audio.volume = 0.35;
}

window.addEventListener('storage', function (e) {
    console.log(e.key);
    console.log(e.oldValue);
    console.log(e.newValue);
    console.log(e.url);
    console.log(JSON.stringify(e.storageArea));
}, false);

/* API TWITTER ENSEÑAR 10 TWITTS MÁS RECIENTES */
/* 
const Twit = require('twit')

const T = new Twit({
    apiKey: '',
    apiSecret: '',
    accessToken: '',
    accessTokenSecret: '',
    timeout_ms: 60 * 1000,
    strictSSL: true,
});

(async () => {
    T.get('search/tweets', { q: '#F1 since:2020-07-11', count: 10 }, function (err, data, response) {
        const tweets = data.statuses
        console.log(data)
    })
}); 
*/
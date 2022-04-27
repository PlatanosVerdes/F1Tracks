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


//Funcion que se ejecuta al clicckar una imagen de un track
function getIdTrackClick(img) {
    var id = img.alt;

    sessionStorage.setItem('idTrack', id);
    location.href = "track.html";
}


//Funcion que ordena los tracks por az o por date (fecha)
function orderTracksBy(tracks, order) {
    if (order == 'name') {
        tracks.sort(function (a, b) {
            if (a.name < b.name) return -1;
            if (a.name > b.name) return 1;
            return 0;
        })
    } else if (order == 'date') {
        tracks.sort((a, b) => new Date(a.date) - new Date(b.date));
    }
    return tracks;
}

/* Inyectar en el html los tracks con el titulo que
tienen en el campeonato (AlternateName)
@track: el track del JSON
@whereId: El ID de la etiqueta del HTML donde se quiere inyectar
*/
function printTrackAlternateName(track, whereId) {
    let trackItem = document.createElement("div");
    trackItem.setAttribute("class", "track-item");
    trackItem.setAttribute("id", "track-item");

    trackItem.innerHTML = `
        <div class="row">
            <div class="col-sm-12 col-md-6">
                <img class="img-fluid rounded mb-3 mb-md-0" src="assets/img/tracks/${track.identifier}.png" alt="${track.identifier}" onclick="getIdTrackClick(this)">            
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

    //Ordenamos los tracks por orden de fecha
    //tracks.sort((a, b) => new Date(a.date) - new Date(b.date));
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
            <a href="#row-old-tracks-list" class="btn-get-started scrollto">Circuitos anteriores</a>
        `;


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
            printTrackAlternateName(tracksAux[i], trackListOld);
        }
    }
}

/* Metodo que cambia los tracks en el indice y los muestra ordenados */
/* PENDIENTE ORDENAR POR AÑOS */
function ordenar() {
    //Borrar el titulo
    document.getElementById('presentation').remove();
    var hero = document.getElementById('hero');

    let newTitle = document.createElement("div");
    newTitle.setAttribute("class", "container-fluid");
    newTitle.innerHTML = `  
        <h4>CIRCUITOS</h4>
            <br>
        <h3>TEMPORADA ${currentDate().getFullYear()}</h3>
    `;

    //Penemos nuevo titulo
    hero.appendChild(newTitle);

    //Eliminar titulo de la lista
    var titleTracksList = document.getElementById('title-trackslist');
    titleTracksList.innerHTML = "";

    //Borrar los tracks
    var trackList = document.getElementById('track-list');
    trackList.initIndex = "";
    if (document.getElementById('row-old-tracks-list') != null) {
        document.getElementById('row-old-tracks-list').remove();
    }

    //Leer JSON
    const xhttp = new XMLHttpRequest();
    xhttp.open('GET', 'f1tracks.json', true);
    xhttp.send(null);
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {

            data = JSON.parse(this.responseText);

            //Cargar los tracks
            let tracks = data.track;

            //Ordenamos los tracks por nombre
            tracks = orderTracksBy(tracks, 'name');
            console.log(tracks);

            let trackList = document.getElementById('track-list');
            trackList.innerHTML = '';

            for (var i = 0; i < tracks.length; i++) {
                let trackItem = document.createElement("div");
                trackItem.setAttribute("class", "track-item");
                trackItem.setAttribute("id", "track-item");

                trackItem.innerHTML = `
                    <div class="row">
                        <div class="col-sm-12 col-md-6">
                            <img class="img-fluid rounded mb-3 mb-md-0" src="assets/img/tracks/${tracks[i].identifier}.png" alt="Track" onclick="image(this)">
                        </div>
                        <div class="col-sm-12 col-md-6" id="idTrack">
                            <h3>${tracks[i].name}</h3>
                            <p>${tracks[i].description}</p>
                        </div>
                    </div>
                `;

                trackList.appendChild(trackItem);
            }

        }
    }
}
ordens = document.getElementById("az");
ordens.addEventListener('click', ordenar);

//ESTA FUNCION ESTA MAL: PENDIENTE DE SOLO USAR ESTE FUNCION PARA LEER JSON
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

/* Funcion que reproduce un audio al cargar la pagina */
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

/*Carrousel*/
window.onload = function (data) {
    let esc = data.organitation;
    var imgArray = new Array(esc.length);
    
        
        for(var i = 0; i < esc.length;i++){
            imgArray[i] = `assets/img/escurerias/${esc[i].logo})`;
            
        }
    
    const TIEMPO_INTERVALO_MILESIMAS_SEG = 5000;
    let posicionActual = 0;
    let $botonRetroceder = document.querySelector('.atras');
    let $botonAvanzar = document.querySelector('.adelante');
    let $imagen = document.querySelector('#imagen');
    let intervalo;

    // Funciones

    /**
     * Funcion que cambia la foto en la siguiente posicion
     */
    function pasarFoto() {
        if(posicionActual >= esc.length - 1) {
            posicionActual = 0;
        } else {
            posicionActual++;
        }
        renderizarImagen();
    }

    /**
     * Funcion que cambia la foto en la anterior posicion
     */
    function retrocederFoto() {
        if(posicionActual <= 0) {
            posicionActual = esc.length - 1;
        } else {
            posicionActual--;
        }
        renderizarImagen();
    }

    /**
     * Funcion que actualiza la imagen de imagen dependiendo de posicionActual
     */
    function renderizarImagen () {
        $imagen.style.backgroundImage = `url(${imgArray[posicionActual]})`;
        //$imagen.style.backgroundImage = `assets/img/escurerias/${esc[posicionActual].logo})`;
    }

    /**
     * Activa el autoplay de la imagen
     */
    intervalo = setInterval(pasarFoto, TIEMPO_INTERVALO_MILESIMAS_SEG);
        
    // Eventos
    $botonAvanzar.addEventListener('click', pasarFoto);
    $botonRetroceder.addEventListener('click', retrocederFoto);
    
    // Iniciar
    renderizarImagen();
} 

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
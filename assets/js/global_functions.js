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

// Retorna un número aleatorio entre min (incluido) y max (excluido)
function getRandomArbitrary(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

/* Funcion que reproduce un audio al cargar la pagina */
function playAudio() {
    audio = document.getElementById("index-audio");
    audio.muted = false;
    audio.play();
    audio.volume = 0.35;
}

//Funcion que le el JSON de nuestros datos
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

/*async function fetchJSONExterno(jsonext) {
    const response = await fetch(jsonext);
    if (!response.ok) {
        const message = `An error has occured: ${response.status}`;
        throw new Error(message);
    }
    const data = await response.json();
    return data;
}
fetchJSONExterno().catch(error => {
    error.message; // 'An error has occurred: 404'
});*/

//Funcion que ordena los tracks por az o por date (fecha)
function orderTracksBy(tracks, order) {
    if (order === 'name') {
        tracks.sort(function (a, b) {
            if (a.name < b.name) return -1;
            if (a.name > b.name) return 1;
            return 0;
        })
    } else if (order === 'date') {
        tracks.sort((a, b) => new Date(a.date) - new Date(b.date));
    }
    return tracks;
}

function getAllYears(track) {
    let years = track.datos_extra.years;
    let allYears = [];
    for (var i = 0; i < years.length; i++) {
        let auxYears = years[i].split("-");
        if (auxYears.length > 1) {
            for (let j = auxYears[0]; j <= auxYears[1]; j++) {
                allYears.push(parseInt(j));
            }
        } else {
            allYears.push(parseInt(years[i]));
        }
    }
    return allYears;
}

async function posTrackInJSON(track) {
    let data = await fetchJSON();
    for (var i = 0; i < data.track.length; i++) {
        if (track.identifier === data.track[i].identifier) {
            return i;
        }
    }
}

/* Metodo que cambia los tracks en el indice y los muestra ordenados */
/* PENDIENTE ORDENAR POR AÑOS */
async function ordenarBy(order, data) {

    //Borrar el titulo
    document.getElementById('presentation').remove();
    //New Hero
    var hero = document.getElementById('hero');
    //New Title
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

    //Cargar los tracks
    let tracks = data.track;

    //Ordenar
    if (order === "name") {
        newTitle.innerHTML = `  
            <h4>CIRCUITOS</h4>
                <br>
            <h3>TEMPORADA ${currentDate().getFullYear()}</h3>
        `;

        //Ordenamos los tracks por nombre
        tracks = orderTracksBy(tracks, order);
        printTracksOrderBy(tracks);

    } else if (order === "favs") {
        newTitle.innerHTML = `  
            <h4>CIRCUITOS</h4>
                <br>
            <h3>TUS CIRCUITOS FAVORITOS</h3>
        `;
        let idTracksFav = JSON.parse(localStorage.getItem("favs"));

        if (idTracksFav.length > 0) {
            let auxTracks = [];
            for (let i = 0; i < tracks.length; i++) {
                if (idTracksFav.includes(tracks[i].identifier)) {
                    auxTracks.push(tracks[i]);
                }
            }
            printTracksOrderBy(auxTracks);
        } else {
            //Ponemos los Tracks
            let newTrackList = document.getElementById('track-list');
            newTrackList.innerHTML = '';

            let div = document.createElement('div');
            div.setAttribute("class", "notfav");

            let title = document.createElement('h1');
            title.setAttribute("class", "text-center");
            title.innerHTML = 'NO TIENES CIRCUITOS FAVORITOS';
            div.appendChild(title);

            let gif = document.createElement("img");
            gif.setAttribute("class", "img-fluid animated");
            gif.setAttribute("id", "gif-empty");
            let id = getRandomArbitrary(0, 5);

            gif.src = `assets/img/gifs/gif${id}.gif`;
            div.appendChild(gif);

            newTrackList.appendChild(div);
        }

    } else {
        //Años
        newTitle.innerHTML = `  
            <h4>CIRCUITOS</h4>
                <br>
            <h3>TEMPORADA ${order}</h3>
        `;

        let tracks = [];
        for (let i = 0; i < data.track.length; i++) {
            let allYears = getAllYears(data.track[i]);
            if (allYears.includes(parseInt(order))) {
                tracks.push(data.track[i]);
            }
        }
        printTracksOrderBy(tracks);
    }
}

async function printTracksOrderBy(tracks) {
    let newTrackList = document.getElementById('track-list');
    newTrackList.innerHTML = '';

    for (let i = 0; i < tracks.length; i++) {

        let trackpos = await posTrackInJSON(tracks[i]);
        let trackItem = document.createElement("div");
        trackItem.setAttribute("class", "track-item");
        trackItem.setAttribute("id", "track-item");

        trackItem.innerHTML = `
                <div class="row">
                    <div class="col-sm-12 col-md-6" id="img">
                        <img class="img-fluid rounded mb-3 mb-md-0" src="assets/img/tracks/${tracks[i].identifier}.png" alt="${tracks[i].identifier}"  data-track-pos="${trackpos}" onclick="getIdTrackClick(this)"  id="imagencircuito">

                        <div class="text text-center" id="name">${tracks[i].name}</div>
                        <div class="text text-center" id="location">${tracks[i].GeoCoordinates.addressCountry}</div>
                        <div class="text text-center" id="date">${tracks[i].date}</div>
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

async function addEventOnChange() {
    let data = await fetchJSON();
    document.getElementById('plh-search').addEventListener('change', () => buscarContenido(data));
}
addEventOnChange();

function buscarContenido(data) {
    tracks = data.track;
    let text = document.getElementById('plh-search').value.toLowerCase();
    if (text.length >= 2) {
        let search = data.track.filter(track => track.name.toLowerCase().includes(text) || track.alternateName.toLowerCase().includes(text));
        if (search.length > 0) {
            document.getElementById('title-trackslist').innerText = `Resultado de la búsqueda`;

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
            printTracksOrderBy(search);
        } else {
            window.confirm("No se han encontrado coincidencias");
        }
    }
}
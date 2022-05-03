//Funcion para leer el un JSON
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

/* Funcion que reproduce un audio al cargar la pagina */
function playAudio() {
    audio = document.getElementById("index-audio");
    audio.muted = false;
    audio.play();
    audio.volume = 0.2;
}

/* Metodo que cambia los tracks en el indice y los muestra ordenados */
/* PENDIENTE ORDENAR POR AÑOS */
async function ordenarIndexBy(order) {
    console.log("HOLA");
    //Borrar el titulo
    document.getElementById('presentation').remove();

    var hero = document.getElementById('hero');

    let newTitle = document.createElement("div");
    newTitle.setAttribute("class", "container-fluid");
    newTitle.setAttribute("id", "presentation");
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

    if (order == 'name') {
        //Ordenamos los tracks por nombre
        tracks = orderTracksBy(tracks, order);
    } else {
        let auxTracks = [];
        let tracksFav = JSON.parse(localStorage.getItem("favs"));

        if (tracksFav.length > 0) {
            for (let i = 0; i < tracks.length; i++) {
                if (tracksFav.includes(tracks[i].identifier)) {
                    auxTracks.push(tracks[i]);
                }
            }
        } else {
            /* CAMBIAR CAMBIAR CAMBIAR CAMBIAR CAMBIAR CAMBIAR CAMBIAR CAMBIAR CAMBIAR CAMBIAR CAMBIAR CAMBIAR CAMBIAR CAMBIAR*/
            alert("No tienes circutos favoritos")
        }
        tracks = auxTracks;
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
                        <img class="img-fluid rounded mb-3 mb-md-0" src="assets/img/tracks/${tracks[i].identifier}.webp" alt="${tracks[i].identifier}" onclick="getIdTrackClick(this)">
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


//Funcion para remover un elemento
function remove(item) {
    var elem = document.querySelectorAll(item);
    for (var i = 0; i < elem.length; i++) {
        var del = elem[i]; del.parentNode.removeChild(del);
    }
}
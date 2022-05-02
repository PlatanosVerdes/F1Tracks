window.addEventListener('load', initTrack)
async function initTrack() {
    playAudio();
}

/* Funcion que reproduce un audio al cargar la pagina */
function playAudio() {
    audio = document.getElementById("index-audio");
    audio.muted = false;
    audio.play();
    audio.volume = 0.35;
}

/* Metodo que cambia los tracks en el indice y los muestra ordenados */
/* PENDIENTE ORDENAR POR AÑOS */
async function ordenar(order) {
    orderBy= order.currentTarget.myParam;

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
    if(oldTracks){
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
        //Ordenamos los tracks por nombre
        tracks = orderTracksBy(tracks, orderBy);
    } else {
        let auxTracks = [];
        let tracksFav = JSON.parse(localStorage.getItem("favs"));
        console.log(tracksFav);
        if (tracksFav.length > 0) {
            for (let i = 0; i < tracks.length; i++) {
                if (tracksFav.includes(tracks[i].identifier)) {
                    auxTracks.push(tracks[i]);
                }
            }
        } else {
            alert("No tienes circutos favoritos")
        }
        tracks = auxTracks;
        console.log(tracks);
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
showTracksByName = document.getElementById("az");
showTracksByName.addEventListener('click', ordenar);
showTracksByName.myParam = "name";

showTracksFavs = document.getElementById("favs");
showTracksFavs.addEventListener('click', ordenar);
showTracksFavs.myParam = "favs";
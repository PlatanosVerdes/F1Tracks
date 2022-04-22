//Funcion que reproduce el audio al entrar en la página
function leerJSON() {
    var datos = '';
    const xhttp = new XMLHttpRequest();
    xhttp.open('GET', 'f1tracks.json', true);
    xhttp.send(null);
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            /* console.log(this.responseText); */

            datos = JSON.parse(this.responseText);
            console.log(datos);
            console.log(datos.track.length);

            var tracks = datos.track;

            console.log(new Date(tracks[0].date) - new Date(tracks[1].date));

            tracks.sort((a, b) => new Date(a.date) - new Date(b.date));
            console.log(tracks);


            let trackList = document.getElementById('track-list');
            trackList.innerHTML = '';
            for (var i = 0; i < tracks.length; i++) {
                var trackItem = document.createElement("div");
                trackItem.setAttribute("class", "track-item");

                trackItem.innerHTML = `
                    <div class="row">
                        <div class="col-sm-12 col-md-6">
                        <a href="track.html">
                            <img class="img-fluid rounded mb-3 mb-md-0" src="assets/img/tracks/${tracks[i].identifier}.png" alt="Track">
                        </a>
                        </div>
                        <div class="col-sm-12 col-md-6">
                            <h3>${tracks[i].alternateName}</h3>
                            <p>${tracks[i].description}</p>
                        </div>
                    </div>
                `;

                trackList.appendChild(trackItem);
            }

            console.log(tracks);
        }
    }
}

function currentDate() {
    let currentDate = new Date();
    let cDay = currentDate.getDate();
    let cMonth = currentDate.getMonth() + 1;
    let cYear = currentDate.getFullYear();

    /* console.log(cDay);
    console.log(cMonth);
    console.log(cYear); */
    /* let s = cYear + '-' + cMonth + '-' + cDay;  */

    return new Date(cYear, cMonth, cDay);
}


function getTracksByCurrentDate() {
    var data = leerJSON();
    console.log(data);

    var tracks;

    for (let item of data) {
        console.log(item.length);
        /* var tracks = item.track;
        tracks.sort(function (a, b) {
            return a.getTime() - b.getTime();
        }); */
    }
}



function playAudio() {
    audio = document.getElementById("index-audio");
    audio.muted = false;
    audio.play();
    audio.volume = 0.35;
}

/* FALTA CONTROL DE ERRORES */
function leerxml() {
    var req = new XMLHttpRequest();
    req.open('GET', 'http://www.mozilla.org/', false);
    req.send(null);
    if (req.status == 200)
        dump(req.responseText);
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
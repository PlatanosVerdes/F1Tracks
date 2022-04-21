//Funcion que reproduce el audio al entrar en la página
function leerJSON() {
    const xhttp = new XMLHttpRequest();
    xhttp.open('GET', 'f1tracks.json', true);
    xhttp.send(null);
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            console.log(this.responseText);

            let datos = JSON.parse(this.responseText);
            console.log(datos);
            /* let res = document.querySelector('#res');
            res.innerHTML = ''; */

            for (let item of datos) {
                console.log(item.track);
                console.log(item.participant);
                console.log(item.participant.name);

                /* res.innerHTML +=`
                    <>..
                ` */
            }
        }
    }
}

function currentDate() {
    let currentDate = new Date();
    let cDay = currentDate.getDate();
    let cMonth = currentDate.getMonth() + 1;
    let cYear = currentDate.getFullYear();
    
    console.log(cDay);
    console.log(cMonth);
    console.log(cYear);

    console.log("<b>" + cDay + "/" + cMonth + "/" + cYear + "</b>");
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
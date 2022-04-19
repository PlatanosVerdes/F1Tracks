//Funcion que reproduce el audio al entrar en la página
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
let idTrack = sessionStorage.getItem('idTrack');
console.log(idTrack);

var nomTrack = idTrack;

function printTrackMainInfo() {

    var data
    const xhttp = new XMLHttpRequest();
    xhttp.open('GET', 'f1tracks.json', true);
    xhttp.send(null);
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {

            data = JSON.parse(this.responseText);
            console.log(data);

            let tracks = data.track;

            var i;
            for (i = 0; i<tracks.length;i++){   
        
                if(tracks[i].identifier==nomTrack){
                    break;
                }
            }
            var idPilot = tracks[i].datos_extra.lapRecord.pilot;
            console.log(idPilot);
            var pilot = getPilot(data, idPilot)

            var years = getYears(tracks[i]);

            let MainInfoTrack = document.createElement("div");
                MainInfoTrack.setAttribute("class", "trackView");
                MainInfoTrack.setAttribute("id", "trackView");
        
                MainInfoTrack.innerHTML = `
                <div class="title-track">
                <div class="row ">
                    <div class="col">
                            <i class="bi bi-star-fill"></i>
                            <h10>${tracks[i].alternateName}</h10>
                    </div>
                </div>
                </div>
                <img class="img-fluid rounded mb-3 mb-md-0" src="assets/img/tracks/${tracks[i].image[0]}" alt="Track">

                <div class="title">
                    <div class="sub-title-track">
                        <h1>${tracks[i].name}</h1>
                    </div>
                </div>
                
                <div class="detail">
                            <div class="row align-items-start">
                                <div class="col">
                                    <div class="detail-info">
                                        <div class="detail-info-title">País</div>
                                        <div class="detail-info-content">${tracks[i].GeoCoordinates.addressCountry}</div>
                                    </div>

                                    <div class="detail-info">
                                        <div class="detail-info-title">Distancia</div>
                                        <div class="detail-info-content">${tracks[i].datos_extra.trackDistance} km</div>
                                    </div>
                                </div>
                                <div class="col">
                                    <div class="detail-info">
                                        <div class="detail-info-title">Vueltas</div>
                                        <div class="detail-info-content">${tracks[i].datos_extra.numberLaps}</div>
                                    </div>
                                    <div class="detail-info">
                                        <div class="detail-info-title">Años</div>
                                        <div class="detail-info-content">${years}</div>
                                    </div>
                                </div>
                            </div>
                            <div class="row align-items-center">
                                <div class="col">
                                    <div class="detail-info">
                                        <div class="row">
                                            <div class="col">
                                                <div class="detail-info-title">Vuelta rápida</div>
                                                <div class="detail-info-content">${tracks[i].datos_extra.lapRecord.time}</div>
                                            </div>
                                            <div class="col ">
                                                <img class="img-fluid rounded" src="assets/img/flags/${pilot.nationality}.svg"
                                                    alt="Flag Country">
                                                <div class="detail-info-content">${pilot.name} ${pilot.lastName}</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="title">
                            <h1>Descripción pista</h1>
                        </div>
                        <p>
                            ${tracks[i].description}
                        </p>

                `;
        
        
            let content = document.getElementById('track-content');
            content.appendChild(MainInfoTrack);
        }
    }
}

function getPilot(data, idPilot){

    let pilot = data.participant;

    var plt = {
        id: null,
        name: null,
        lastName: null,
        alternateName: null,
        nationality: null,
        memberOf: null

    }

    for (var i = 0; i < pilot.length; i++ ){
        if(pilot[i].id == idPilot){
            plt.id = pilot[i].id;
            plt.name = pilot[i].name;
            plt.lastName = pilot[i].lastName;
            plt.alternateName = pilot[i].alternateName;
            plt.nationality = pilot[i].nationality;
            plt.memberOf = pilot[i].memberOf;
            break;
        }
    }

    return plt;
}

function getYears(data){
    var year = data.datos_extra.years;
    var s ="";
    for(var i = 0; i<year.length; i++){

        if (i==year.length-1){
            s += year[i];
        }else{
            s += year[i] + " ,";
        }
    }
    return s;
}

window.addEventListener('load', initTrack)
function initTrack(){
    printTrackMainInfo();
}

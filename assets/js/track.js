let idTrack = sessionStorage.getItem('idTrack');
var nomTrack = idTrack;



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

function getClassification(data,i){
    var c = data.track[i].datos_extra.classification;
    console.log(c);
    var ClassificationNames={
        name: null,
        lastName: null
    }
    let classificationArray = [];
    for(var i=0; i< c.length;i++){
        console.log(c[i][0]);
        var pilot = getPilot(data, c[i][0]);
        var ClassificationNames={
            name: pilot.name,
            lastName: pilot.lastName,
            Time: c[i][1]
        }
        classificationArray.push(ClassificationNames);
    }
    console.log(classificationArray);
    document.getElementById(primeroNombre).innerHTML=`${classificationArray[0][2]}`;
    document.getElementById(primeroTiempo).innerHTML=`${classificationArray[0][0]}`;
    document.getElementById(segundoNombre).innerHTML=`${classificationArray[1][0]}`;
    document.getElementById(segundoTiempo).innerHTML=`${classificationArray[1][2]}`;
    document.getElementById(terceroNombre).innerHTML=`${classificationArray[2][0]}`;
    document.getElementById(terceroTiempo).innerHTML=`${classificationArray[2][2]}`;
    document.getElementById(cuartoNombre).innerHTML=`${classificationArray[3][0]}`;
    document.getElementById(cuartoTiempo).innerHTML=`${classificationArray[3][2]}`;
    
}



function printTrackMainInfo() {

    var data
    const xhttp = new XMLHttpRequest();
    xhttp.open('GET', 'f1tracks.json', true);
    xhttp.send(null);
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {

            data = JSON.parse(this.responseText);

            let tracks = data.track;

            var i;
            for (i = 0; i<tracks.length;i++){   
        
                if(tracks[i].identifier==nomTrack){
                    break;
                }
            }
            var idPilot = tracks[i].datos_extra.lapRecord.pilot;
            var pilot = getPilot(data, idPilot)
            var years = getYears(tracks[i]);
            

            document.getElementById('img-track').src=`assets/img/tracks/${tracks[i].image[0]}`;
            document.getElementById('alterName-track').innerHTML=`${tracks[i].alternateName}`;
            document.getElementById('name-track').innerHTML=`${tracks[i].name}`;
            document.getElementById('location-track').innerHTML=`${tracks[i].GeoCoordinates.addressCountry}`;
            document.getElementById('distance-track').innerHTML=`${tracks[i].datos_extra.trackDistance}`;
            document.getElementById('laps-track').innerHTML=`${tracks[i].datos_extra.numberLaps}`;
            document.getElementById('years-track').innerHTML=`${years}`;
            document.getElementById('record-time-track').innerHTML=`${tracks[i].datos_extra.lapRecord.time}`;

            
            let img = document.createElement("img");
            img.setAttribute("class", "img-fluid rounded");
            img.setAttribute("alt", "Flag Country");
            img.src = "assets/img/flags/"+pilot.nationality+".svg";
            
            let detailLapRecord = document.createElement("div");
            detailLapRecord.setAttribute("class", "detail-info-content");
            detailLapRecord.innerHTML=`${pilot.name} ${pilot.lastName}`;

            let lapRecord = document.getElementById("pilot-record-track");
            lapRecord.appendChild(img);
            lapRecord.appendChild(detailLapRecord);

            document.getElementById('record-time-track').innerHTML=`${tracks[i].datos_extra.lapRecord.time}`;
            document.getElementById('description-track').innerHTML=`${tracks[i].description}`;
            
            var classification = getClassification(data,i);
            
        }
    }
}

window.addEventListener('load', initTrack)
function initTrack(){
    printTrackMainInfo();
}

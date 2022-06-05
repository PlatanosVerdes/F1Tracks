const nameTrack = sessionStorage.getItem("idTrack");
var posTrack;
async function getPos() {
  posTrack = await posTrackInJSON(nameTrack);
}
getPos();

function getYears(data) {
  let year = data.datos_extra.years;
  let s = "";
  for (var i = 0; i < year.length; i++) {
    if (i == year.length - 1) {
      s += year[i];
    } else {
      s += year[i] + ", ";
    }
  }
  return s;
}

async function fetchJSONExterno() {
  const response = await fetch("https://hollypedia.netlify.app/json/peliculas.json");
  if (!response.ok) {
    const message = `An error has occured: ${response.status}`;
    throw new Error(message);
  }
  const data = await response.json();
  return data;
}
fetchJSONExterno().catch(error => {
  error.message; // 'An error has occurred: 404'
});

function getPilot(data, idPilot) {
  let pilot = data.participant;

  var plt = {
    id: null,
    name: null,
    lastName: null,
    alternateName: null,
    nationality: null,
    memberOf: null,
  };

  for (var i = 0; i < pilot.length; i++) {
    if (pilot[i].id == idPilot) {
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

function getClassification(data) {
  var classification = data.track[posTrack].datos_extra.classification;

  let pos = document.getElementById("secction-posiciones");
  let divParent = document.createElement("div");
  divParent.setAttribute("class", "posicion");
  if (classification.length > 0) {
    let ids = ["primero", "segundo", "tercero", "cuarto"];

    for (let i = 0; i < ids.length; i++) {
      let pilot = getPilot(data, classification[i][0]);

      let rowParent = document.createElement("div");
      rowParent.setAttribute("class", "row");
      rowParent.setAttribute("id", ids[i]);

      /* NAME */
      let colName = document.createElement("div");
      colName.setAttribute("class", "col sm-6");

      let cardBodyName = document.createElement("div");
      cardBodyName.setAttribute("class", "card-body");

      let p1 = document.createElement("p");
      p1.setAttribute("class", "card-text");
      p1.setAttribute("id", ids[i]);
      p1.innerHTML = `${pilot.name} ${pilot.lastName}`;

      cardBodyName.appendChild(p1);
      colName.appendChild(cardBodyName);
      rowParent.appendChild(colName);

      /* TIME */
      let colTime = document.createElement("div");
      colTime.setAttribute("class", "col sm-6");

      let cardBodyTime = document.createElement("div");
      cardBodyTime.setAttribute("class", "card-body");

      let p4 = document.createElement("p");
      p4.setAttribute("class", "card-text");
      p4.setAttribute("id", ids[i]);
      if (i > 0) {
        p4.innerHTML = `+${classification[i][1]}`;
      } else {
        p4.innerHTML = `${classification[i][1]}`;
      }

      cardBodyTime.appendChild(p4);
      colTime.appendChild(cardBodyTime);
      rowParent.appendChild(colTime);

      divParent.appendChild(rowParent);
    }
    pos.appendChild(divParent);
  } else {
    document.getElementById("secction-posiciones").remove();
  }
}

function printTrackMainInfo(data) {
  let tracks = data.track;

  maps(tracks, posTrack);
  var idPilot = tracks[posTrack].datos_extra.lapRecord.pilot;
  var pilot = getPilot(data, idPilot);
  var years = getYears(tracks[posTrack]);

  let parentIcoFav = document.getElementById("col-ico-fav");
  let bt = document.createElement("button");
  bt.setAttribute("aria-label", "Favorite");

  let icon = document.createElement("i");
  icon.setAttribute("id", "ico-fav");
  let name = document.createElement("h10");
  name.setAttribute("id", "alterName-track");
  name.innerHTML = `${tracks[posTrack].alternateName}`;

  var tracksFav = [];
  tracksFav = JSON.parse(localStorage.getItem("favs"));
  icon.setAttribute("class", "bi bi-star");
  if (tracksFav != null) {
    if (tracksFav.includes(nameTrack)) {
      icon.setAttribute("class", "bi bi-star-fill");
    }
  }

  icon.setAttribute("onclick", "trackfav()");

  bt.appendChild(icon);
  parentIcoFav.appendChild(bt);
  parentIcoFav.appendChild(name);

  document.getElementById(
    "img-track"
  ).src = `assets/img/tracks/${tracks[posTrack].image[0]}`;
  document.getElementById("img-track").alt = tracks[posTrack].image[0];
  document.getElementById("name-track").innerHTML = `${tracks[posTrack].name}`;
  document.getElementById(
    "location-track"
  ).innerHTML = `${tracks[posTrack].GeoCoordinates.addressCountry}`;
  document.getElementById(
    "distance-track"
  ).innerHTML = `${tracks[posTrack].datos_extra.trackDistance} km`;
  document.getElementById(
    "laps-track"
  ).innerHTML = `${tracks[posTrack].datos_extra.numberLaps}`;
  document.getElementById("years-track").innerHTML = `${years}`;
  document.getElementById(
    "record-time-track"
  ).innerHTML = `${tracks[posTrack].datos_extra.lapRecord.time}`;

  let img = document.createElement("img");
  img.setAttribute("class", "img-fluid rounded");
  img.setAttribute("alt", "Flag Country");
  img.setAttribute("loading", "lazy");
  img.src = "assets/img/flags/" + pilot.nationality + ".svg";

  let detailLapRecord = document.createElement("div");
  detailLapRecord.setAttribute("class", "detail-info-content");
  detailLapRecord.innerHTML = `${pilot.name} ${pilot.lastName} (${tracks[posTrack].datos_extra.lapRecord.year})`;

  let lapRecord = document.getElementById("pilot-record-track");
  lapRecord.appendChild(img);
  lapRecord.appendChild(detailLapRecord);

  document.getElementById(
    "record-time-track"
  ).innerHTML = `${tracks[posTrack].datos_extra.lapRecord.time}`;
  document.getElementById(
    "description-track"
  ).innerHTML = `${tracks[posTrack].description}`;

  getClassification(data, posTrack);
  videosTrack(tracks, posTrack);
  tiempoAPIDia(tracks, posTrack);
  tiempoAPIForecast(tracks, posTrack);
}

function sessionVarWhenClickNav(save) {
  sessionStorage.setItem("navClicked", save);
  location.href = "index.html";
}

/* Funcion que reproduce un audio al cargar la pagina */
async function playAudio() {
  audio = document.getElementById("index-audio");
  audio.muted = false;
  audio.play();
  audio.volume = 0.15;
}

function createMenuCircuitsTrack(year) {
  let index = document.getElementById("years");
  indexYear = 2022 - year;
  index.innerHTML = ``;
  for (let i = 1; i < year + 1; i++) {
    let li = document.createElement("li");
    li.setAttribute("id", "years");
    li.setAttribute("title", indexYear + i);

    let button = document.createElement("button");
    button.addEventListener("click", () =>
      sessionVarWhenClickNav(indexYear + i)
    );

    let a = document.createElement("a");
    a.setAttribute("href", "#");
    a.innerHTML = indexYear + i;

    button.appendChild(a);
    li.appendChild(button);
    index.appendChild(li);
  }

  document
    .getElementById("bt-az")
    .addEventListener("click", () => sessionVarWhenClickNav("name"));
  document
    .getElementById("bt-favs")
    .addEventListener("click", () => sessionVarWhenClickNav("favs"));
}

function initJSONLD(data) {
  document.querySelector("script[type='application/ld+json']").innerHTML = `
      {
        "@context": "http://www.schema.org",
        "@type": "Track",
        "name": "${data.track[posTrack].name}",
        "identifier": "${data.track[posTrack].identifier}",
        "image": "${data.track[posTrack].image}",
        "video": "${data.track[posTrack].video}",
        "alternateName": "${data.track[posTrack].alternateName}",
        "description": "${data.track[posTrack].description}",
        "date": "${data.track[posTrack].date}",
        "GeoCoordinates": {
          "@type": "GeoCoordinates",
          "longitude": "${data.track[posTrack].GeoCoordinates.longitude}",
          "latitude": "${data.track[posTrack].GeoCoordinates.latitude}",
          "addressCountry": "${data.track[posTrack].GeoCoordinates.addressCountry}",
          "addresRegion": "${data.track[posTrack].GeoCoordinates.addresRegion}",
          "addressLocality": "${data.track[posTrack].GeoCoordinates.addressLocality}"
        },
        "datos_extra": {
          "flag": "${data.track[posTrack].datos_extra.flag}",
          "numberLaps": "${data.track[posTrack].datos_extra.numberLaps}",
          "trackDistance": "${data.track[posTrack].datos_extra.trackDistance}",
          "years": "${data.track[posTrack].datos_extra.years}",
          "lapRecord": {
            "time": "${data.track[posTrack].datos_extra.lapRecord.time}",
            "pilot": "${data.track[posTrack].datos_extra.lapRecord.pilot}",
            "year": "${data.track[posTrack].datos_extra.lapRecord.year}"
          },
          "classification": "${data.track[posTrack].classification}"
        }
      }
    `;
}

function extraerInfoJSONPeliculas(peliculas) {
  //Segun genero "sport"
  var arraypeliculas = peliculas.filter((pelicula) => pelicula.genre.some((genero) => genero.toLowerCase().includes("sport")));
  return arraypeliculas;
}

function extraerInfoJSONJuegos(jsonvjuegos) {
  var arrayjuegos = jsonvjuegos.filter(checkvjuego);
  function checkvjuego(jsonvjuegos) {
    return jsonvjuegos.includes("Fornite");
  }
  return arrayjuegos;
}

window.addEventListener("load", initTrack);
async function initTrack() {
  playAudio();
  let data = await fetchJSON();
  createMenuCircuitsTrack(4, data);
  printTrackMainInfo(data);
  initJSONLD(data);
  let jsonpeliculas = await fetchJSONExterno();
  let listapeliculas = await extraerInfoJSONPeliculas(jsonpeliculas);
  carrouselContenidoRelacionado(listapeliculas);
}

//API MAPS
function maps(listacirc, num) {
  let coor = listacirc[num].GeoCoordinates;
  let long = coor.longitude;
  let lat = coor.latitude;
  const bounds = [
    [lat, long], // [west, south]
    [lat, long], // [east, north]
  ];
  var map = L.map("map2").setView([lat, long], 14);
  L.tileLayer(
    "https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}",
    {
      attribution: `${listacirc[num].GeoCoordinates.addressCountry},${listacirc[num].GeoCoordinates.addressLocality}`,
      maxZoom: 18,
      minZoom: 5,
      id: "mapbox/streets-v11",
      tileSize: 512,
      zoomOffset: -1,
      accessToken:
        "pk.eyJ1IjoicGF1aW5kYW5pY29sYXUiLCJhIjoiY2wyazhmZm80MGF5cDNicGtlazdyN3kxbyJ9.zoF8CP2CPUgGrw0U8e2_cA",
    }
  ).addTo(map);
  map.setMaxBounds(bounds);

  var marker = L.marker([lat, long]).addTo(map);
  marker.bindPopup(
    `<b>${listacirc[num].name}</b><br>${listacirc[num].alternateName}`
    //<br><img src="assets/img/flags/${listacirc[num].datos_extra.flag}" width="200px" hight="200px" style="border:1px solid black;">
  );
}

function removeItemArray(array, item) {
  let pos;
  for (var i = 0; i < array.length; i++) {
    if (array[i] == item) {
      pos = i;
      break;
    }
  }
  array[pos] = array[array.length - 1];
  array.pop();
  return array;
}

function trackfav() {
  let tracksFav = [];
  tracksFav = JSON.parse(localStorage.getItem("favs"));
  let icon = document.getElementById("ico-fav");

  if (tracksFav != null) {
    if (tracksFav.includes(nameTrack)) {
      /*Esta*/
      tracksFav = removeItemArray(tracksFav, nameTrack);
      icon.className = "bi bi-star";
    } else {
      /*No esta*/
      tracksFav.push(nameTrack);
      icon.className = "bi bi-star-fill";
    }
  } else {
    /*Vacio*/
    tracksFav = [nameTrack];
    icon.className = "bi bi-star-fill";
  }

  localStorage.setItem("favs", JSON.stringify(tracksFav));
}

function videosTrack(data, i) {
  let title = document.getElementById("video-title");
  let iframes = document.getElementById("iframe-video");

  let carousel = document.createElement("div");
  carousel.setAttribute("class", "carousel slide");
  carousel.setAttribute("id", "carouselVideosTrack");
  carousel.setAttribute("data-bs-ride", "carousel");
  let carouselInner = document.createElement("div");
  carouselInner.setAttribute("class", "carousel-inner");

  carousel.appendChild(carouselInner);


  if (!data[i].video[1]) {
    title.innerHTML = `Video`;
    let carouselItem = document.createElement("div");
    carouselItem.setAttribute("class", "carousel-item active");
    carouselItem.setAttribute("data-bs-interval", "9999999");
    carouselItem.innerHTML = `<div class="row"><iframe title="HightLight" id="video-track" src="${data[i].video[0]}" frameborder="0" allowfullscreen controls=2 ></iframe></div>`;
    carouselInner.appendChild(carouselItem);
  } else {
    title.innerHTML = `Videos`;
    //Add primer item (active)
    let carouselItemActive = document.createElement("div");
    carouselItemActive.setAttribute("class", "carousel-item active");
    carouselItemActive.setAttribute("data-bs-interval", "9999999");
    carouselItemActive.innerHTML = `<div class="row"><iframe title="HightLight" id="video-track" src="${data[i].video[0]}" frameborder="0" allowfullscreen controls=2 ></iframe></div>`;
    carouselInner.appendChild(carouselItemActive);

    //Add un item
    let carouselItem = document.createElement("div");
    carouselItem.setAttribute("class", "carousel-item");
    carouselItem.setAttribute("data-bs-interval", "9999999");
    carouselItem.innerHTML = `<div class="row"><iframe title="Summary" id="video-track" src="${data[i].video[1]}" frameborder="0" allowfullscreen controls=2 ></iframe></div>`;
    carouselInner.appendChild(carouselItem);

    //Boton izquierdo
    let btPrev = document.createElement("button");
    btPrev.setAttribute("class", "carousel-control-prev");
    btPrev.setAttribute("type", "button");
    btPrev.setAttribute("data-bs-target", "#carouselVideosTrack");
    btPrev.setAttribute("data-bs-slide", "prev");
    let spanControlPrev = document.createElement("span");
    spanControlPrev.setAttribute("class", "carousel-control-prev-icon");
    spanControlPrev.setAttribute("aria-hidden", "true");
    btPrev.appendChild(spanControlPrev);
    let visuallyPrev = document.createElement("span");
    visuallyPrev.setAttribute("class", "visually-hidden");
    visuallyPrev.innerHTML = "Previous";
    btPrev.appendChild(visuallyPrev);
    carousel.appendChild(btPrev);

    //Boton derecho
    let btNext = document.createElement("button");
    btNext.setAttribute("class", "carousel-control-next");
    btNext.setAttribute("type", "button");
    btNext.setAttribute("data-bs-target", "#carouselVideosTrack");
    btNext.setAttribute("data-bs-slide", "next");
    let spanControlNext = document.createElement("span");
    spanControlNext.setAttribute("class", "carousel-control-next-icon");
    spanControlNext.setAttribute("aria-hidden", "true");
    btNext.appendChild(spanControlNext);
    let visuallyNext = document.createElement("span");
    visuallyNext.setAttribute("class", "visually-hidden");
    visuallyNext.innerHTML = "Next";
    btNext.appendChild(visuallyNext);
    carousel.appendChild(btNext);
  }
  //Add cousel en el nodo padre
  iframes.appendChild(carousel);
}

async function tiempoAPIForecast(track, i) {
  var URL1 =
    "https://api.openweathermap.org/data/2.5/forecast?lat=" +
    track[i].GeoCoordinates.latitude +
    "&lon=" +
    track[i].GeoCoordinates.longitude +
    "&units=metric&appid=bb95d1c6a9cadc0d98a84cf2a738c977&lang=es";
  await fetch(URL1)
    .then((response) => response.json())
    .then((data) => {
      var forecast = processTiempoForecast(data);
      showTiempoForecast(forecast);
    });
}

async function tiempoAPIDia(track, i) {
  var URL2 =
    "https://api.openweathermap.org/data/2.5/weather?lat=" +
    track[i].GeoCoordinates.latitude +
    "&lon=" +
    track[i].GeoCoordinates.longitude +
    "&units=metric&appid=bb95d1c6a9cadc0d98a84cf2a738c977&lang=es";
  await fetch(URL2)
    .then((response) => response.json())
    .then((data) => {
      var dia = processTiempoDia(data);
      showTiempoToday(dia);
    });
}

function currentDate() {
  let currentDate = new Date();
  let cDay = currentDate.getDate();
  let cMonth = currentDate.getMonth();
  let cYear = currentDate.getFullYear();
  let cHour = currentDate.getHours();
  let cMinute = currentDate.getMinutes();
  let cSecond = currentDate.getSeconds();

  return new Date(cYear, cMonth, cDay, cHour, cMinute, cSecond);
}

function tiempoDia(values) {
  var day = {
    date: values[0].date,
    temp: null,
    feels_like: values[0].main.feels_like,
    temp_min: parseInt(values[0].main.temp_min),
    temp_max: parseInt(values[0].main.temp_max),
    humidity: values[0].main.humidity,
    pressure: values[0].main.pressure,
    description: values[0].weather.description,
    wind: values[0].wind.speed,
    icon: values[0].weather.icon,
  };

  for (var i = 1; i < values.length; i++) {
    if (parseFloat(day.temp_min) > parseFloat(values[i].main.temp_min)) {
      day.temp_min = parseInt(values[i].main.temp_min);
    }
    if (parseFloat(day.temp_max) < parseFloat(values[i].main.temp_max)) {
      day.temp_max = parseInt(values[i].main.temp_max);
    }
  }

  return day;
}

function processTiempoForecast(data) {
  let forecast5days = [];
  let forecastDay = [];

  var day = new Date(currentDate()).getDate();
  var dateDay = day + 1;

  for (var i = 0; i < data.list.length; i++) {
    var dateForecast = new Date(data.list[i].dt_txt);

    if (dateForecast.getDate() != day) {
      var storedDay = dateForecast.getDate();
      var storedMonth = dateForecast.getMonth();
      var infoForecast = {
        main: data.list[i].main,
        weather: data.list[i].weather[0],
        wind: data.list[i].wind,
        date: parseDate(storedMonth, storedDay),
      };

      if (dateForecast.getDate() != dateDay) {
        forecast5days.push(tiempoDia(forecastDay));
        forecastDay.length = 0;
        dateDay = dateForecast.getDate();
      }

      forecastDay.push(infoForecast);
    }
  }

  return forecast5days;
}
function processTiempoDia(data) {
  const str = data.weather[0].description;
  const str2 = str.charAt(0).toUpperCase() + str.slice(1);

  var today = {
    temp: data.main.temp,
    feels_like: parseInt(data.main.feels_like),
    temp_min: parseInt(data.main.temp_min),
    temp_max: parseInt(data.main.temp_max),
    humidity: data.main.humidity,
    pressure: data.main.pressure,
    description: str2,
    wind: data.wind.speed,
    icon: data.weather[0].icon,
  };
  return today;
}

function showTiempoToday(data) {
  document.getElementById(
    "TiempoHoyImg"
  ).src = `https://openweathermap.org/img/wn/${data.icon}@2x.png`;
  document.getElementById("TiempoHoyDesc").innerHTML = `${data.description}`;
  document.getElementById("TiempoHoyMax").innerHTML = `${data.temp_max} ºC`;
  document.getElementById("TiempoHoyMin").innerHTML = `${data.temp_min} ºC`;
  document.getElementById("TiempoHoyHumidity").innerHTML = `${data.humidity}%`;
  document.getElementById("TiempoHoyFeel").innerHTML = `${data.feels_like} ºC`;
  document.getElementById("TiempoHoyWind").innerHTML = `${data.wind} km/h`;
  document.getElementById(
    "TiempoHoyPressure"
  ).innerHTML = `${data.pressure} hPa`;
}

function showTiempoForecast(data) {
  let forecast = document.getElementById("TiempoForecast");
  for (var i = 0; i < data.length; i++) {
    let dayForecast = document.createElement("div");
    dayForecast.setAttribute("class", "col-md-3 text-center");
    dayForecast.setAttribute("id", "tiempoForecast");
    dayForecast.innerHTML = `${data[i].date} 
        <img src="https://openweathermap.org/img/wn/${data[i].icon}@2x.png" loading="lazy" alt="No hay datos"></img>
        <div class="row-cols-md-auto text-center max">
            ${data[i].temp_max}
        </div>
        <div class="row-cols-md-auto text-center min">
        ${data[i].temp_min}
        </div>`;

    forecast.appendChild(dayForecast);
  }
}

function parseDate(month, day) {
  var months = [
    "ENE",
    "FEB",
    "MAR",
    "ABR",
    "MAY",
    "JUN",
    "JUL",
    "AGO",
    "SEP",
    "OCT",
    "NOV",
    "DIC",
  ];
  return (fecha = day.toString() + " " + months[month]);
}

/*Carrousel Contenido Relacionado*/
function carrouselContenidoRelacionado(peliculas) {
  let contList = document.getElementById("carousel-relacionado");
  contList.innerHTML += ``;
  if (peliculas.length < 2) {
    document.getElementById("cr-prev").remove();
    document.getElementById("cr-next").remove();
  }
  for (var i = 0; i < peliculas.length; i++) {
    contList.innerHTML += `
        <div class="carousel-item  ${i == 0 ? "active" : ""}""" data-bs-interval="9000">
        <img src="https://hollypedia.netlify.app/${peliculas[i].image[0].name}" loading="lazy" class="d-block w-100" alt="${peliculas[i].image[0].name}" id="imagenpelicula">
        <div class="hover-effect">
            <div class="text">
            <div>Película:</div>
                <a href="https://hollypedia.netlify.app/movies.html" target="_blank">${peliculas[i].name}</a>
                <div>${peliculas[i].datePublished}</div>
            </div>
        </div>
        </div>   
      `;
  }
}

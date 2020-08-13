window.onload = () => {
  getCountryData();
  getWorldwideData();
  getNepalData();
};

var map;
var infoWindow;
const formatter = new Intl.NumberFormat("en");
function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: 28.3949, lng: 84.124 },
    zoom: 4,
    styles: [
      {
        featureType: "all",
        elementType: "geometry.fill",
        stylers: [
          {
            weight: "2.00",
          },
        ],
      },
      {
        featureType: "all",
        elementType: "geometry.stroke",
        stylers: [
          {
            color: "#9c9c9c",
          },
        ],
      },
      {
        featureType: "all",
        elementType: "labels.text",
        stylers: [
          {
            visibility: "on",
          },
        ],
      },
      {
        featureType: "landscape",
        elementType: "all",
        stylers: [
          {
            color: "#f2f2f2",
          },
        ],
      },
      {
        featureType: "landscape",
        elementType: "geometry.fill",
        stylers: [
          {
            color: "#ffffff",
          },
        ],
      },
      {
        featureType: "landscape.man_made",
        elementType: "geometry.fill",
        stylers: [
          {
            color: "#ffffff",
          },
        ],
      },
      {
        featureType: "poi",
        elementType: "all",
        stylers: [
          {
            visibility: "off",
          },
        ],
      },
      {
        featureType: "road",
        elementType: "all",
        stylers: [
          {
            saturation: -100,
          },
          {
            lightness: 45,
          },
        ],
      },
      {
        featureType: "road",
        elementType: "geometry.fill",
        stylers: [
          {
            color: "#eeeeee",
          },
        ],
      },
      {
        featureType: "road",
        elementType: "labels.text.fill",
        stylers: [
          {
            color: "#7b7b7b",
          },
        ],
      },
      {
        featureType: "road",
        elementType: "labels.text.stroke",
        stylers: [
          {
            color: "#ffffff",
          },
        ],
      },
      {
        featureType: "road.highway",
        elementType: "all",
        stylers: [
          {
            visibility: "simplified",
          },
        ],
      },
      {
        featureType: "road.arterial",
        elementType: "labels.icon",
        stylers: [
          {
            visibility: "off",
          },
        ],
      },
      {
        featureType: "transit",
        elementType: "all",
        stylers: [
          {
            visibility: "off",
          },
        ],
      },
      {
        featureType: "water",
        elementType: "all",
        stylers: [
          {
            color: "#46bcec",
          },
          {
            visibility: "on",
          },
        ],
      },
      {
        featureType: "water",
        elementType: "geometry.fill",
        stylers: [
          {
            color: "#c8d7d4",
          },
        ],
      },
      {
        featureType: "water",
        elementType: "labels.text.fill",
        stylers: [
          {
            color: "#070707",
          },
        ],
      },
      {
        featureType: "water",
        elementType: "labels.text.stroke",
        stylers: [
          {
            color: "#ffffff",
          },
        ],
      },
    ],
  });
  infoWindow = new google.maps.InfoWindow();
}

const getCountryData = () => {
  fetch("https://corona.lmao.ninja/v2/countries")
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      showDataOnMap(data);
      showDataInTable(data);
      // console.log(data);
    });
};

const getWorldwideData = () => {
  fetch("https://disease.sh/v2/all")
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      showDataWorldwide(data);
      // console.log(data);
    });
};

const getNepalData = () => {
  fetch("https://data.nepalcorona.info/api/v1/covid/summary")
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      showDataWorldwide(data);
      console.log(data);
    });
};

const showDataOnMap = (data) => {
  data.map((country) => {
    let countryCenter = {
      lat: country.countryInfo.lat,
      lng: country.countryInfo.long,
    };
    var countryCircle = new google.maps.Circle({
      strokeColor: "#FF0000",
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: "#FF0000",
      fillOpacity: 0.35,
      map: map,
      center: countryCenter,
      radius: country.casesPerOneMillion * 15,
    });
    var html = `
    <div class="info-container">   
      <div class="info-name">
      <div class="info-flag">
      <img src= "${country.countryInfo.flag}">
      </div> 
      <div class="info-country">
      ${country.country}
      </div> 
      </div>
      <div class="info-confirmed">
        Confirmed: ${formatter.format(country.cases)}
      </div>
      <div class="info-recovered">
        Recovered: ${formatter.format(country.recovered)}
      </div>
      <div class="info-deaths">
        Deaths: ${formatter.format(country.deaths)}
      </div>
    </div>
    `;
    var infoWindow = new google.maps.InfoWindow({
      content: html,
      position: countryCircle.center,
    });
    google.maps.event.addListener(countryCircle, "mouseover", function () {
      infoWindow.open(map);
    });
    google.maps.event.addListener(countryCircle, "mouseout", function () {
      infoWindow.close(map);
    });
  });
};

// Show Data Worldwide
const showDataWorldwide = (data) => {
  document.getElementById("total-confirmed").innerText = formatter.format(
    data.cases
  );
  document.getElementById("total-active").innerText = formatter.format(
    data.active
  );
  document.getElementById("total-recovered").innerText = formatter.format(
    data.recovered
  );
  document.getElementById("total-deaths").innerText = formatter.format(
    data.deaths
  );
};
// Show Data in Table
const showDataInTable = (data) => {
  var html = "";
  data.forEach((country) => {
    html += `
    <tr>
        <td> <img src= "${country.countryInfo.flag}">${country.country}</td>
        <td>${formatter.format(country.cases)}</td>
        <td>${formatter.format(country.active)}</td>
        <td>${formatter.format(country.recovered)}</td>
        <td>${formatter.format(country.deaths)}</td>
    </tr>
     `;
  });
  document.getElementById("table-data").innerHTML = html;
};

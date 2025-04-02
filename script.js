const initialFocus = [55.819931, 37.529315];
const initialZoom = 18;
const map = L.map('map', {
    center: initialFocus,
    zoom: initialZoom,
    minZoom: 17,
    maxZoom: 18,
    zoomControl: false
});

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
}).addTo(map);

const southWest = L.latLng(55.817240, 37.537840);
const northEast = L.latLng(55.821547, 37.523271);
const bounds = L.latLngBounds(southWest, northEast);

map.setMaxBounds(bounds);

map.on('dragend', function () {
    if (!bounds.contains(map.getCenter())) {
        map.setView(bounds.getCenter());
    }
});

const routeCoords = {
    chief: [
        [55.819445, 37.528900],
        [55.819520, 37.528900],
        [55.819560, 37.529235],
        [55.819690, 37.529248],
        [55.820045, 37.529670],
        [55.820245, 37.529595],
        [55.820335, 37.529685],
        [55.820360, 37.529890],
        [55.820337, 37.530050],
        [55.820220, 37.530155],
        [55.820195, 37.529970],
    ],
    management: [
        [55.819445, 37.528900],
        [55.819520, 37.528900],
        [55.819560, 37.529235],
        [55.819690, 37.529248],
        [55.820045, 37.529670],
        [55.820245, 37.529595],
        [55.820335, 37.529685],
        [55.820360, 37.529890],
        [55.820337, 37.530050],
        [55.820220, 37.530155],
        [55.820195, 37.529970],
    ],
    hospitalizationWaitingRoom: [
        [55.819445, 37.528900],
        [55.819520, 37.528900],
        [55.819560, 37.529235],
        [55.819690, 37.529248],
        [55.820045, 37.529670],
        [55.820245, 37.529595],
        [55.820335, 37.529685],
        [55.820360, 37.529890],
        [55.820337, 37.530050],
        [55.820170, 37.530200],
        [55.820275, 37.531100],
        [55.820612, 37.530990],
        [55.820593, 37.530820],
    ],
    AdultСlinic: [
        [55.819445, 37.528900],
        [55.819520, 37.528900],
        [55.819520, 37.528887],
        [55.819560, 37.528873],
        [55.819600, 37.528825],
        [55.819635, 37.528696],
        [55.819635, 37.528605],
        [55.819665, 37.528605], 
    ],
    adultReceptionDepartment: [
        [55.819445, 37.528900],
        [55.819520, 37.528900],
        [55.819560, 37.529235],
        [55.819690, 37.529248],
        [55.820045, 37.529670],
        [55.820245, 37.529595],
        [55.820335, 37.529685],
        [55.820360, 37.529890],
        [55.820337, 37.530050],
        [55.820170, 37.530200],
        [55.820275, 37.531100],
        [55.820558, 37.531005],
        [55.820625, 37.531683],
        [55.820386, 37.531540],   
    ],
    mainBuilding: [
        [55.819445, 37.528900],
        [55.819520, 37.528900],
        [55.819560, 37.529235],
        [55.819690, 37.529248],
        [55.820045, 37.529670],
        [55.820245, 37.529595],
        [55.820335, 37.529685],
        [55.820360, 37.529890],
        [55.820337, 37.530050],
        [55.820170, 37.530200],
        [55.820228, 37.530707],
        [55.820160, 37.530725],
    ],
    childrenDepartment: [
        [55.819445, 37.528900],
        [55.819440, 37.528753],
        [55.819230, 37.528820],
        [55.819340, 37.529995],
        [55.818785, 37.530260],
        [55.818897, 37.531190],
        [55.818963, 37.531166],
    ],
    education: [
        [55.819445, 37.528900],
        [55.819440, 37.528753],
        [55.819230, 37.528820],
        [55.819320, 37.529768],
        [55.819400, 37.529747],
    ],
    radial: [
      [55.819445, 37.528900],
      [55.819440, 37.528753],
      [55.819230, 37.528820],
      [55.819340, 37.529995],
      [55.819220, 37.530053],
      [55.819213, 37.530166],
  ],
};

let isAnimating = false;
let endMarker = null;
const routes = {};

function interpolatePoints(points, steps) {
    let interpolated = [];
    for (let i = 0; i < points.length - 1; i++) {
        const start = points[i];
        const end = points[i + 1];
        interpolated.push(start);
        for (let j = 1; j < steps; j++) {
            const lat = start[0] + (end[0] - start[0]) * (j / steps);
            const lng = start[1] + (end[1] - start[1]) * (j / steps);
            interpolated.push([lat, lng]);
        }
    }
    interpolated.push(points[points.length - 1]);
    return interpolated;
}

for (let key in routeCoords) {
    routes[key] = {
        coords: interpolatePoints(routeCoords[key], 20),
        polyline: L.polyline([], { color: '#2b86cd' }).addTo(map)
    };
}

const startMarkerIcon = L.icon({
    iconUrl: './img/kiosk.svg',
    iconSize: [32, 40],
    iconAnchor: [16, 32],
    popupAnchor: [78, 40]
});

const endMarkerIcon = L.icon({
    iconUrl: './img/door.svg',
    iconSize: [32, 40],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32]
});

const customPopupContent = `
    <div style="text-align: center;">
        <h3>Вы здесь</h3>
    </div>
`;

const startMarker = L.marker(routeCoords.chief[0], { icon: startMarkerIcon })
    .addTo(map)
    .bindPopup(customPopupContent)
    .openPopup();

    let isRouteBuilding = false;
    let isInactivityScreenActive = false;

    function animateRoute(routeKey) {
      if (isRouteBuilding) return;
      isRouteBuilding = true;
      
      const buttonsContainer = document.querySelector('#route-buttons');
      buttonsContainer.classList.add('hidden-by-route'); // Скрываем из-за маршрута
      
      // Остальная логика анимации маршрута...
      map.setView(initialFocus, initialZoom);
  
      for (let key in routes) {
          routes[key].polyline.setLatLngs([]);
      }
  
      if (endMarker) {
          map.removeLayer(endMarker);
          endMarker = null;
      }
  
      startMarker.closePopup();
  
      routes[routeKey].polyline.setLatLngs([]);
      let index = 0;
      const speed = 20;
  
      const interval = setInterval(() => {
          if (index < routes[routeKey].coords.length) {
              routes[routeKey].polyline.addLatLng(routes[routeKey].coords[index]);
              index++;
          } else {
              clearInterval(interval);
              isRouteBuilding = false;
  
              const endCoords = routes[routeKey].coords[routes[routeKey].coords.length - 1];
              endMarker = L.marker(endCoords, { icon: endMarkerIcon })
                  .addTo(map).openPopup();
  
              setTimeout(() => {
                  map.setView(endCoords, map.getZoom());
              }, 100);
  
              startMarker.openPopup();
              
              // Показываем панель только если:
              // 1. Не активно построение маршрута
              // 2. Не активен экран ожидания
              if (!isRouteBuilding && !isInactivityScreenActive) {
                  buttonsContainer.classList.remove('hidden-by-route');
                  buttonsContainer.classList.remove('hidden-by-inactivity');
              }
          }
      }, speed);
  }

  function resetMap() {
    if (endMarker) {
        map.removeLayer(endMarker);
        endMarker = null;
    }

    for (let key in routes) {
        routes[key].polyline.setLatLngs([]);
    }

    startMarker.openPopup();
    map.setView(initialFocus, initialZoom);
    
    // Восстанавливаем видимость панели если:
    // 1. Не активно построение маршрута
    // 2. Не активен экран ожидания
    if (!isRouteBuilding && !isInactivityScreenActive) {
        document.querySelector('.route-buttons').classList.remove('hidden-by-route');
        document.querySelector('.route-buttons').classList.remove('hidden-by-inactivity');
    }
}

let inactivityTimer = null;
let hideCount = 0; 

function showInactivityScreen() {
  isInactivityScreenActive = true;
  const inactivityScreen = document.getElementById('inactivity-screen');
  inactivityScreen.classList.remove('hidden');
  
  const buttonsContainer = document.querySelector('#route-buttons');
  buttonsContainer.classList.add('hidden-by-inactivity'); // Скрываем из-за экрана ожидания
  
  hideCount++;
  document.querySelector('.counter').textContent = `${hideCount}`;
  hideAllSections(); 
  resetMap();
}

function hideInactivityScreen() {
  isInactivityScreenActive = false;
  const inactivityScreen = document.getElementById('inactivity-screen');
  inactivityScreen.classList.add('hidden');
  
  const buttonsContainer = document.querySelector('#route-buttons');
  buttonsContainer.classList.remove('hidden-by-inactivity');
  
  // Если идет построение маршрута, не показываем панель
  if (isRouteBuilding) {
      buttonsContainer.classList.add('hidden-by-route');
  }
}

function resetInactivityTimer() {
    clearTimeout(inactivityTimer);
    hideInactivityScreen();
    inactivityTimer = setTimeout(showInactivityScreen, 60000); 
}

document.addEventListener('mousemove', resetInactivityTimer);
document.addEventListener('keypress', resetInactivityTimer);
document.addEventListener('click', resetInactivityTimer);
document.addEventListener('touchstart', resetInactivityTimer);

document.querySelector("#toggleButton").addEventListener("click", function() {
    const infoWrap = document.querySelector(".info__wrap");
    const infoContent = document.querySelector(".info__content");
    const infoTitle = document.querySelector('.info__title');
    const svgIcon = document.querySelector('.svg__icon');
    const svgError = document.querySelector('.svg__eror-icon')

    infoWrap.classList.toggle("active");
    infoContent.classList.toggle("active");

    if (infoTitle.classList.contains('hidden')) {
        infoTitle.classList.remove('hidden');
        infoTitle.classList.add('visible');
        svgError.classList.add('active');
    } else {
        infoTitle.classList.remove('visible');
        infoTitle.classList.add('hidden');
        svgError.classList.remove('active');
    }

    svgIcon.classList.toggle('flipped');
    
});



function hideAllSections() {
  document.querySelectorAll('.location-content, .education-content').forEach(el => {
    el.classList.remove('active');
  });
  hideInfo(); 
}

function hideEducationContent() {
  const educationContent = document.querySelector('.education-content');
  if (educationContent.classList.contains('active')) {
      educationContent.classList.remove('active');
  }
}

function hideInfo() {
    const infoWrap = document.querySelector(".info__wrap");
    const infoContent = document.querySelector(".info__content");
    const infoTitle = document.querySelector('.info__title');
    const svgIcon = document.querySelector('.svg__icon');

    if (infoWrap.classList.contains("active")) {
        infoWrap.classList.remove("active");
        infoContent.classList.remove("active");
        infoTitle.classList.remove('visible');
        infoTitle.classList.add('hidden');
        svgIcon.classList.remove('flipped');
    }
}

document.addEventListener('click', function(event) {
    const infoWrap = document.querySelector(".info__wrap");
    if (infoWrap.classList.contains("active") && !infoWrap.contains(event.target) && event.target !== document.getElementById("toggleButton")) {
        hideInfo();
    }
});

function setupLocationButtons() {
  const locationButtons = document.querySelectorAll('.location > button[id$="-info"]');
  
  locationButtons.forEach(button => {
    button.addEventListener('click', function() {
      const content = this.nextElementSibling;
      const isActive = content.classList.contains('active');
      const routeButton = content.querySelector('.location__btn');
      
      // Закрываем все открытые блоки
      document.querySelectorAll('.location-content.active, .education-content.active').forEach(openContent => {
        if (openContent !== content) {
          openContent.classList.remove('active');
          const btn = openContent.querySelector('.location__btn');
          if (btn) btn.classList.remove('animated');
        }
      });
      
      // Переключаем текущий блок
      content.classList.toggle('active');
      
      // Управляем анимацией
      if (routeButton) {
        if (content.classList.contains('active')) {
          // Небольшая задержка перед запуском анимации
          setTimeout(() => {
            routeButton.classList.add('animated');
          }, 300);
        } else {
          routeButton.classList.remove('animated');
        }
      }
      
      hideInfo();
    });
  });
}

// Инициализация при загрузке
document.addEventListener('DOMContentLoaded', function() {
  setupLocationButtons();
  
  // Обработчик для education кнопки
  document.querySelector('#education-info').addEventListener('click', function() {
    const educationContent = document.querySelector('.education-content');
    const isActive = educationContent.classList.contains('active');
    const eduRouteBtn = educationContent.querySelector('.education__btn');

    // Закрываем другие блоки
    document.querySelectorAll('.location-content.active').forEach(el => {
      el.classList.remove('active');
      const btn = el.querySelector('.location__btn');
      if (btn) btn.classList.remove('animated');
    });

    if (isActive) {
      educationContent.classList.remove('active');
      if (eduRouteBtn) eduRouteBtn.classList.remove('animated');
    } else {
      educationContent.classList.add('active');
      setTimeout(() => {
        if (eduRouteBtn) eduRouteBtn.classList.add('animated');
      }, 300);
    }
    
    hideInfo();
  });
});

// Обновленная функция hideAllSections
function hideAllSections() {
  document.querySelectorAll('.location-content, .education-content').forEach(el => {
    el.classList.remove('active');
  });
  hideInfo();
}

// кнопка для разработки нового маршрута
document.querySelector('#showRouteButton').addEventListener('click', () => {
  const routeKey = 'button'; 
  resetMap(); 
  
  routes[routeKey].polyline.setLatLngs(routes[routeKey].coords);
  const endCoords = routes[routeKey].coords[routes[routeKey].coords.length - 1];

  if (endMarker) {
      map.removeLayer(endMarker);
  }
  
  endMarker = L.marker(endCoords, { icon: endMarkerIcon }).addTo(map).openPopup();
  map.setView(endCoords, map.getZoom());
});


function getMonthWithDeclension(monthIndex) {
  const monthGenitive = {
      1: "января",  2: "февраля", 3: "марта", 
      4: "апреля",  5: "мая",     6: "июня", 
      7: "июля",    8: "августа", 9: "сентября", 
      10: "октября",11: "ноября", 12: "декабря"
  };

  return monthGenitive[monthIndex];
}

function updateTime() {
  let today = new Date();
  
  // Форматирование времени
  let hours = today.getHours();
  let minutes = today.getMinutes();
  
  hours = hours < 10 ? "0" + hours : hours;
  minutes = minutes < 10 ? "0" + minutes : minutes;
  
  // Форматирование даты
  const daysOfWeek = ["Воскресенье", "Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота"];
  
  let dayOfWeek = daysOfWeek[today.getDay()];
  let day = today.getDate();
  let monthIndex = today.getMonth() + 1;
  
  let monthDeclension = getMonthWithDeclension(monthIndex);
  
  document.querySelector('#time').innerHTML = hours + ":" + minutes;
  document.querySelector('#date').innerHTML = `${dayOfWeek}, ${day} ${monthDeclension}`;
}

setInterval(updateTime, 1000);




document.querySelector('#chief').addEventListener('click', () => { animateRoute('chief'); hideInfo(); hideAllSections(); });
document.querySelector('#hospitalizationWaitingRoom').addEventListener('click', () => { animateRoute('hospitalizationWaitingRoom'); hideInfo(); hideAllSections(); });
document.querySelector('#adultClinic').addEventListener('click', () => { animateRoute('AdultСlinic'); hideInfo(); hideAllSections(); });
document.querySelector('#adultReceptionDepartment').addEventListener('click', () => { animateRoute('adultReceptionDepartment'); hideInfo(); hideAllSections(); });
document.querySelector('#mainBuilding').addEventListener('click', () => { animateRoute('mainBuilding'); hideInfo(); hideAllSections(); });
document.querySelector('#childrenDepartment').addEventListener('click', () => { animateRoute('childrenDepartment'); hideInfo(); hideAllSections(); });
document.querySelector('#education').addEventListener('click', () => { animateRoute('education'); hideInfo(); hideAllSections(); }); 
document.querySelector('#radial').addEventListener('click', () => { animateRoute('radial'); hideInfo(); hideAllSections(); });

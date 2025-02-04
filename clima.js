const apiEndpoint = 'https://api.openweathermap.org/data/2.5/';
const apiKey = 'a6c70ff6ee453d0222a396af6c64552f'; // Reemplaza con tu API Key

const ubicacionInput = document.getElementById('ubicacion');
const paisSelect = document.getElementById('pais');
const buscarClimaButton = document.getElementById('buscar-clima');
const climaActualDiv = document.getElementById('clima-actual');

buscarClimaButton.addEventListener('click', buscarClima);

function buscarClima() {
    const ubicacion = ubicacionInput.value.trim();
    if (!ubicacion) {
        mostrarError("Por favor, ingresa una ciudad válida.");
        return;
    }

    mostrarCargando();
    document.getElementById("pronostico").innerHTML = "";

    const pais = paisSelect.value;
    const urlClima = `${apiEndpoint}weather?q=${ubicacion},${pais}&units=metric&appid=${apiKey}&lang=es`;
    const urlForecast = `${apiEndpoint}forecast?q=${ubicacion},${pais}&units=metric&appid=${apiKey}&lang=es`;

    Promise.all([fetch(urlClima), fetch(urlForecast)]) // Usar Promise.all para ambas llamadas
        .then(responses => Promise.all(responses.map(res => res.json())))
        .then(([climaData, forecastData]) => {
            mostrarClimaActual(climaData);
            obtenerPrediccion(forecastData);
            actualizarReloj(climaData.timezone);
        })
        .catch(error => {
            mostrarError("No se pudo obtener la información del clima.");
            console.error(error);
        });
}

function mostrarClimaActual(data) {
    if (data.cod !== 200) {
        mostrarError(`Error: ${data.message}`);
        return;
    }

    document.getElementById("ciudad").innerText = `${data.name}, ${data.sys.country}`;

    const timestamp = data.dt * 1000;
    const fecha = new Date(timestamp);
    const diasSemana = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
    const diaSemana = diasSemana[fecha.getDay()];

    const temperatura = data.main.temp;
    const humedad = data.main.humidity;
    const condiciones = data.weather[0].description;
    const icono = data.weather[0].icon;

    // Mapa de iconos personalizados (reemplaza con tus nombres de archivo)
    const iconosPersonalizados = {
        "01d": "sol.png",
        "01n": "luna.png",
        "02d": "nubes_soleadas.png",
        "02n": "nubes_luna.png",
        "03d": "nubes.png",
        "03n": "nubes.png",
    };

    const nombreIcono = iconosPersonalizados[icono] || `${icono}.png`; // fallback al icono de OpenWeatherMap si no hay coincidencia
    const iconUrl = `/iconos/${nombreIcono}`; // Ajusta la ruta a tu carpeta de iconos

    const sunriseTime = new Date(data.sys.sunrise * 1000).toLocaleTimeString("es-ES");
    const sunsetTime = new Date(data.sys.sunset * 1000).toLocaleTimeString("es-ES");
    const viento = data.wind.speed;

    climaActualDiv.innerHTML = `
        <div class="weather-card">
            <h3>${data.name}, ${data.sys.country}</h3>
            <p> Día: <strong>${diaSemana}</strong></p>
            <img src="${iconUrl}" alt="${condiciones}">
            <p class="temp">${temperatura}°C</p>
            <p> Humedad: ${humedad}%</p>
            <p> Viento: <strong>${viento} m/s</strong></p>
            <p> Amanecer: <strong>${sunriseTime}</strong></p>
            <p> Atardecer: <strong>${sunsetTime}</strong></p>
            <p class="desc">${condiciones.charAt(0).toUpperCase() + condiciones.slice(1)}</p>
            <p id="reloj"> Cargando hora...</p>
        </div>
    `;
}

function obtenerPrediccion(data) {
        let pronosticoPorDia = {}; // Objeto para almacenar datos por día

    data.list.forEach(item => {
        const fecha = new Date(item.dt * 1000);
        const dia = fecha.toLocaleDateString("es-ES", { weekday: "long" }); // Día en español

        if (!pronosticoPorDia[dia]) {
            pronosticoPorDia[dia] = {
                min: item.main.temp,
                max: item.main.temp,
                icono: item.weather[0].icon,
                descripcion: item.weather[0].description
            };
        } else {
            pronosticoPorDia[dia].min = Math.min(pronosticoPorDia[dia].min, item.main.temp);
            pronosticoPorDia[dia].max = Math.max(pronosticoPorDia[dia].max, item.main.temp);
        }
    });
}

function mostrarPrediccion(pronostico) {
   let html = "<h3>Pronóstico para los próximos días:</h3><div class='forecast-container'>";

    Object.keys(pronostico).forEach(dia => {
        const { min, max, icono, descripcion } = pronostico[dia];
        const iconUrl = `http://openweathermap.org/img/w/${icono}.png`;

        html += `
            <div class="forecast-card">
                <h4>${dia}</h4>
                <img src="${iconUrl}" alt="${descripcion}">
                <p>${descripcion.charAt(0).toUpperCase() + descripcion.slice(1)}</p>
                <p>🌡️ ${min.toFixed(1)}°C - ${max.toFixed(1)}°C</p>
            </div>
        `;
    });

    html += "</div>";
    document.getElementById("pronostico").innerHTML = html;
}

function obtenerUbicacion() {
       if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(pos => {
            const lat = pos.coords.latitude;
            const lon = pos.coords.longitude;
            const url = `${apiEndpoint}weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}&lang=es`;
            
            fetch(url)
                .then(res => res.json())
                .then(data => mostrarClimaActual(data))
                .catch(err => console.error("Error obteniendo ubicación:", err));
        });
    } else {
        alert("Tu navegador no admite geolocalización.");
    }
}

function actualizarReloj(timezone) {
   function mostrarHora() {
        const ahora = new Date();
        const utc = ahora.getTime() + ahora.getTimezoneOffset() * 60000;
        const horaLocal = new Date(utc + (timezone * 1000));
        document.getElementById("reloj").innerText = `🕒 Hora local: ${horaLocal.toLocaleTimeString()}`;
    }
    mostrarHora(); // Muestra la hora inmediatamente
    setInterval(mostrarHora, 1000); // Actualiza cada segundo
}

function mostrarCargando() {
    climaActualDiv.innerHTML = '<p class="loading">Cargando...</p>';
}

function mostrarError(mensaje) {
    climaActualDiv.innerHTML = `<p class="error-msg">${mensaje}</p>`;
}

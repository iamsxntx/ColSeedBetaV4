document.addEventListener("DOMContentLoaded", function() {
    document.getElementById("btnMonitorear").addEventListener("click", monitorearCultivo);
});

function monitorearCultivo() {
    let resultados = document.getElementById("monitoreoResultados");
    resultados.innerHTML = "<p>🔄 Monitoreo en proceso...</p>";

    fetch("http://192.168.0.33/data") // ⚠ Reemplaza con la IP de tu ESP32
        .then(response => response.json())
        .then(data => {
            const nivelLuz = convertirLuxANivel(data.luz);
            resultados.innerHTML = construir_respuesta_html(data.temperatura, data.humedad, nivelLuz);
        })
        .catch(error => {
            resultados.innerHTML = "<p style='color:red;'>⚠ Error al obtener datos del sensor.</p>";
            console.error("Error al obtener datos:", error);
        });
}

function convertirLuxANivel(lx) {
    if (lx < 500) return "Baja";
    if (lx < 2500) return "Media";
    return "Alta";
}

function construir_respuesta_html(temp, hum, luz) {
    return `
        <div class="container">
            ${crear_card("🌡 Temperatura", temp, "°C", "temp")}
            ${crear_card("💧 Humedad", hum, "%", "hum")}
            ${crear_card("☀ Luz", luz, " lux", "luz")}
        </div>
    `;
}

function crear_card(titulo, valor, unidad, clase) {
    return `
        <div class='card ${clase}'><h2>${titulo}</h2>
        <p>${isNaN(valor) ? "Error al leer sensor" : valor + " " + unidad}</p>
        </div>
    `;
}

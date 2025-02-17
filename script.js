const socket = new WebSocket("ws://192.168.0.33:80");

socket.onopen = function() {
    console.log("Conectado al servidor WebSocket del ESP32");
    monitorearCultivo(); // Iniciar el monitoreo al conectar
};

socket.onmessage = function(event) {
    try {
        const data = JSON.parse(event.data);
        actualizarGrafico(data.temp, data.hum, data.luz);
        verificarCondiciones(data.temp, data.hum, data.luz);
    } catch (error) {
        console.error("Error al analizar los datos del WebSocket:", error);
        console.error("Datos recibidos:", event.data); // Imprime los datos para depuración
        document.getElementById("monitoreoResultados").innerHTML = "<p>Error al recibir datos. Revise la consola.</p>";
    }
};

socket.onerror = function(error) {
    console.error("Error en WebSocket: ", error);
    document.getElementById("monitoreoResultados").innerHTML = "<p>Error en la conexión WebSocket.</p>";
};

socket.onclose = function() {
    console.log("Conexión WebSocket cerrada.");
    document.getElementById("monitoreoResultados").innerHTML = "<p>Conexión cerrada. Intente reconectar.</p>";
};


const requisitosCultivos = {
    mora: { luminosidad: "6-8", humedad: "60-70", temperatura: "15-25" },
    lulo: { luminosidad: "8-10", humedad: "70-80", temperatura: "15-20" },
    frijol: { luminosidad: "6-8", humedad: "50-60", temperatura: "20-30" },
    cafe: { luminosidad: "5-7", humedad: "70-80", temperatura: "18-24" },
    maiz: { luminosidad: "10-12", humedad: "55-75", temperatura: "20-30" },
    arveja: { luminosidad: "6-8", humedad: "50-70", temperatura: "15-20" },
    yuca: { luminosidad: "8-10", humedad: "60-70", temperatura: "25-30" },
    auyama: { luminosidad: "6-8", humedad: "60-70", temperatura: "20-25" },
    papa: { luminosidad: "8-10", humedad: "70-80", temperatura: "15-20" },
    cebolla: { luminosidad: "10-12", humedad: "60-70", temperatura: "15-20" },
    tomate: { luminosidad: "8-10", humedad: "60-70", temperatura: "20-25" },
    naranjas: { luminosidad: "8-10", humedad: "50-60", temperatura: "25-30" },
};

let chart;

function analizarCultivo() {
    const cultivo = document.getElementById("cultivo").value;
    const resultadosDiv = document.getElementById("resultados");

    const requisitos = requisitosCultivos[cultivo];

    if (!requisitos) {
        resultadosDiv.innerHTML = "<p>Cultivo no encontrado.</p>";
        return;
    }

    resultadosDiv.innerHTML = `
        <h3>Requisitos para cultivar ${cultivo.charAt(0).toUpperCase() + cultivo.slice(1)}:</h3>
        <ul>
            <li><strong>Luminosidad:</strong> ${requisitos.luminosidad} horas</li>
            <li><strong>Humedad:</strong> ${requisitos.humedad}%</li>
            <li><strong>Temperatura:</strong> ${requisitos.temperatura}°C</li>
        </ul>
        <p>¡Verifica si las condiciones de tu suelo son adecuadas!</p>
    `;

    mostrarGrafico(requisitos);
}

function mostrarGrafico(requisitos) {
    const container = document.getElementById('graficoContainer');

    const oldCanvas = document.getElementById('graficoCondiciones');
    if (oldCanvas) {
        oldCanvas.remove();
    }

    const nuevoCanvas = document.createElement('canvas');
    nuevoCanvas.id = 'graficoCondiciones';
    nuevoCanvas.width = 500;
    nuevoCanvas.height = 300;
    container.appendChild(nuevoCanvas);

    const ctx = nuevoCanvas.getContext('2d');

    if (chart) {
        chart.destroy();
    }

    const extraerValores = (rango) => rango.split('-').map(Number);

    chart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Luminosidad (h)', 'Humedad (%)', 'Temperatura (°C)'],
            datasets: [
                {
                    label: 'Requisitos óptimos',
                    data: extraerValores(requisitos.luminosidad).concat(extraerValores(requisitos.humedad), extraerValores(requisitos.temperatura)),
                    backgroundColor: 'rgba(76, 175, 80, 0.8)',
                    borderColor: 'rgba(76, 175, 80, 1)',
                    borderWidth: 1
                },
                {
                    label: 'Condiciones actuales',
                    data: [0, 0, 0], // Inicializar con ceros
                    backgroundColor: 'rgba(255, 99, 132, 0.8)',
                    borderColor: 'rgba(255, 99, 132, 1)',
                    borderWidth: 1
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { position: 'top' },
                tooltip: {
                    enabled: true,
                    callbacks: {
                        label: function(tooltipItem) {
                            return `${tooltipItem.dataset.label}: ${tooltipItem.raw} ${tooltipItem.dataset.label === 'Requisitos óptimos' ? (tooltipItem.label === 'Luminosidad (h)' ? 'horas' : tooltipItem.label === 'Humedad (%)' ? '%' : '°C') : ''}`;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        color: "#000",
                        font: { size: 14 }
                    }
                },
                x: {
                    ticks: {
                        color: "#000",
                        font: { size: 14 }
                    }
                }
            }
        }
    });
}


function actualizarGrafico(temp, hum, luz) {
    if (chart) {
        const horasLuz = convertirLuxAHoras(luz);
        chart.data.datasets[1].data = [horasLuz, hum, temp];
        chart.update();
    }
}

function verificarCondiciones(temp, hum, luz) {
    const cultivo = document.getElementById("cultivo").value;
    const requisitos = requisitosCultivos[cultivo];

    if (!requisitos) return; // Salir si no se encuentra el cultivo

    let resultado = "Condiciones adecuadas ✅";

    const horasLuz = convertirLuxAHoras(luz);
    const [minLuz, maxLuz] = requisitos.luminosidad.split("-").map(Number);
    const [minHum, maxHum] = requisitos.humedad.split("-").map(Number);
    const [minTemp, maxTemp] = requisitos.temperatura.split("-").map(Number);

    if (horasLuz < minLuz || horasLuz > maxLuz) resultado = "Ajusta la luz ☀";
    if (hum < minHum || hum > maxHum) resultado = "Ajusta la humedad ";
    if (temp < minTemp || temp > maxTemp) resultado = "Ajusta la temperatura ";

    document.getElementById("monitoreoResultados").innerHTML = `<p>${resultado}</p>`;
}

function convertirLuxAHoras(lux) {
    if (lux < 200) return 4;
    if (lux < 500) return 6;
    if (lux < 1000) return 8;
    if (lux < 5000) return 10;
    return 12;
}

function monitorearCultivo() {
    document.getElementById("monitoreoResultados").innerHTML = "<p>Monitoreo en proceso...</p>";
}

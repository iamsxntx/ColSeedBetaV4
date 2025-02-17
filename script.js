function obtenerDatos() {
    fetch("http://192.168.0.33/data")  // ⚠ Reemplaza con la IP correcta del ESP32
        .then(response => response.json())
        .then(data => {
            console.log("Temperatura:", data.temperatura);
            console.log("Humedad:", data.humedad);
            console.log("Luz:", data.luz);

            // Convertir lux a un nivel cualitativo en lugar de horas
            const nivelLuz = convertirLuxANivel(data.luz);

            // Actualizar los valores en la interfaz
            document.getElementById("temperatura").textContent = `Temperatura: ${data.temperatura}°C`;
            document.getElementById("humedad").textContent = `Humedad: ${data.humedad}%`;
            document.getElementById("luz").textContent = `Luz: ${nivelLuz}`;

            // Analizar condiciones con datos reales
            analizarCultivo(data.temperatura, data.humedad, nivelLuz);
        })
        .catch(error => console.log("Error al obtener datos:", error));
}

// Conversión de lux a un nivel cualitativo de luz
function convertirLuxANivel(lx) {
    if (lx < 500) return "Baja";
    if (lx < 2500) return "Media";
    return "Alta";
}

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

function analizarCultivo(temp, hum, luz) {
    const cultivo = document.getElementById("cultivo").value;
    const resultadosDiv = document.getElementById("resultados");

    const requisitos = requisitosCultivos[cultivo];

    if (!requisitos) {
        resultadosDiv.innerHTML = `<p>Selecciona un cultivo válido.</p>`;
        return;
    }

    resultadosDiv.innerHTML = `
        <h3>Requisitos para ${cultivo}:</h3>
        <ul>
            <li><strong>Luminosidad:</strong> ${requisitos.luminosidad} horas</li>
            <li><strong>Humedad:</strong> ${requisitos.humedad}%</li>
            <li><strong>Temperatura:</strong> ${requisitos.temperatura}°C</li>
        </ul>
        <p>¡Verifica si las condiciones de tu suelo son adecuadas!</p>
    `;

    mostrarGrafico(requisitos, temp, hum, luz);
}

function mostrarGrafico(requisitos, temp, hum, luz) {
    const container = document.getElementById('graficoContainer');

    const oldCanvas = document.getElementById('graficoCondiciones');
    if (oldCanvas) {
        oldCanvas.remove();
    }

    const nuevoCanvas = document.createElement('canvas');
    nuevoCanvas.id = 'graficoCondiciones';
    container.appendChild(nuevoCanvas);

    const ctx = nuevoCanvas.getContext('2d');

    if (chart) {
        chart.destroy();
    }

    chart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Luminosidad (h)', 'Humedad (%)', 'Temperatura (°C)'],
            datasets: [
                {
                    label: 'Requisitos óptimos',
                    data: [
                        (parseFloat(requisitos.luminosidad.split('-')[0]) + parseFloat(requisitos.luminosidad.split('-')[1])) / 2,
                        (parseFloat(requisitos.humedad.split('-')[0]) + parseFloat(requisitos.humedad.split('-')[1])) / 2,
                        (parseFloat(requisitos.temperatura.split('-')[0]) + parseFloat(requisitos.temperatura.split('-')[1])) / 2
                    ],
                    backgroundColor: 'rgba(76, 175, 80, 0.8)',
                    borderColor: 'rgba(76, 175, 80, 1)',
                    borderWidth: 1
                },
                {
                    label: 'Condiciones actuales',
                    data: [luz, hum, temp],
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
                            return `${tooltipItem.dataset.label}: ${tooltipItem.raw}`;
                        }
                    }
                }
            },
            scales: {
                y: { beginAtZero: true },
                x: {}
            }
        }
    });
}

document.addEventListener("DOMContentLoaded", () => {
    obtenerDatos();
});

var socket = io("https://iafa-h9tv.onrender.com/");

// Variables globales para los valores de los sensores
let datosActuales = { temperatura: 0, humedad: 0, luz: 0 };

socket.on("actualizar_datos", function(datos) {
    // Guardamos los datos de los sensores
    datosActuales.temperatura = datos.temperatura;
    datosActuales.humedad = datos.humedad;
    datosActuales.luz = datos.luz;

    // Mostramos los datos en la web
    document.getElementById("temp").innerText = datos.temperatura;
    document.getElementById("humedad").innerText = datos.humedad;
    document.getElementById("luz").innerText = datos.luz;
});

const requisitosCultivos = {
    mora: { luminosidad: "6-8 horas", humedad: "60-70%", temperatura: "15-25°C" },
    lulo: { luminosidad: "8-10 horas", humedad: "70-80%", temperatura: "15-20°C" },
    frijol: { luminosidad: "6-8 horas", humedad: "50-60%", temperatura: "20-30°C" },
    cafe: { luminosidad: "5-7 horas", humedad: "70-80%", temperatura: "18-24°C" },
    maiz: { luminosidad: "10-12 horas", humedad: "55-75%", temperatura: "20-30°C" },
    arveja: { luminosidad: "6-8 horas", humedad: "50-70%", temperatura: "15-20°C" },
    yuca: { luminosidad: "8-10 horas", humedad: "60-70%", temperatura: "25-30°C" },
    auyama: { luminosidad: "6-8 horas", humedad: "60-70%", temperatura: "20-25°C" },
    papa: { luminosidad: "8-10 horas", humedad: "70-80%", temperatura: "15-20°C" },
    cebolla: { luminosidad: "10-12 horas", humedad: "60-70%", temperatura: "15-20°C" },
    tomate: { luminosidad: "8-10 horas", humedad: "60-70%", temperatura: "20-25°C" },
    naranjas: { luminosidad: "8-10 horas", humedad: "50-60%", temperatura: "25-30°C" },
};

let chart;

function analizarCultivo() {
    const cultivo = document.getElementById("cultivo").value;
    const resultadosDiv = document.getElementById("resultados");

    const requisitos = requisitosCultivos[cultivo];

    resultadosDiv.innerHTML = `
        <h3>Requisitos para cultivar ${cultivo.charAt(0).toUpperCase() + cultivo.slice(1)}:</h3>
        <ul>
            <li><strong>Luminosidad:</strong> ${requisitos.luminosidad}</li>
            <li><strong>Humedad:</strong> ${requisitos.humedad}</li>
            <li><strong>Temperatura:</strong> ${requisitos.temperatura}</li>
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
    container.appendChild(nuevoCanvas);

    const ctx = nuevoCanvas.getContext('2d');

    if (chart) {
        chart.destroy();
    }

    // Convertir luminosidad de "X-Y horas" a un número
    const luminosidadOptima = parseFloat(requisitos.luminosidad.split('-')[0]);
    const humedadOptima = parseFloat(requisitos.humedad.split('-')[0]);
    const temperaturaOptima = parseFloat(requisitos.temperatura.split('-')[0]);

    // Conversión de lux a horas aproximadas de luz
    let horasLuz = datosActuales.luz / 100; 

    chart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Luminosidad (h)', 'Humedad (%)', 'Temperatura (°C)'],
            datasets: [
                {
                    label: 'Requisitos óptimos',
                    data: [luminosidadOptima, humedadOptima, temperaturaOptima],
                    backgroundColor: 'rgba(76, 175, 80, 0.8)',
                    borderColor: 'rgba(76, 175, 80, 1)',
                    borderWidth: 1
                },
                {
                    label: 'Condiciones actuales',
                    data: [horasLuz, datosActuales.humedad, datosActuales.temperatura], 
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
                legend: { position: 'top' }
            },
            scales: {
                y: { beginAtZero: true }
            }
        }
    });
}

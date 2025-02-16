const requisitosCultivos = {
    mora: {
        luminosidad: "6-8 horas",
        humedad: "60-70%",
        temperatura: "15-25°C"
    },
    lulo: {
        luminosidad: "8-10 horas",
        humedad: "70-80%",
        temperatura: "15-20°C"
    },
    frijol: {
        luminosidad: "6-8 horas",
        humedad: "50-60%",
        temperatura: "20-30°C"
    },
    cafe: {
        luminosidad: "5-7 horas",
        humedad: "70-80%",
        temperatura: "18-24°C"
    },
    maiz: {
        luminosidad: "10-12 horas",
        humedad: "55-75%",
        temperatura: "20-30°C"
    },
    arveja: {
        luminosidad: "6-8 horas",
        humedad: "50-70%",
        temperatura: "15-20°C"
    },
    yuca: {
        luminosidad: "8-10 horas",
        humedad: "60-70%",
        temperatura: "25-30°C"
    },
    auyama: {
        luminosidad: "6-8 horas",
        humedad: "60-70%",
        temperatura: "20-25°C"
    },
    papa: {
        luminosidad: "8-10 horas",
        humedad: "70-80%",
        temperatura: "15-20°C"
    },
    cebolla: {
        luminosidad: "10-12 horas",
        humedad: "60-70%",
        temperatura: "15-20°C"
    },
    tomate: {
        luminosidad: "8-10 horas",
        humedad: "60-70%",
        temperatura: "20-25°C"
    },
    naranjas: {
        luminosidad: "8-10 horas",
        humedad: "50-60%",
        temperatura: "25-30°C"
    },
};

let chart; // Variable global para la instancia del gráfico

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
    const ctx = document.getElementById('graficoCondiciones').getContext('2d');

    // Destruye la instancia anterior del gráfico si existe
    if (chart) {
        chart.destroy();
    }

    chart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Luminosidad (h)', 'Humedad (%)', 'Temperatura (°C)'],
            datasets: [{
                label: 'Requisitos óptimos',
                data: [
                    parseFloat(requisitos.luminosidad.split('-')[0]),
                    parseFloat(requisitos.humedad.split('-')[0]),
                    parseFloat(requisitos.temperatura.split('-')[0])
                ],
                backgroundColor: 'rgba(76, 175, 80, 0.8)',
                borderColor: 'rgba(76, 175, 80, 1)',
                borderWidth: 1
            },
            {
                label: 'Condiciones actuales',
                data: [9, 60, 21], // Datos de ejemplo (¡debes obtener los datos reales!)
                backgroundColor: 'rgba(255, 99, 132, 0.8)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top'
                },
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
                y: {
                    beginAtZero: true,
                    ticks: {
                        color: "#000",
                        font: {
                            size: 14
                        }
                    }
                },
                x: {
                    ticks: {
                        color: "#000",
                        font: {
                            size: 14
                        }
                    }
                }
            }
        }
    });
}

function monitorearCultivo() {
    document.getElementById("monitoreoResultados").innerHTML = "<p>Monitoreo en proceso...</p>";
}

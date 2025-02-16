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

let chart; // Variable para almacenar la instancia del gráfico

function analizarCultivo() {
    const cultivo = document.getElementById("cultivo").value;
    const resultadosDiv = document.getElementById("resultados");

    const requisitos = requisitosCultivos[cultivo];

    if (!requisitos) {
        resultadosDiv.innerHTML = "<p>No se encontraron requisitos para ese cultivo.</p>";
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
    const ctx = document.getElementById('graficoCondiciones').getContext('2d');

    // Destruir el gráfico anterior si existe para evitar superposición
    if (chart) {
        chart.destroy();
    }

    const data = {
        labels: ['Luminosidad', 'Humedad', 'Temperatura'],
        datasets: [{
            label: 'Requisitos óptimos',
            data: Object.values(requisitos).map(valor => {
                const [min, max] = valor.split('-').map(Number);
                return (min + max) / 2; // Calcular el promedio para el gráfico
            }),
            backgroundColor: 'rgba(76, 175, 80, 0.8)',
            borderColor: 'rgba(76, 175, 80, 1)',
            borderWidth: 1
        },
        {
            label: 'Condiciones actuales',
            data: [7, 65, 22], // Simulación de datos actuales. ¡Reemplaza con datos reales!
            backgroundColor: 'rgba(255, 99, 132, 0.8)',
            borderColor: 'rgba(255, 99, 132, 1)',
            borderWidth: 1
        }]
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            y: {
                beginAtZero: true
            }
        }
    };

    chart = new Chart(ctx, {
        type: 'bar',
        data: data,
        options: options
    });
}


function monitorearCultivo() {
    document.getElementById("monitoreoResultados").innerHTML = "<p>Monitoreo en proceso...</p>";
    // Aquí deberías agregar la lógica para el monitoreo real del cultivo
}

// =========================
// ELEMENTS
// =========================
const phEl = document.getElementById("ph");
const turbEl = document.getElementById("turbidity");
const tempEl = document.getElementById("temp");
const tdsEl = document.getElementById("tds");

const phCard = document.getElementById("phCard");
const turbCard = document.getElementById("turbCard");
const tempCard = document.getElementById("tempCard");
const tdsCard = document.getElementById("tdsCard");

const alertBox = document.getElementById("alertBox");
const alertMsg = document.getElementById("alertMsg");

// =========================
// CARD COLOR LOGIC
// =========================
function setCardColor(card, value, safeMin, safeMax) {
    if (value < safeMin || value > safeMax) {
        card.style.background = "#ffe5e5";
        card.style.border = "2px solid #ff0000";
    } else {
        card.style.background = "white";
        card.style.border = "2px solid #4CAF50";
    }
}

function showAlert(message) {
    alertMsg.textContent = message;
    alertBox.classList.remove("hidden");
    setTimeout(() => alertBox.classList.add("hidden"), 3000);
}

// =========================
// CHART INITIALIZATION
// =========================
let labels = [];
let phData = [];
let turbData = [];
let tempData = [];
let tdsData = [];

const ctx = document.getElementById("chart").getContext("2d");

const chart = new Chart(ctx, {
    type: "line",
    data: {
        labels: labels,
        datasets: [
            { 
                label: "pH Level (Fountain #1)",
                data: phData,
                borderWidth: 2,
                borderColor: "#005bff",
                tension: 0.3
            },
            { 
                label: "Turbidity NTU (Fountain #1)",
                data: turbData,
                borderWidth: 2,
                borderColor: "#ff4d4d",
                tension: 0.3
            },
            { 
                label: "Temperature °C (Fountain #1)",
                data: tempData,
                borderWidth: 2,
                borderColor: "#ffa200",
                tension: 0.3
            },
            { 
                label: "TDS ppm (Fountain #1)",
                data: tdsData,
                borderWidth: 2,
                borderColor: "#008f39",
                tension: 0.3
            }
        ]
    },
    options: {
        animation: false,
        responsive: true,
        plugins: {
            legend: {
                position: "top",
                labels: {
                    boxWidth: 15,
                    padding: 15,
                    font: { size: 13 }
                }
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                title: { display: true, text: "Value" }
            },
            x: {
                title: { display: true, text: "Time (1-second intervals)" }
            }
        }
    }
});

// =========================
// FETCH DATA FROM FLASK API
// =========================
async function fetchData() {
    const res = await fetch("/latest");
    const data = await res.json();

    // Update live values
    phEl.textContent = data.ph;
    turbEl.textContent = data.turbidity;
    tempEl.textContent = data.temperature;
    tdsEl.textContent = data.tds;

    // Update card colors
    setCardColor(phCard, data.ph, 6.5, 8.5);
    setCardColor(turbCard, data.turbidity, 0, 50);
    setCardColor(tempCard, data.temperature, 10, 40);
    setCardColor(tdsCard, data.tds, 0, 500);

    // Update chart data
    const timestamp = new Date().toLocaleTimeString();
    labels.push(timestamp);
    phData.push(data.ph);
    turbData.push(data.turbidity);
    tempData.push(data.temperature);
    tdsData.push(data.tds);

    chart.update();
}

// Fetch every 1 second
setInterval(fetchData, 1000);

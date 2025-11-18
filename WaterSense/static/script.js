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

function setCardColor(card, value, safeMin, safeMax) {
  if (value < safeMin || value > safeMax) {
    card.style.background = "#ffcccc";
    card.style.border = "2px solid #e60000";
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

const ctx = document.getElementById("chart").getContext("2d");
const chart = new Chart(ctx, {
  type: "line",
  data: {
    labels: [],
    datasets: [
      { label: "pH", data: [], borderWidth: 2 },
      { label: "Turbidity", data: [], borderWidth: 2 },
      { label: "Temp", data: [], borderWidth: 2 },
      { label: "TDS", data: [], borderWidth: 2 }
    ]
  },
  options: {
    responsive: true,
    animation: false,
    scales: { x: { display: true } }
  }
});

function fetchData() {
  fetch("/data")
    .then(r => r.json())
    .then(d => {
      phEl.textContent = d.ph ?? "--";
      turbEl.textContent = d.turbidity ?? "--";
      tempEl.textContent = d.temperature ?? "--";
      tdsEl.textContent = d.tds ?? "--";

      const ph = parseFloat(d.ph);
      const turb = parseFloat(d.turbidity);
      const temp = parseFloat(d.temperature);
      const tds = parseFloat(d.tds);

      setCardColor(phCard, ph, 6.5, 8.5);
      setCardColor(turbCard, turb, 0, 30);
      setCardColor(tempCard, temp, 15, 30);
      setCardColor(tdsCard, tds, 80, 400);

      if (ph < 6.5 || ph > 8.5) showAlert("Abnormal pH detected!");
      if (turb > 30) showAlert("High Turbidity detected!");
      if (tds > 400) showAlert("High TDS detected!");

      const t = new Date().toLocaleTimeString();
      chart.data.labels.push(t);

      chart.data.datasets[0].data.push(ph);
      chart.data.datasets[1].data.push(turb);
      chart.data.datasets[2].data.push(temp);
      chart.data.datasets[3].data.push(tds);

      if (chart.data.labels.length > 30) {
        chart.data.labels.shift();
        chart.data.datasets.forEach(ds => ds.data.shift());
      }

      chart.update();
    });
}

setInterval(fetchData, 1000);

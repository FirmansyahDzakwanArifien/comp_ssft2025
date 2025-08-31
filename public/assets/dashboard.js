// Data dummy untuk visualisasi (misalnya hasil AI/Firebase)
const dummyData = [
  { time: "2025-08-29 09:55", category: "Food Waste" },
  { time: "2025-08-29 10:00", category: "Recycle" },
  { time: "2025-08-29 10:05", category: "B3" },
  { time: "2025-08-29 10:10", category: "Food Waste" },
  { time: "2025-08-29 10:15", category: "Recycle" },
  { time: "2025-08-29 10:20", category: "Food Waste" },
  { time: "2025-08-29 10:25", category: "Food Waste" },
];

// --- Latest Prediction ---
document.getElementById("latestPrediction").innerText = dummyData[dummyData.length - 1].category;

// --- Prediction History Table ---
const historyTable = document.getElementById("historyTable");
historyTable.innerHTML = ""; // kosongkan isi default
dummyData.slice().reverse().forEach(entry => {
  let row = `<tr>
    <td class="p-3">${entry.time}</td>
    <td class="p-3 font-semibold">${entry.category}</td>
  </tr>`;
  historyTable.innerHTML += row;
});

// --- Hitung Analytics ---
const categoryCounts = { "B3": 0, "Recycle": 0, "Food Waste": 0 };
dummyData.forEach(entry => {
  if (categoryCounts[entry.category] !== undefined) {
    categoryCounts[entry.category]++;
  }
});

// --- Pie Chart (komposisi %) ---
const ctxPie = document.getElementById("pieChart").getContext("2d");
new Chart(ctxPie, {
  type: "pie",
  data: {
    labels: ["B3", "Recycle", "Food Waste"],
    datasets: [{
      data: [
        categoryCounts["B3"],
        categoryCounts["Recycle"],
        categoryCounts["Food Waste"]
      ],
      backgroundColor: ["#F87171", "#4ADE80", "#FACC15"],
      borderWidth: 2
    }]
  },
  options: {
    responsive: true,
    plugins: {
      tooltip: {
        callbacks: {
          label: ctx => `${ctx.label}: ${ctx.parsed} item`
        }
      }
    }
  }
});

// --- Line Chart (frekuensi berdasarkan waktu) ---
const timeLabels = dummyData.map(d => d.time);
const countsByTime = dummyData.map((_, i) => i + 1); // sekadar frekuensi kumulatif

const ctxLine = document.getElementById("lineChart").getContext("2d");
new Chart(ctxLine, {
  type: "line",
  data: {
    labels: timeLabels,
    datasets: [{
      label: "Total Sampah Terdeteksi",
      data: countsByTime,
      fill: false,
      borderColor: "#22c55e",
      backgroundColor: "#22c55e",
      tension: 0.3,
      pointRadius: 5,
      pointHoverRadius: 7
    }]
  },
  options: {
    responsive: true,
    plugins: {
      tooltip: { mode: "index", intersect: false }
    },
    scales: {
      y: { beginAtZero: true, ticks: { stepSize: 1 } }
    }
  }
});

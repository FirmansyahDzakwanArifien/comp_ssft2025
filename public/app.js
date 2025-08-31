// Firebase SDK Config
const firebaseConfig = {
  apiKey: "YOUR-API-KEY",
  authDomain: "YOUR-PROJECT.firebaseapp.com",
  projectId: "YOUR-PROJECT",
};

// Init Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// DOM Elements
const predictionBox = document.getElementById("predictionBox");
const historyTable = document.querySelector("#historyTable tbody");

// Chart.js setup
const ctx = document.getElementById("chart").getContext("2d");
let chart = new Chart(ctx, {
  type: "doughnut",
  data: {
    labels: ["Plastic", "Organic", "Paper", "Metal", "Other"],
    datasets: [{
      data: [0, 0, 0, 0, 0],
      backgroundColor: ["#27ae60","#f39c12","#2980b9","#8e44ad","#95a5a6"]
    }]
  }
});

// Firestore Listener
db.collection("predictions").orderBy("time", "desc").limit(10)
  .onSnapshot(snapshot => {
    historyTable.innerHTML = "";
    let counts = {Plastic:0, Organic:0, Paper:0, Metal:0, Other:0};

    snapshot.forEach(doc => {
      let d = doc.data();
      let row = `<tr>
        <td>${new Date(d.time.toDate()).toLocaleString()}</td>
        <td>${d.category}</td>
      </tr>`;
      historyTable.innerHTML += row;

      // Update latest prediction
      predictionBox.innerText = d.category;

      // Count for chart
      if (counts[d.category] !== undefined) counts[d.category]++;
    });

    chart.data.datasets[0].data = Object.values(counts);
    chart.update();
  });

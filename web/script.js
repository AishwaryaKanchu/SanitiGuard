
console.log("SCRIPT LOADED");



// Fetch risk_output.csv
fetch("./data/risk_output.csv")
  .then(response => {
    if (!response.ok) throw new Error("Network response not ok");
    return response.text();
  })
  .then(data => {
    console.log("risk_output loaded");
    console.log(data); // optional: see CSV content
  })
  .catch(err => console.error(err));

// Fetch health_alerts.csv
fetch("./data/health_alerts.csv")
  .then(response => {
    if (!response.ok) throw new Error("Network response not ok");
    return response.text();
  })
  .then(data => {
    console.log("health_alerts loaded");
    console.log(data); // optional
  })
  .catch(err => console.error(err));

// Fetch public_awareness.csv
fetch("./data/public_awareness.csv")
  .then(response => {
    if (!response.ok) throw new Error("Network response not ok");
    return response.text();
  })
  .then(data => {
    console.log("public_awareness loaded");
    console.log(data); // optional
  })
  .catch(err => console.error(err));


let map;

 


// ---------- INIT ----------
document.addEventListener("DOMContentLoaded", () => {
  initMap();
  loadRiskData();
  loadHealthAlerts();
  loadPublicAwareness();
  updateTimestamp();
});

// ---------- MAP ----------
function initMap() {
  map = L.map("map").setView([17.385, 78.486], 12);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "© OpenStreetMap"
  }).addTo(map);
}

// ---------- CSV HELPER ----------
async function loadCSV(path) {
  const res = await fetch(path);
  const text = await res.text();
  const rows = text.trim().split("\n");
  const headers = rows[0].split(",");

  return rows.slice(1).map(row => {
    const values = row.split(",");
    let obj = {};
    headers.forEach((h, i) => obj[h.trim()] = values[i]?.trim());
    return obj;
  });
}

// ---------- RISK ZONES ----------
async function loadRiskData() {
  const data = await loadCSV("./data/risk_output.csv");

  const taskList = document.getElementById("tasks");
  const taskSelect = document.getElementById("taskSelect");
  const riskZones = document.getElementById("riskZones");

  data.forEach(row => {
    const lat = parseFloat(row.lat);
    const lng = parseFloat(row.lng);
    const area = row.area;
    const risk = row.risk_level;

    if (isNaN(lat) || isNaN(lng)) return;

    let color = risk === "HIGH" ? "red" :
                risk === "MEDIUM" ? "orange" : "green";

    // Marker
    L.circleMarker([lat, lng], {
      radius: 8,
      color
    }).addTo(map)
      .bindPopup(`<b>${area}</b><br>Risk: ${risk}`);

    // Risk Zone Card
    const card = document.createElement("div");
    card.style.borderLeft = `6px solid ${color}`;
    card.style.padding = "8px";
    card.style.margin = "8px 0";
    card.innerHTML = `<b>${area}</b><br>Risk: ${risk}`;
    riskZones.appendChild(card);

    // Task dropdown
    const opt = document.createElement("option");
    opt.value = area;
    opt.textContent = area;
    taskSelect.appendChild(opt);

    // Cleaning task
    if (risk === "HIGH") {
      const li = document.createElement("li");
      li.textContent = `${area} — Immediate cleaning required`;
      taskList.appendChild(li);
    }
  });
}

// ---------- HEALTH ALERTS ----------
async function loadHealthAlerts() {
  const data = await loadCSV("./data/health_alerts.csv");
  const list = document.getElementById("alerts");

  data.forEach(row => {
    const li = document.createElement("li");
    li.innerHTML = `<b>${row.area}</b>: ${row.risk_level}<br>
                    Diseases: ${row.possible_diseases}`;
    list.appendChild(li);
  });
}

// ---------- PUBLIC AWARENESS ----------
async function loadPublicAwareness() {
  const data = await loadCSV("./data/public_awareness.csv");
  const list = document.getElementById("publicAwareness");

  data.forEach(row => {
    const li = document.createElement("li");
    li.innerHTML = `<b>${row.zone}</b>: ${row.message} (${row.priority})`;
    list.appendChild(li);
  });
}

// ---------- UPLOAD ----------
function uploadProof() {
  const task = document.getElementById("taskSelect").value;
  const file = document.getElementById("photoInput").files[0];

  if (!task || !file) {
    alert("Select task and upload photo");
    return;
  }

  document.getElementById("uploadStatus").innerText =
    `✅ ${task} marked as completed`;
}

// ---------- TIMESTAMP ----------
function updateTimestamp() {
  document.getElementById("last-updated").innerText =
    "Last updated: " + new Date().toLocaleString();
}

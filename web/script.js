let map;


document.addEventListener("DOMContentLoaded", () => {
  loadRiskData();
  loadHealthAlerts();
  loadPublicAwareness();
  loadTaskVerification();
});

// ===== DATA LOADERS =====

function loadRiskData() {
  fetch("../data/risk_output.csv")
    .then(res => res.text())
    .then(data => {
      // parse CSV & use for markers
    });
}

function loadHealthAlerts() {
  fetch("../data/health_alerts.csv")
    .then(res => res.text())
    .then(data => {
      // show health alerts
    });
}

function loadPublicAwareness() {
  fetch("../data/public_awareness.csv")
    .then(res => res.text())
    .then(data => {
      // show awareness messages
    });
}

function loadTaskVerification() {
  fetch("../data/task_verification.csv")
    .then(res => res.text())
    .then(data => {
      // dropdown & task status
    });
}


// ------------------ CSV LOADER ------------------
async function loadCSV(file) {
    const response = await fetch(file);
    const text = await response.text();

    // Split by newline or "Zone" if CSV is one line
    const rows = text.includes("\n")
        ? text.trim().split("\n").slice(1)
        : text.trim().split(/(?=Zone \d)/);

    return rows.map(r => r.split(",").map(p => p.trim()));
}

// ------------------ PUBLIC AWARENESS (Step 6) ------------------
function notifyPublic(location, riskLevel) {
    const list = document.getElementById("publicAlerts");
    if (riskLevel === "HIGH" || riskLevel === "MEDIUM") {
        const li = document.createElement("li");
        li.innerText = `${location}: ${riskLevel} risk`;
        list.appendChild(li);
        // Optional: alert popup
        // alert(`⚠️ ${location} has ${riskLevel} risk!`);
    }
}

// ------------------ INIT MAP ------------------
function initMap() {
    map = new google.maps.Map(document.getElementById("map"), {
        center: { lat: 17.385, lng: 78.486 },
        zoom: 12
    });

    loadData();
}
  




// ------------------ LOAD & PROCESS DATA ------------------
async function loadData() {
    const data = await loadCSV("../data/risk_output.csv"); // Update CSV path

    const cleaningList = document.getElementById("tasks");
    const alertList = document.getElementById("alerts");

    data.forEach(row => {
        const location = row[0];
        const lat = parseFloat(row[1]);
        const lng = parseFloat(row[2]);
        const riskLevel = row[11].trim().toUpperCase(); // HIGH / MEDIUM / LOW

        if (isNaN(lat) || isNaN(lng)) return;

        // ---------- TASK DROPDOWN ----------
        const option = document.createElement("option");
        option.value = location;
        option.text = location;
        document.getElementById("taskSelect").appendChild(option);

        // ---------- MAP MARKERS ----------
        /*let iconColor;
        if (riskLevel === "HIGH") iconColor = "red";
        else if (riskLevel === "MEDIUM") iconColor = "yellow";
        else iconColor = "green";

        const marker = new google.maps.Marker({
            position: { lat, lng },
            map: map,
            title: `${location} - ${riskLevel} RISK`,
            icon: `http://maps.google.com/mapfiles/ms/icons/${iconColor}-dot.png`
        });

        const info = new google.maps.InfoWindow({
            content: `<b>${location}</b><br>Risk: ${riskLevel}`
        });
        marker.addListener("click", () => info.open(map, marker));
        */
        function renderRiskZone(location, riskLevel) {
  const container = document.getElementById("riskZones");

  let color;
  if (riskLevel === "HIGH") color = "red";
  else if (riskLevel === "MEDIUM") color = "orange";
  else color = "green";

  const card = document.createElement("div");
  card.style.borderLeft = `6px solid ${color}`;
  card.style.padding = "10px";
  card.style.margin = "10px 0";
  card.style.background = "#f9f9f9";

  card.innerHTML = `
    <b>${location}</b><br>
    Risk Level: <span style="color:${color}">${riskLevel}</span>
  `;

  container.appendChild(card);
}
renderRiskZone(location, riskLevel);


        
        // ---------- CLEANING TASKS ----------
        if (riskLevel === "HIGH") {
            const li = document.createElement("li");
            li.classList.add(riskLevel.toLowerCase());
            const checkbox = document.createElement("input");
            checkbox.type = "checkbox";

            checkbox.addEventListener("change", () => {
                if (checkbox.checked) {
                    li.classList.add("completed");
                    li.innerText = `${location} ✅`;
                } else {
                    li.classList.remove("completed");
                    li.innerText = `${location} — Immediate drain cleaning required`;
                    li.prepend(checkbox);
                }
            });

            li.appendChild(checkbox);
            li.append(` ${location} — Immediate drain cleaning required`);
            cleaningList.appendChild(li);
        }

        // ---------- HEALTH ALERTS (Step 4) ----------
        if (riskLevel === "HIGH") {
            const li = document.createElement("li");
            li.innerText = `${location}: High risk of water-borne diseases`;
            alertList.appendChild(li);
        }


        // -------- LOAD HEALTH ALERTS ----------
async function loadHealthAlerts() {
  const response = await fetch("../data/health_alerts.csv");
  const text = await response.text();

  const rows = text.trim().split("\n").slice(1);
  const list = document.getElementById("healtAlerts");

  list.innerHTML = "";

  rows.forEach(row => {
    const cols = row.split(",");
    const area = cols[1];
    const risk = cols[4];
    const diseases = cols[5].replaceAll('"', '');

    const li = document.createElement("li");
    li.innerHTML = `
      <strong>${area}</strong>:
      <span style="color:red">${risk} risk</span><br>
      Diseases: ${diseases}
    `;

    list.appendChild(li);
  });
}

// Call on page load
loadHealthAlerts();


        // ---------- PUBLIC AWARENESS (Step 6) ----------
        notifyPublic(location, riskLevel);
    });

    updateTimestamp();
}


// -------- LOAD PUBLIC AWARENESS ----------
async function loadPublicAwareness() {
  const response = await fetch("../data/public_awareness.csv");
  const text = await response.text();

  const rows = text.trim().split("\n").slice(1);
  const list = document.getElementById("publicAwareness");

  list.innerHTML = "";

  rows.forEach(row => {
    const [zone, message, priority] = row.split(",");

    const li = document.createElement("li");
    li.innerHTML = `
      <strong>${zone}</strong>:
      ${message.replaceAll('"', '')}
      <span style="color:${priority === "HIGH" ? "red" : "orange"}">
        (${priority})
      </span>
    `;

    list.appendChild(li);
  });
}

loadPublicAwareness();

// ------------------ PUBLIC AWARENESS ------------------
function notifyPublic(location, riskLevel) {
  const list = document.getElementById("publicAwareness");

  if (!list) return;

  let message = "";
  let color = "";

  if (riskLevel === "HIGH") {
    message = `⚠️ ${location}: HIGH risk of water-borne diseases. Avoid stagnant water and take precautions.`;
    color = "red";
  } else if (riskLevel === "MEDIUM") {
    message = `⚠️ ${location}: MEDIUM risk. Maintain hygiene and stay cautious.`;
    color = "orange";
  }

  const li = document.createElement("li");
  li.style.color = color;
  li.textContent = message;

  list.appendChild(li);
}



// ------------------ TIMESTAMP ------------------
function updateTimestamp() {
    const now = new Date();
    document.getElementById("last-updated").innerText =
        `Last updated: ${now.toLocaleString()}`;
}

// ------------------ UPLOAD PROOF ------------------
function uploadProof() {
    const file = document.getElementById("photoInput").files[0];
    const task = document.getElementById("taskSelect").value;
    const status = document.getElementById("uploadStatus");

    if (!file || !task) {
        status.innerText = "❌ Select task and photo";
        return;
    }

    // Simulated upload success
    status.innerText = "✅ Photo uploaded successfully";

    // Mark task as completed visually
    const tasks = document.querySelectorAll("#tasks li");
    tasks.forEach(li => {
        if (li.innerText.includes(task)) {
            li.innerText = `${task} ✅ VERIFIED`;
            li.classList.add("completed");
        }
    });

    alert(`Task "${task}" marked as COMPLETED`);
}

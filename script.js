let map;
function initMap() {
  const cityCenter = { lat: 17.385044, lng: 78.486671 }; // Hyderabad example

  const map = new google.maps.Map(document.getElementById("map"), {
    zoom: 12,
    center: cityCenter,
  });

  // Simulated sanitation monitoring data (NO SENSORS)
  const sanitationData = [
    {
      location: { lat: 17.392, lng: 78.477 },
      risk: "High",
      reason: "Heavy rainfall + repeated complaints"
    },
    {
      location: { lat: 17.375, lng: 78.489 },
      risk: "Medium",
      reason: "Moderate rainfall, poor drainage"
    },
    {
      location: { lat: 17.401, lng: 78.512 },
      risk: "Low",
      reason: "Normal conditions"
    }
  ];

  sanitationData.forEach(point => {
    let color;

    if (point.risk === "High") color = "red";
    else if (point.risk === "Medium") color = "orange";
    else color = "green";

    const marker = new google.maps.Marker({
      position: point.location,
      map: map,
      icon: `http://maps.google.com/mapfiles/ms/icons/${color}-dot.png`
    });

    const infoWindow = new google.maps.InfoWindow({
      content: `<b>Risk Level:</b> ${point.risk}<br><b>Reason:</b> ${point.reason}`
    });

    marker.addListener("click", () => {
      infoWindow.open(map, marker);
    });
  });
}

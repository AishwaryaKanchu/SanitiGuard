import pandas as pd
from datetime import datetime

# Load AI risk data
risk_data = pd.read_csv("data/risk_output.csv")

alerts = []

for _, row in risk_data.iterrows():
    if row["risk_level"] == "HIGH":
        alert = {
            "alert_id": f"HEALTH-{row['area']}",
            "area": row["area"],
            "latitude": row["lat"],
            "longitude": row["lng"],
            "risk_level": "HIGH",
            "possible_diseases": "Dengue, Malaria, Diarrhea",
            "recommended_action": "Increase medical readiness, fogging, awareness camps",
            "issued_on": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        }
        alerts.append(alert)

alerts_df = pd.DataFrame(alerts)
alerts_df.to_csv("../data/health_alerts.csv", index=False)

print("🚑 Healthcare preparedness alerts generated:")
print(alerts_df)

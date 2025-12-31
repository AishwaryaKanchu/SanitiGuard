import pandas as pd
from sklearn.preprocessing import LabelEncoder
from sklearn.ensemble import RandomForestClassifier

# Load data
data = pd.read_csv("data/sanitation_data.csv")

# Encode population density
le = LabelEncoder()
data["population_density"] = le.fit_transform(data["population_density"])

# Features used for prediction
features = [
    "rainfall_mm",
    "complaints",
    "water_logging",
    "waste_overflow",
    "past_outbreak",
    "population_density"
]

X = data[features]

# Target: sanitation health risk (simulated for hackathon)
# Rule-based generation ONLY for training
data["risk_label"] = (
    (data["rainfall_mm"] > 80) &
    (data["water_logging"] == 1) &
    (data["waste_overflow"] == 1)
).astype(int)

y = data["risk_label"]

# Train model
model = RandomForestClassifier(n_estimators=100, random_state=42)
model.fit(X, y)

# Predict risk probability
data["risk_score"] = model.predict_proba(X)[:, 1]

# Convert score to risk level
def risk_level(score):
    if score > 0.7:
        return "HIGH"
    elif score > 0.4:
        return "MEDIUM"
    else:
        return "LOW"

data["risk_level"] = data["risk_score"].apply(risk_level)

# Save output
data.to_csv("data/risk_output.csv", index=False)

print("✅ Risk prediction completed.")
print(data[["area", "risk_score", "risk_level"]])

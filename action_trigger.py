import pandas as pd
from datetime import datetime, timedelta

# Load AI risk output
risk_data = pd.read_csv("data/risk_output.csv")

tasks = []

for _, row in risk_data.iterrows():
    if row["risk_level"] == "HIGH":
        task = {
            "task_id": f"TASK-{row['area']}-{datetime.now().strftime('%H%M%S')}",
            "area": row["area"],
            "latitude": row["lat"],
            "longitude": row["lng"],
            "task_type": "Drain Cleaning",
            "priority": "URGENT",
            "status": "ASSIGNED",
            "created_on": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            "deadline": (datetime.now() + timedelta(hours=24)).strftime("%Y-%m-%d %H:%M:%S")
        }
        tasks.append(task)

# Save tasks
tasks_df = pd.DataFrame(tasks)
tasks_df.to_csv("data/cleaning_tasks.csv", index=False)

print("✅ Automatic cleaning tasks generated:")
print(tasks_df)

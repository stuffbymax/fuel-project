import pandas as pd

# Load CSV
df = pd.read_csv("bradford.csv")

print("Original columns loaded:", len(df.columns))

# Clean column names
df.columns = df.columns.str.strip()

# Convert coordinates
df["forecourts.location.latitude"] = pd.to_numeric(
    df["forecourts.location.latitude"],
    errors="coerce"
)

df["forecourts.location.longitude"] = pd.to_numeric(
    df["forecourts.location.longitude"],
    errors="coerce"
)

# -----------------------------
# Auto-detect ALL fuel columns
# -----------------------------
fuel_cols = [
    col for col in df.columns
    if col.startswith("forecourts.fuel_price.")
]

# Convert all fuel columns to numeric
for col in fuel_cols:
    df[col] = pd.to_numeric(df[col], errors="coerce")

# -----------------------------
# Convert text columns
# -----------------------------
text_columns = [
    "forecourts.location.city",
    "forecourts.location.postcode",
    "forecourts.location.county",
    "forecourts.location.country"
]

for col in text_columns:
    df[col] = df[col].astype(str)

# -----------------------------
# Filter bradford only
# -----------------------------
bradford_df = df[
    df["forecourts.location.city"]
    .str.upper()
    .str.contains("BRADFORD", na=False)
]

# -----------------------------
# Select base + fuel columns
# -----------------------------
base_cols = [
    "forecourts.location.latitude",
    "forecourts.location.longitude",
    "forecourts.location.city",
    "forecourts.location.postcode",
    "forecourts.location.county",
    "forecourts.location.country"
]

all_cols = base_cols + fuel_cols

coordinates = bradford_df[all_cols]

# -----------------------------
# Clean data
# -----------------------------
coordinates = coordinates.drop_duplicates()

coordinates = coordinates.dropna(
    subset=[
        "forecourts.location.latitude",
        "forecourts.location.longitude"
    ]
)

# -----------------------------
# Export
# -----------------------------
output_file = "bradford_coordinates.csv"
coordinates.to_csv(output_file, index=False)

print(f"{output_file} created successfully!")
print(f"Included fuel columns: {fuel_cols}")
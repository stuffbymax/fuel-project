'''
name: Fuel Price Pipeline
description: Single entry point that runs all processing steps:
             1. Load updated_data.csv and export columns.txt + brands.txt
             2. Split by postcode into city CSVs (halifax.csv, bradford.csv, ...)
             3. Extract coordinates + fuel prices into *_coordinates.csv files
             4. Write html/js/last_updated.js with the latest CSV mod time
author: MartinP
date: 2024-06-01
license: MIT
'''

import io
import os
import re
from datetime import datetime, timezone

import pandas as pd


# ---------------------------------------------------------------------------
# Config — add more cities here without touching any other code
# ---------------------------------------------------------------------------
CITIES = [
    {"name": "halifax",  "postcode_pattern": r"HX\d{1,2}", "city_filter": "HALIFAX"},
    {"name": "bradford", "postcode_pattern": r"BD\d{1,2}", "city_filter": "BRADFORD"},
    
]

SOURCE_CSV   = "updated_data.csv"
LAST_UPDATED_PATH = os.path.join("html", "js", "last_updated.js")


# ---------------------------------------------------------------------------
# Step 1 — load source data and write info files
# ---------------------------------------------------------------------------
def load_and_describe(source: str) -> pd.DataFrame:
    print(f"[1/4] Loading {source} ...")
    df = pd.read_csv(source)

    buffer = io.StringIO()
    df.info(buf=buffer)
    with open("columns.txt", "w") as f:
        f.write(buffer.getvalue())

    brand_names = df["forecourts.brand_name"].unique()
    with open("brands.txt", "w") as f:
        for name in brand_names:
            f.write(str(name) + "\n")

    print(f"    {len(df)} rows loaded, columns.txt and brands.txt written.")
    return df


# ---------------------------------------------------------------------------
# Step 2 — split by postcode into per-city CSVs
# ---------------------------------------------------------------------------
def split_by_city(df: pd.DataFrame) -> list[str]:
    print("[2/4] Splitting by postcode ...")
    written = []
    for city in CITIES:
        mask = df["forecourts.location.postcode"].str.contains(
            city["postcode_pattern"], regex=True, na=False
        )
        subset = df[mask]
        out = f"{city['name']}.csv"
        subset.to_csv(out, index=False)
        print(f"    {out}: {len(subset)} rows")
        written.append(out)
    return written


# ---------------------------------------------------------------------------
# Step 3 — extract coordinates + fuel prices for each city
# ---------------------------------------------------------------------------
def extract_coordinates(city_csv: str, city_filter: str) -> str:
    df = pd.read_csv(city_csv)
    df.columns = df.columns.str.strip()

    # Numeric coordinates
    for coord in ("forecourts.location.latitude", "forecourts.location.longitude"):
        df[coord] = pd.to_numeric(df[coord], errors="coerce")

    # Auto-detect and convert all fuel price columns
    fuel_cols = [c for c in df.columns if c.startswith("forecourts.fuel_price.")]
    for col in fuel_cols:
        df[col] = pd.to_numeric(df[col], errors="coerce")

    # Text columns
    for col in ("forecourts.location.city", "forecourts.location.postcode",
                "forecourts.location.county", "forecourts.location.country"):
        if col in df.columns:
            df[col] = df[col].astype(str)

    # Filter to exact city name
    filtered = df[df["forecourts.location.city"].str.upper().str.contains(city_filter, na=False)]

    base_cols = [
        "forecourts.location.latitude",
        "forecourts.location.longitude",
        "forecourts.location.city",
        "forecourts.location.postcode",
        "forecourts.location.county",
        "forecourts.location.country",
    ]
    result = filtered[base_cols + fuel_cols].drop_duplicates()
    result = result.dropna(subset=["forecourts.location.latitude", "forecourts.location.longitude"])

    out = city_csv.replace(".csv", "_coordinates.csv")
    result.to_csv(out, index=False)
    return out


def extract_all_coordinates() -> list[str]:
    print("[3/4] Extracting coordinates ...")
    written = []
    for city in CITIES:
        out = extract_coordinates(f"{city['name']}.csv", city["city_filter"])
        print(f"    {out} written  (fuel cols auto-detected)")
        written.append(out)
    return written


# ---------------------------------------------------------------------------
# Step 4 — write last_updated.js based on newest CSV mod time
# ---------------------------------------------------------------------------
def write_last_updated(csv_files: list[str]) -> None:
    print("[4/4] Writing last_updated.js ...")
    latest = 0.0
    for path in csv_files:
        if os.path.exists(path):
            t = os.path.getmtime(path)
            if t > latest:
                latest = t

    if latest == 0:
        print("    No CSV files found — skipping last_updated.js")
        return

    iso = datetime.fromtimestamp(latest, tz=timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")
    os.makedirs(os.path.dirname(LAST_UPDATED_PATH), exist_ok=True)
    with open(LAST_UPDATED_PATH, "w") as f:
        f.write(f"// Auto-generated file — do not edit\n\nwindow.LAST_UPDATED = \"{iso}\";\n")
    print(f"    {LAST_UPDATED_PATH} → {iso}")


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------
def main():
    df = load_and_describe(SOURCE_CSV)
    city_csvs = split_by_city(df)
    extract_all_coordinates()
    write_last_updated(city_csvs)
    print("\nDone! All files updated.")


if __name__ == "__main__":
    main()
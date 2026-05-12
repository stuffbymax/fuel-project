#!/usr/bin/env bash
# name: Update Fuel Prices
# author: stuffbymax|martinP|github.com/stuffbymax
# description: This script downloads the latest fuel prices CSV from the specified URL and saves it as updated_data.csv.
# usage: ./update.sh

# check for curl command
if ! command -v curl &> /dev/null; then
    echo "Error: curl is not installed. Please install curl to use this script."
    exit 1
fi
# pipefail is used to ensure that if any command in a pipeline fails, the entire pipeline will fail and return a non-zero exit code. This is important for error handling and ensures that the script does not continue executing if an error occurs.
set -euo pipefail

# variables to Define the URL to download the CSV file and the output filename
url="https://www.fuel-finder.service.gov.uk/internal/v1.0.2/csv/get-latest-fuel-prices-csv"
output="updated_data.csv"

curl -fL "$url" -o "$output"

echo "File downloaded and saved as $output"
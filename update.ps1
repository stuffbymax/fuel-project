# name: Update Fuel Prices
# author: stuffbymax|martinP|github.com/stuffbymax
# description: This script downloads the latest fuel prices CSV from the specified URL and saves it as updated_data.csv.
# usage: ./update.sh

$url = "https://www.fuel-finder.service.gov.uk/internal/v1.0.2/csv/get-latest-fuel-prices-csv"

$output = "updated_data.csv"

try {
    Invoke-WebRequest -Uri $url -OutFile $output -UseBasicParsing
    Write-Host "Download complete -> $output"
}
catch {
    Write-Host "Download failed:" $_.Exception.Message
    exit 1
}
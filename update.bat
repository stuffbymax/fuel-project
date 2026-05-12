@echo off
REM ================================
REM Batch script to download a URL
REM and save it as a CSV file
REM ================================

setlocal enabledelayedexpansion

REM Define the URL to download
set "url=https://www.fuel-finder.service.gov.uk/internal/v1.0.2/csv/get-latest-fuel-prices-csv"
REM Define the output file name
set "output=updated_data.csv"
REM Use PowerShell to download the file
powershell -Command "Invoke-WebRequest -Uri '%url%' -OutFile '%output%'"
'''
name: Fuel Price 
description: This script processes fuel price data from a CSV file, extracting information about fuel prices, brand names, and locations. It generates separate CSV files for fuel stations in Halifax and Bradford based on their postcodes.
author: MartinP
date: 2024-06-01
License: MIT
'''

# importing necessary libraries
import io
import os
import sys
import json
import pandas as pd
from datetime import datetime


 
fueldata = pd.read_csv("updated_data.csv")
buffer = io.StringIO()
fueldata.info(buf=buffer)
 
with open("columns.txt","w") as file:
    file.write(buffer.getvalue())
file.close()


brandnames = fueldata['forecourts.brand_name'].unique()

with open("brands.txt","w") as file:
    for name in brandnames:
        file.write(str(name)+"\n")
file.close()


tescofuel = fueldata[fueldata["forecourts.brand_name"] == "TESCO"]
tescofuel.head()

# extract by postcode
# Problem: Will match any line with BD


halifax=fueldata[fueldata['forecourts.location.postcode'].str.contains('HX')]
halifax.head()


bradford=fueldata[fueldata['forecourts.location.postcode'].str.contains('BD')]
bradford.head()


# Better way using a regular expression to match on the first part of the
# Postcode
# Learn regular expresssions here https://regexr.com/

halifax=fueldata[fueldata['forecourts.location.postcode'].str.contains(r"HX\d{1,2}",regex=True)]
halifax.to_csv('halifax.csv', index=False)

bradford=fueldata[fueldata['forecourts.location.postcode'].str.contains(r"BD\d{1,2}",regex=True)]
bradford.to_csv('bradford.csv', index=False)

"""
name: Fuel Price Flask API
description: REST API server wrapping the fuel price pipeline.
             Serves per-city fuel data and triggers pipeline runs.
author: MartinP
license: MIT
"""

'''
this will be new version of the fuel project where the csv files are stored in database and the flask api will serve the data from the database
instead of csv files. The api will also have an endpoint to trigger the pipeline to update the database with new data.
'''

# importing necessary libraries
from flask import Flask, jsonify, request, render_template
from flask_cors import CORS
import csv
import os
import requests
from datetime import datetime
import time

# -----------------------------
# Load and clean data
app = Flask(__name__)
CORS(app)

# endpoint for getting all data
@app.route('/data', methods=['GET'])
def get_data():
    data = []
    with open('updated_data.csv', 'r') as file:
        reader = csv.DictReader(file)
        for row in reader:
            data.append(row)
    return jsonify(data)

# endpoint for getting data by city
'''
take an data from the csv file and return the data for the city that is passed in the url
eg 
forecourts.location.latitude,forecourts.location.longitude,forecourts.location.city,forecourts.location.postcode,forecourts.location.county,forecourts.location.country,forecourts.fuel_price.E5,forecourts.fuel_price.E10,forecourts.fuel_price.B7S,forecourts.fuel_price.B7P,forecourts.fuel_price.B10,forecourts.fuel_price.HVO
'''
@app.route('/data/<city>', methods=['GET'])
def get_data_by_city(city):
    data = []
    with open('updated_data.csv', 'r') as file:
        reader = csv.DictReader(file)
        for row in reader:
            # show only the data for the city that is passed in the url
            if row['forecourts.location.city'].lower() == city.lower():
                # filter data for the city and return it
                filtered_row = {
                    'latitude': row['forecourts.location.latitude'],
                    'longitude': row['forecourts.location.longitude'],
                    'city': row['forecourts.location.city'],
                    'postcode': row['forecourts.location.postcode'],
                    'county': row['forecourts.location.county'],
                    'country': row['forecourts.location.country'],
                    'adblue_packaged': row['forecourts.amenities.fuel_and_energy_services.adblue_packaged'],
                    'adblue_pumps': row['forecourts.amenities.fuel_and_energy_services.adblue_pumps'],
                    'lpg_pumps': row['forecourts.amenities.fuel_and_energy_services.lpg_pumps'],
                    'twenty_four_hour_fuel': row['forecourts.amenities.twenty_four_hour_fuel'],
                    'address_line_1': row['forecourts.location.address_line_1'],
                    'E5': row['forecourts.fuel_price.E5'],
                    'E10': row['forecourts.fuel_price.E10'],
                    'B7S': row['forecourts.fuel_price.B7S'],
                    'B7P': row['forecourts.fuel_price.B7P'],
                    'B10': row['forecourts.fuel_price.B10'],
                    'HVO': row['forecourts.fuel_price.HVO'],
                    'price_change_effective_timestamp': {
                        'B10': row['forecourts.price_change_effective_timestamp.B10'] if
                            'forecourts.price_change_effective_timestamp.B10' in row else None,
                        'B7P': row['forecourts.price_change_effective_timestamp.B7P'] if
                            'forecourts.price_change_effective_timestamp.B7P' in row else None,
                        'B7S': row['forecourts.price_change_effective_timestamp.B7S'] if
                            'forecourts.price_change_effective_timestamp.B7S' in row else None,
                        'E10': row['forecourts.price_change_effective_timestamp.E10'] if
                            'forecourts.price_change_effective_timestamp.E10' in row else None,
                        'HVO': row['forecourts.price_change_effective_timestamp.HVO'] if
                            'forecourts.price_change_effective_timestamp.HVO' in row else None
                            }
                }
                data.append(filtered_row)
    if not data:
        return jsonify({'message': 'City not found'}), 404
    return jsonify(data)

@app.route('/about', methods=['GET'])
def about():
    return jsonify({
        'name': 'Fuel Price Flask API',
        'description': 'REST API server wrapping the fuel price pipeline. Serves per-city fuel data and triggers pipeline runs. also i have no idea what the fuel types are so expect some incorrect data',
        'author': 'MartinP',
        'data_source': 'UK government fuel price data',
        'url': 'https://www.fuel-finder.service.gov.uk/internal/v1.0.2/csv/get-latest-fuel-prices-csv',
        'license': 'MIT'
    })


# rendering pages
@app.route('/')
def home():
    return render_template('index.html')

@app.route('/embeded_map')
def embeded_map():
    return render_template('embeded_map.html')

# exprerimental
# download latest csv file from 10:00 to 16  :00 every day and save it to the local directory
url = 'https://www.fuel-finder.service.gov.uk/internal/v1.0.2/csv/get-latest-fuel-prices-csv'
csv_file = 'updated_data.csv'
def download_csv():
    # download the csv file from the url and save it to the local directory to 10:00 to 16:00 every day
    while True:
        now = datetime.now()
        if now.hour >= 10 and now.hour < 16:
            response = requests.get(url)
            with open(csv_file, 'wb') as file:
                file.write(response.content)
        time.sleep(3600) # sleep for 1 hour

# # start the csv download in a separate thread
# import threading
# csv_thread = threading.Thread(target=download_csv)
# csv_thread.start()

# run the flask app
if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5000, debug=True)
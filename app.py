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
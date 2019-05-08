
# Name: Jessica Sam
# Student number: 10752498
"""
This script cleans data from a json file
"""
import pandas
import json

def clean_data(all_data):

    # select all data measured in KTOE and data from 2016. Drop unnecessary rows
    data = all_data[all_data.MEASURE == "PC_PRYENRGSUPPLY"]
    data = data[all_data.TIME == 2016]
    data = data.drop(["INDICATOR", "SUBJECT", "FREQUENCY", "Flag Codes","MEASURE", "TIME"], axis=1)
    data = data.sort_values('Value')

    europe = ['AUT', 'BEL', 'BGR', 'HRV', 'CYP', 'CZE', 'DNK', 'EST', 'FIN', 'FRA', 'DEU', 'GRC',\
                'HUN', 'IRL', 'ITA', 'LVA', 'LUX', 'MLT', 'NLD', 'POL', 'PRT', 'ROU',\
                'SVK', 'SVN', 'ESP', 'SWE', 'GBR']

    # drop countries that are not in Europe
    data = data.set_index('LOCATION')
    for row in data.iterrows():
        if row[0] not in europe:
            data = data.drop(row[0])
    data = data.reset_index()

    return data

def write_json(data):
    # Writes dataframe to json file
    data.to_json(r'energy.json', orient='records')


if __name__ == "__main__":

    # Load data into dataframe
    all_data = pandas.read_csv("data.csv")

    # Clean data
    data = clean_data(all_data)

    # Write json file
    write_json(data)

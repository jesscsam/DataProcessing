# Name: Jessica Sam
# Student number: 10752498
"""
This script cleans data from a csv file, exporting to json.
"""
import pandas
import json

def clean_data(all_data):

    # Select only competitors from 2016
    data = all_data[all_data.Year == 2016]

    # Drop all unnecessary columns
    data = data.drop(["Name", "Age", "Weight", "Height","Games", "City", "Sport", "Event", "Year", "Season"], axis=1)

    # Create dataframe that groups by NOC, and counts the amount of entries per sex
    sexes_df = pandas.DataFrame({'count' : data.groupby(["NOC", "Sex"]).size()}).reset_index()

    # Create dataframe that groups by NOC, and counts the total amount of entries
    totals_df = pandas.DataFrame({'count' : data.groupby(["NOC"]).size()}).reset_index()

    # Create dictionary
    uberDict = {}

    # Add NOC and total athletes to uberDict
    for row in totals_df.iterrows():
        uberDict[row[1]["NOC"]] = {"Total": row[1]["count"]}

    # Add amount of female and male entries to each country in uberDict
    for andereRow in sexes_df.iterrows():
        uberDict[andereRow[1]["NOC"]][andereRow[1]["Sex"]] = andereRow[1]["count"]

    # Write dictionary to json
    with open('data.json', 'w') as outfile:
        json.dump(uberDict, outfile)



if __name__ == "__main__":

    # Load data into dataframe
    all_data = pandas.read_csv("athlete_events.csv")

    # Clean data & write json
    data = clean_data(all_data)

#!/usr/bin/env python
# Name:
# Student number:
"""
This script visualizes data obtained from a .csv file
"""

import csv
import matplotlib.pyplot as plt
from statistics import mean

# Global constants for the input file, first and last year
INPUT_CSV = "movies.csv"
START_YEAR = 2008
END_YEAR = 2018

# Global dictionary for the data
data_dict = {str(key): [] for key in range(START_YEAR, END_YEAR)}

if __name__ == "__main__":

    with open('movies.csv', newline='') as csvfile:
        reader = csv.reader(csvfile)
        for row in reader:
            data_dict[row[2]].append(row[1])

    averages = {}
    year = START_YEAR
    for list in data_dict:
        newlist = []
        for number in data_dict[list]:
            number = float(number)
            newlist.append(number)
        averages[list] = round(mean(newlist), 1)
        year += 1

    years = []
    values = []
    for key in averages:
        years.append(int(key))
        values.append(averages[key])

    plt.ylabel('average movie rating')
    plt.xlabel('year')
    plt.plot(years, values)
    plt.axis([2008, 2017, 8, 9])
    plt.show()
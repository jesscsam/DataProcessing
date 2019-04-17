import pandas
import numpy as np
import matplotlib.pyplot as plt
import json


def clean_data(alldata):
    # Remove whitespace from Region column
    alldata['Region'] = alldata['Region'].str.strip()

    # Remove columns unnecessary for this assignment
    data = alldata.drop(['Population', 'Area (sq. mi.)', 'Coastline (coast/area ratio)', \
                        'Net migration', 'Literacy (%)', 'Phones (per 1000)', 'Arable (%)', \
                        'Crops (%)', 'Other (%)', 'Climate', 'Birthrate', 'Deathrate', \
                         'Agriculture', 'Industry', 'Service'], axis=1)

    # Rename GDP column and remove ' dollars' from all values
    data = data.rename(columns={'GDP ($ per capita) dollars': 'GDP ($ per capita)'})
    data['GDP ($ per capita)'] = data['GDP ($ per capita)'].str.strip(' dollars')

    # Replaces strings 'unknown' to empty values
    data.replace('unknown', '', inplace=True)

    # Change comma's to dots in pop density & infant mortality column
    data[['Infant mortality (per 1000 births)', 'Pop. Density (per sq. mi.)']] = \
        data[['Infant mortality (per 1000 births)', 'Pop. Density (per sq. mi.)']].apply(comma_to_dot)

    # Convert data types from string to numeric
    data[['GDP ($ per capita)', 'Infant mortality (per 1000 births)', 'Pop. Density (per sq. mi.)']] = \
        data[['GDP ($ per capita)', 'Infant mortality (per 1000 births)', 'Pop. Density (per sq. mi.)']].apply(make_numeric)

    # Remove rows that have NaN or empty values
    data = data.dropna()

    # Remove any rows that have a GDP of higher than 100,000, because that's unrealistic.
    data = data.loc[data['GDP ($ per capita)'] < 100000]

    return data

def comma_to_dot(data):
    return data.str.replace(',','.')

def make_numeric(data):
    return pandas.to_numeric(data)


def plot_hist_GDP(data):
    # Print mean, median, mode and std values for GDP data
    print("GDP data:")
    print(f"Mean: {data['GDP ($ per capita)'].mean()}")
    print(f"Median: {data['GDP ($ per capita)'].median()}")
    mode = data['GDP ($ per capita)'].mode()
    print(f"Mode: {mode.iloc[0]}")
    print(f"Std: {data['GDP ($ per capita)'].std()}")

    # Plot histogram for GDP data
    data['GDP ($ per capita)'].plot.hist()
    plt.xlabel('GDP ($ per capita)')
    plt.title('Amount of countries with a specific GDP')
    plt.show()


def boxplot_infmortality(data):
    # Print five number summary for infant mortality data
    print("Infant mortality data: ")
    print(f"Min: {data['Infant mortality (per 1000 births)'].min()}")
    print(f"First quantile: {data['Infant mortality (per 1000 births)'].quantile(q=0.25)}")
    print(f"Median: {data['Infant mortality (per 1000 births)'].quantile(q=0.25)}")
    print(f"Third quantile: {data['Infant mortality (per 1000 births)'].median()}")
    print(f"Max: {data['Infant mortality (per 1000 births)'].max()} ")

    # Make boxplot for infant mortality data
    data.boxplot(column='Infant mortality (per 1000 births)')
    plt.ylabel('Number of infant deaths (per 1000 births)')
    plt.title('Infant mortality worldwide')
    plt.show()

def write_json(data):
    # Writes dataframe to json file
    data = data.set_index('Country')
    data.to_json(r'data.json', orient='index')

if __name__ == "__main__":

    # Load data into dataframe
    alldata = pandas.read_csv("input.csv")

    # Clean data
    data = clean_data(alldata)

    # Print and plot GDP data
    plot_hist_GDP(data)

    # Print and plot infant mortality data
    boxplot_infmortality(data)

    # Write clean data to json file
    write_json(data)

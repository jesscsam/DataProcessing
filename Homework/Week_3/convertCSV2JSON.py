# Universiteit van Amsterdam, Minor Programmeren
# Vak: Data Processing
# Naam: Jessica Sam
# Studentnummer: 10752498
# Gebruik: CSV bestand omzetten naar JSON

import csv
import json

# Open the CSV
with open('geregistreerdemisdrijven.csv','r') as infile:
    # Read each row into dictionary
    reader = csv.DictReader(infile)

    # Parse rows to json
    outfile = json.dumps( [ row for row in reader ] )

    # Save the JSON
    out = open( 'misdrijven.json', 'w')
    out.write(outfile)

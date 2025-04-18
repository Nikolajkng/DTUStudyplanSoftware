import requests
from bs4 import BeautifulSoup
import csv
import os

# URL of the webpage
URL = "https://www2.compute.dtu.dk/softwareteknologi/kurser.html"
headers = {
    "User-Agent": "Mozilla/5.0"
}

# Fetch the page
response = requests.get(URL, headers=headers)
soup = BeautifulSoup(response.text, "lxml")

if response.status_code == 200:
    base_dir = os.path.dirname(__file__)
    csv_filename = os.path.join(base_dir, "..", "csv", "studieplan2023_valgfag.csv")
    csv_filename = os.path.abspath(csv_filename)
    os.makedirs(os.path.dirname(csv_filename), exist_ok=True)

    tables = soup.find_all("table")
    rows_written = 0

    with open(csv_filename, mode="w", newline="", encoding="utf-8") as csv_file:
        writer = csv.writer(csv_file)
        writer.writerow(["course_id", "course_name", "ects", "placement"])  # Write header

        for idx, table in enumerate(tables):
            if idx < 5:
                continue

            # Check if the table contains the relevant header row
            if "Kursusnr." in table.get_text(separator=' ', strip=True):
                print(f"Processing table {idx}...")

                # Loop through all rows in the table except the header row
                for row in table.find_all("tr")[1:]:  # Skip the header row
                    cols = row.find_all("td")
                    
                    if len(cols) >= 4:  # Ensure the row has at least 4 columns
                        # Extract course code from the <a> tag in the first <td>
                        course_code = cols[0].find("a").get_text(strip=True)
                        
                        # Extract course name from the second <td>
                        course_name = cols[1].get_text(strip=True)
                        
                        # Extract ECTS from the third <td>
                        ects = cols[2].get_text(strip=True)
                        
                        # Extract group from the fourth <td>
                        group = cols[3].get_text(strip=True)

                        # Write the extracted data to the CSV
                        writer.writerow([course_code, course_name, ects, group])
                        rows_written += 1

                print(f"✅ Table {idx} processed. {rows_written} rows written.")

else:
    print("❌ Failed to fetch the page")

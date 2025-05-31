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
        
        # Attributes:
        writer.writerow(["course_id", "course_name", "ects", "placement", "course_type"])
        
        # Edge case - bachelor projektet
        writer.writerow(["00000", "Bachelorprojekt", "15", "Forår eller Efterår", "Projekter"])  
        writer.writerow(["00001", "Bachelorprojekt", "17.5", "Forår eller Efterår", "Projekter"])  
        writer.writerow(["00002", "Bachelorprojekt", "20", "Forår+juni eller Efterår+januar", "Projekter"])  
        
        
        # Edge case - kommunikationskursus
        writer.writerow(["34220", "Kommunikationssystemer", "5", "juni", "Valgfrie kurser"])  


        # Skip de 3 første tabeller, kun inkludere de 5 sidste (valgfag)
        for idx, table in enumerate(tables):
            if idx < 5:
                continue

            if "Kursusnr." in table.get_text(separator=' ', strip=True):
                for row in table.find_all("tr")[1:]: 
                    cols = row.find_all("td")
                    
                    if len(cols) >= 4:  
                        course_code = cols[0].find("a").get_text(strip=True)
                        course_name = cols[1].get_text(strip=True)
                        ects = cols[2].get_text(strip=True).replace(",", ".").replace(" \" ", "")
                        group = cols[3].get_text(strip=True)
                        type = "Valgfrie kurser"

                        # Write the extracted data to the CSV
                        writer.writerow([course_code, course_name, ects, group, type])
                        rows_written += 1
    print(f"Data successfully saved with {rows_written} rows added to CSV.")
else:
    print("Failed to fetch the page")

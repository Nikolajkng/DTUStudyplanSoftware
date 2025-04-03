import requests
from bs4 import BeautifulSoup
import csv

# URL of the webpage
URL = "https://student.dtu.dk/studieordninger/bachelor/softwareteknologi/studieplan"
headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
}

# Fetch the page
response = requests.get(URL, headers=headers)
soup = BeautifulSoup(response.text, "html.parser")

if response.status_code == 200:
    # Find the table
    tables = soup.find_all("table", class_ = "kursusblokclass")    
        
    # Prepare CSV file
    csv_filename = "studieplan2023plus.csv"
    with open(csv_filename, "w", newline="", encoding="utf-8") as csvfile:
        writer = csv.writer(csvfile)
        writer.writerow(["course_id", "course_name", "ects", "placement", "course_type"])  # Header row

        last_course = None  # Track the last valid course entry

        # Extract rows from table
        for table in tables:
            for row in table.find_all("tr"): 
                cols = row.find_all("td")
                if len(cols) >= 5:  # Ensure row has enough columns
                    course_number_tag = cols[0].find("a")
                    course_number = course_number_tag.text.strip() if course_number_tag else ""

                    course_name = cols[1].text.strip().replace("(polyteknisk grundlag)", "").replace("(Polyteknisk grundlag)","")  # Second td
                    ects_points = cols[2].text.strip()  # First numeric td
                    placement = cols[-1].text.strip()  # Last td contains placement

                    # Skip 'eller' rows
                    if course_name.lower() == "eller":
                        continue

                    # If it's a new course, store it
                    if course_number:
                        last_course = [course_number, course_name, ects_points, placement, "Polyteknisk Grundlag"]
                        writer.writerow(last_course)
                    else:
                        # If no course number, update the last valid course with this placement
                        if last_course:
                            last_course[3] += f", {placement}".strip(", ")
                            writer.writerow(last_course)

    print(f"Data successfully saved to {csv_filename}")

else:
    print("Failed to fetch the page")

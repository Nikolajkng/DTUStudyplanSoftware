import requests
from bs4 import BeautifulSoup
import csv
import os


def splitCourse():
    course_id = "10060"
    course_name = "Fysik (del 1)"
    ects_points = "5"
    placement = "F1A"
    course_type = "Polyteknisk grundlag"
    last_course = [course_id, course_name, ects_points, placement, course_type]
    writer.writerow(last_course)
    course_id = "10060"
    course_name = "Fysik (del 2)"
    ects_points = "5"
    placement = "E1A"
    course_type = "Polyteknisk grundlag"
    last_course = [course_id, course_name, ects_points, placement, course_type]
    writer.writerow(last_course)

# URL of the webpage
URL = "https://student.dtu.dk/studieordninger/bachelor/softwareteknologi/studieplan"
headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
}

# Fetch the page
response = requests.get(URL, headers=headers)
soup = BeautifulSoup(response.text, "html.parser")

if response.status_code == 200:
    tables = soup.find_all("table", class_="kursusblokclass")
    count = 0

    # Write everything to a CSV file
    base_dir = os.path.dirname(__file__)
    csv_filename = os.path.join(base_dir, "..", "csv", "studieplan2023_all_courses.csv")
    csv_filename = os.path.abspath(csv_filename)
    os.makedirs(os.path.dirname(csv_filename), exist_ok=True)

    with open(csv_filename, "w", newline="", encoding="utf-8") as csvfile:
        writer = csv.writer(csvfile)
        writer.writerow(["course_id", "course_name", "ects", "placement", "course_type"])

        last_course = None

        for table in tables:
            # Get the section title by going backward through previous siblings
            course_type = "Unknown"
            for prev in table.find_all_previous():
                if prev.name == "strong" and prev.text.strip():
                    course_type = prev.text.strip()
                    break

            # Now parse this table
            for row in table.find_all("tr"):
                cols = row.find_all("td")
                if len(cols) >= 5:
                    course_id_tag = cols[0].find("a")
                    course_id = course_id_tag.text.strip() if course_id_tag else ""
                    if course_id == "10060":
                       splitCourse()# Fysik skal opdeles i to Blokke x 5 ects
                       continue # Tilføj ikke 10060 som hel blok med 10 ects
                        
                    course_name = cols[1].text.strip().replace("(polyteknisk grundlag)", "").replace("(Polyteknisk grundlag)", "")
                    ects_points = cols[2].text.strip()
                    placement = cols[-1].text.strip()

                    if course_name.lower() == "eller":
                        continue

                    if course_id:
                        last_course = [course_id, course_name, ects_points, placement, course_type]
                        writer.writerow(last_course)
                    else:
                        if last_course:
                            last_course[3] += f", {placement}".strip(", ")
                            writer.writerow(last_course)
                    count += 1
    print(f"Data successfully saved with {count} rows added to CSV.")

else:
    print("Failed to fetch the page")


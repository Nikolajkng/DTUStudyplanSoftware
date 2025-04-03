import requests
from bs4 import BeautifulSoup
import csv

def save_as_csv(courses: list) -> None:
    """Saves course data to a CSV file."""

    # Define the CSV filename
    filename = "courses.csv"

    
    # Write data to CSV file
    with open(filename, mode="w", newline="", encoding="utf-8") as file:
        writer = csv.writer(file)
        
        # Write header row
        writer.writerow(["Course Number", "Course Name", "ECTS", "Placement"])
        
        # Write course data
        writer.writerows(courses)

    print(f"CSV file '{filename}' created successfully!")

def save_content_txt(content_list):
    """Saves extracted text content to a file."""
    with open("courses.txt", 'w', encoding="utf-8") as file:
        for content in content_list:
            file.write(content + "\n")  # Write each extracted table content on a new line

######################################################## START ########################################################

URL = "https://student.dtu.dk/studieordninger/bachelor/softwareteknologi/studieplan"
headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
}

response = requests.get(URL, headers=headers)

if response.status_code == 200:
    # Parse the HTML content using BeautifulSoup
    soup = BeautifulSoup(response.text, 'html.parser')

    # Find all tables with the class "kursusblokclass"
    courses_table = [table.get_text(strip=True) for table in soup.find_all('table', class_="kursusblokclass")]
    
    for row in courses_table:
        
        
        print(row)
        

    # Print extracted text
    for content in all_courses_table:
        print(content)

    # Save extracted tables to a file


    courses = [
            ["12345", "Introduction to Programming", "5", "Spring"],
            ["23456", "Data Structures", "7.5", "Fall"],
            ["34567", "Machine Learning", "10", "Spring"],
            ["45678", "Cybersecurity Basics", "5", "Fall"],
            ["56789", "Software Engineering", "7.5", "Spring"]
        ]

    # Save the extracted content to a csv file:
    save_as_csv(courses)


    print("Courses saved successfully!")

else:
    print("Failed to fetch the page")

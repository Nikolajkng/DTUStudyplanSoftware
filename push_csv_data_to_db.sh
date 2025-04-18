#!/bin/bash


# 1) Web scrape content from 'https://student.dtu.dk/studieordninger/bachelor/softwareteknologi/studieplan' and save to CSV file.
python3 src/db/webscraper/course_scraper_all_courses.py
echo "Web scraping #1 completed. CSV file created."
sleep 1

python3 src/db/webscraper/course_scraper_valgfag.py
echo "Web scraping #2 completed. CSV file created."
sleep 1

# 2) Connect to DB and push CSV data to MariaDB database.
python3 src/db/webscraper/write_to_DB.py


#!/bin/bash


# 1) Web scrape content from 'https://student.dtu.dk/studieordninger/bachelor/softwareteknologi/studieplan' and save to CSV file.
python src/db/webscraper/course_scraper.py

# 2) Connect to DB and push CSV data to MariaDB database.
python src/db/csv_to_sqlite.py

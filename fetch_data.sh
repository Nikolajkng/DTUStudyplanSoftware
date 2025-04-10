#!/bin/bash


# 1) Web scrape content from 'https://student.dtu.dk/studieordninger/bachelor/softwareteknologi/studieplan' and save to CSV file.
python3 src/db/webscraper/course_scraper.py

sleep 1

# 2) Connect to DB and push CSV data to MariaDB database.
python3 src/db/webscraper/pushDB.py


import mysql.connector
import pandas as pd
from dotenv import load_dotenv
import os

# Load environment variables from the .env file
load_dotenv()

# Retrieve the connection details from the environment variables
host = os.getenv('DB_HOST')
user = os.getenv('DB_USER')
password = os.getenv('DB_PASSWORD')
database_name = os.getenv('DB_NAME')

# Path to your CSV file
df  = [
    pd.read_csv("src/db/csv/studieplan2023_all_courses.csv"),
    pd.read_csv("src/db/csv/studieplan2023_valgfag.csv")
    ]


# Connect to the MariaDB server
try:
    conn = mysql.connector.connect(
        host=host,
        user=user,
        password=password
    )
    cursor = conn.cursor()
    print("Connected to MariaDB successfully.")
except mysql.connector.Error as err:
    print(f"Error: {err}")
    exit(1)


cursor.execute("USE " + database_name)
cursor.execute("""
        CREATE OR REPLACE TABLE Courses (
            course_id VARCHAR(5),
            course_name VARCHAR(150),
            course_type VARCHAR(150), 
            ects DECIMAL(3,1), 
            placement VARCHAR(150),
            PRIMARY KEY (course_id, course_name)
        )
    """)


duplicate_entries = []

for df in df:
    # Check if the DataFrame is empty
    if df.empty:
        print("The DataFrame is empty. No data to insert.")
        continue

    # Iterate over the rows of the DataFrame
    for index, row in df.iterrows():
        course_id = str(row['course_id'])
        
        # Edgecase for Bachelorprojektets id:
        if len(course_id) == 1 and course_id == '0': course_id = '00000'
        
        #Edgecase for course_id hvor 0 bliver fjernet, tilføj igen:
        if len(course_id) == 4: course_id = "0" + course_id
        course_name = row['course_name']
        course_type = row['course_type']
        ects = row['ects']
        placement = row['placement']

        # Insert the data into the table
        insert_query = """
            INSERT INTO Courses (course_id, course_name, course_type, ects, placement)
            VALUES (%s, %s, %s, %s, %s)
        """
        
        # Check if the course_id already exists in the table
        cursor.execute(
        "SELECT 1 FROM Courses WHERE course_id = %s AND course_name = %s LIMIT 1",
        (course_id, course_name)
        )
        exists = cursor.fetchone() is not None
        if exists:
            print(f"skipping duplicate entry for course {course_id}")
            duplicate_entries.append((course_id, course_name))
            continue 
        
        print("hello world")
        
        cursor.execute(insert_query, (course_id, course_name, course_type, ects, placement))
        print(f"Inserted course {course_id} into the database.")
    conn.commit()


# Close the cursor and connection
print(f"Found Duplicate courses which was skipped in insertion: ")
for course_id, course_name in duplicate_entries:
    print(f"Course ID: {course_id}, Course Name: {course_name}")

cursor.close()
conn.close()
print("Database connection closed.")

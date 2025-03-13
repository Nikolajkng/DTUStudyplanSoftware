This project aims to create a website for the Technical University of Denmark in which students from Software BSc. (civil) can get an overview of recommended study plans. While this already exists, the goal of this project is to make an improved version that is more interactive and has a more modern GUI.

The project is done under the supervision of professor Carsten Witt.


# Flow of Database

FILE                  FUNCTION                           DESC
courses/page.tsx      fetchCourses()                     Sends HTTP Request to GET data from API endpoint created in route.ts
route.ts              connection.query("<SQL query>")    GET() triggered, connection to DB and SQL-query fetches data 
route.ts              Response(JSON.stringify())         GET() responds with processed data || error 

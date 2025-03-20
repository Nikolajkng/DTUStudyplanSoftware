import requests
from bs4 import BeautifulSoup


def save_content_txt():
    # Extract the main content of the page
    content = soup.find(id='mw-content-text').get_text()

    TXT = "courses.txt"

    # Save the content to a text file
    with open(TXT, 'w') as file:
        file.write(content)


######################################################## START ########################################################

URL = "https://en.wikipedia.org/wiki/Python_(programming_language)"
response = requests.get(URL)


if response.status_code == 200:

    # Parse the HTML content using BeautifulSoup
    soup = BeautifulSoup(response.text, 'html.parser')

    
    # Extract the title of the page
    title = soup.title.string
    print(f"Title of the page: {title}")


    save_content_txt()

else:
    print("Failed to fetch the page")

from bs4 import BeautifulSoup


def main():
    with open('courses.txt', 'r') as file:
        html = file.read()

    # HTML Parser        
    soup = BeautifulSoup(html, 'lxml')

    # Find all the courses
    div = soup.find('div', class_='content')
    print(div)

if __name__ == '__main__':
    main()
CREATE TABLE Courses (
	course_id VARCHAR(5) PRIMARY KEY,
	course_name VARCHAR(100),
	course_type VARCHAR (50) NOT NULL,
	ects INT UNSIGNED
);

Select * from Courses;

INSERT INTO Courses values 
("01005", "Matematik 1", "Naturvidenskabelige grundfag", 20),
("02101", "Indledende Programmering", "Projekter og almene fag", 5),
("02157", "Funktionsprogrammering", "Teknologisk linjefag", 5),
("02247", "Oversætterkonstruktion", "Valgfri fag", 5);

Select * from Courses;


INSERT INTO Courses (course_id, course_name, course_type, ects) VALUES
('10020', 'Fysik 1', 'Naturvidenskabelig grundfag', 10),
('26026', 'Grundlæggende Kemi', 'Naturvidenskabelig grundfag', 5),
('26027', 'Grundlæggende Kemi', 'Naturvidenskabelig grundfag', 5),
('26028', 'Grundlæggende Kemi', 'Naturvidenskabelig grundfag', 5),
('01017', 'Diskret matematik', 'Naturvidenskabelig grundfag', 5),
('27020', 'Interdisciplinær bioengineering', 'Naturvidenskabelig grundfag', 5),
('02402', 'Introduktion til statistik', 'Naturvidenskabelig grundfag', 5),
('02403', 'Introduktion til matematisk statistik', 'Naturvidenskabelig grundfag', 5),
('02405', 'Sandsynlighedsregning', 'Naturvidenskabelig grundfag', 5),
('10034', 'Matematik 2', 'Naturvidenskabelig grundfag', 5),
('10037', 'Matematik 2', 'Naturvidenskabelig grundfag', 5),
('10035', 'Matematik 2', 'Naturvidenskabelig grundfag', 5),
('10041', 'Fysik 2 - Gen. Eng.', 'Naturvidenskabelig grundfag', 5),
('26202', 'Fysisk kemi for biovidenskaberne', 'Naturvidenskabelig grundfag', 5),
('27002', 'Biovidenskab/Life Science', 'Naturvidenskabelig grundfag', 5);

Select * from Courses;

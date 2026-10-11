-- Day 6: School Database
-- SQLite compatible

-- Drop if exists
DROP TABLE IF EXISTS enrolments;
DROP TABLE IF EXISTS students;
DROP TABLE IF EXISTS courses;

-- Students table
CREATE TABLE students (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    age INTEGER
);

-- Courses table
CREATE TABLE courses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    code TEXT NOT NULL UNIQUE
);

-- Enrolments table - join table
CREATE TABLE enrolments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    student_id INTEGER NOT NULL,
    course_id INTEGER NOT NULL,
    grade TEXT,
    FOREIGN KEY (student_id) REFERENCES students(id),
    FOREIGN KEY (course_id) REFERENCES courses(id),
    UNIQUE(student_id, course_id)
);

-- INSERT sample data: at least 3 students
INSERT INTO students (name, email, age) VALUES 
('Wanyoike Huraah', 'huraah@example.com', 24),
('Alice Johnson', 'alice@example.com', 22),
('Brian Kim', 'brian@example.com', 23),
('Grace Lee', 'grace@example.com', 21);

-- at least 3 courses
INSERT INTO courses (name, code) VALUES
('Web Development', 'WD101'),
('Database Systems', 'DB102'),
('Data Structures', 'DS103');

-- at least 5 enrolments
INSERT INTO enrolments (student_id, course_id, grade) VALUES
(1, 1, 'B'),
(1, 2, 'A'),
(2, 1, 'A'),
(2, 3, 'B+'),
(3, 2, 'C');

-- QUERY 1: All courses for one student (by name)
SELECT c.name AS course_name, c.code, e.grade
FROM courses c
JOIN enrolments e ON e.course_id = c.id
JOIN students s ON s.id = e.student_id
WHERE s.name = 'Wanyoike Huraah';

-- QUERY 2: All students on one course
SELECT s.name AS student_name, s.email, e.grade
FROM students s
JOIN enrolments e ON e.student_id = s.id
JOIN courses c ON c.id = e.course_id
WHERE c.code = 'WD101';

-- QUERY 3: Number of students per course
SELECT c.name AS course_name, COUNT(e.student_id) AS number_of_students
FROM courses c
LEFT JOIN enrolments e ON e.course_id = c.id
GROUP BY c.id, c.name;

-- QUERY 4: Students who have no enrolments
SELECT s.name, s.email
FROM students s
LEFT JOIN enrolments e ON e.student_id = s.id
WHERE e.student_id IS NULL;

-- QUERY 5: Update one enrolment's grade
UPDATE enrolments SET grade = 'A+' WHERE student_id = 1 AND course_id = 1;
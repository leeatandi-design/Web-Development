# School Database Design - Day 6

## Tables

1. **students**: Stores student info. `id` is primary key, `name` NOT NULL, `email` UNIQUE and NOT NULL to prevent duplicate accounts, `age` optional.
2. **courses**: Stores course info. `id` is primary key, `name` NOT NULL, `code` UNIQUE to identify course like WD101.
3. **enrolments**: Join table that links students and courses. It holds `student_id`, `course_id`, and `grade`. `id` is primary key. Has FOREIGN KEYs to both tables and a UNIQUE(student_id, course_id) to prevent same student enrolling twice on same course.

## Relationships

- **students -> enrolments**: One-to-Many. One student can have many enrolments.
- **courses -> enrolments**: One-to-Many. One course can have many enrolments.
- **students -> courses**: Many-to-Many. A student can take many courses and a course can have many students. This is why we need a join table `enrolments`. Without it we cannot represent many-to-many and we cannot store grade per enrolment.

## Index

I would add an index on `enrolments(student_id)` and `enrolments(course_id)`.
`CREATE INDEX idx_enrolments_student ON enrolments(student_id);`
Reason: These columns are used in JOINs and WHERE clauses for the 5 queries. Index makes finding all courses for a student and all students for a course much faster.

## SQL vs NoSQL for this system

I would choose SQL for this system. This is a structured system with clear relationships and need for data integrity (UNIQUE email, no duplicate enrolment, foreign keys). SQL enforces ACID, prevents bad data, and JOINs make queries like "students per course" easy. NoSQL would need multiple collections and manual checks for duplicates and would be more complex for reporting. NoSQL would only be better if we had unstructured data or massive scaling needs, which a school system does not.

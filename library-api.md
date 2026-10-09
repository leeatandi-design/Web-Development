# Library API Design - Books Resource

Base URL: `/api`

## Endpoints

### 1. List all books

- **Method:** GET
- **Path:** /books
- **Description:** Retrieve a list of all books in the library
- **Request Body:** None
- **Success Status:** 200 OK

### 2. Get one book

- **Method:** GET
- **Path:** /books/{id}
- **Description:** Retrieve details of a single book by its ID
- **Request Body:** None
- **Success Status:** 200 OK

### 3. Create a new book

- **Method:** POST
- **Path:** /books
- **Description:** Add a new book to the library
- **Request Body:**
  ```json
  {
    "title": "The Great Gatsby",
    "author": "F. Scott Fitzgerald",
    "isbn": "9780743273565",
    "publishedYear": 1925
  }
  ```

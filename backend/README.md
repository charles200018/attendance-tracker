## Attendance Tracker Backend

### Setup

1. Install dependencies:

    ```
    npm install
    ```

2. Copy `.env.example` to `.env` and configure your MySQL credentials.

3. Create the database and tables:

    ```sql
    CREATE DATABASE attendance_db;
    USE attendance_db;

    CREATE TABLE classes (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL
    );

    CREATE TABLE students (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      roll VARCHAR(50),
      class_id INT,
      FOREIGN KEY (class_id) REFERENCES classes(id)
    );

    CREATE TABLE attendance (
      id INT AUTO_INCREMENT PRIMARY KEY,
      class_id INT,
      student_id INT,
      date DATE,
      status ENUM('present', 'absent', 'late') DEFAULT 'present',
      UNIQUE KEY unique_attendance (class_id, student_id, date),
      FOREIGN KEY (class_id) REFERENCES classes(id),
      FOREIGN KEY (student_id) REFERENCES students(id)
    );
    ```

4. Start the server:

    ```
    npm start
    ```
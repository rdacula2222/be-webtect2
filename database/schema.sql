CREATE DATABASE IF NOT EXISTS your_database_name;

-- Use database
USE local;

-- Create students table
CREATE TABLE IF NOT EXISTS students (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  age INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert sample data (optional)
INSERT INTO students (name, email, age) VALUES
  ('John Doe', 'john@example.com', 20),
  ('Jane Smith', 'jane@example.com', 22),
  ('Bob Johnson', 'bob@example.com', 21);

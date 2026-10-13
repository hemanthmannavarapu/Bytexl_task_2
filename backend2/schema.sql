-- Database setup for studentdb2
CREATE DATABASE IF NOT EXISTS studentdb2;
USE studentdb2;

CREATE TABLE IF NOT EXISTS students2 (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    age INT NOT NULL,
    mark INT NOT NULL,
    cgpa DECIMAL(3,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

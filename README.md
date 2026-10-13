# Bytexl Task 2

Frontend: React
Backend: Node.js + Express
Database: MySQL (XAMPP)

## Database Details

- Database Name: studentdb2
- Table Name: students2
- Host: localhost
- User: root
- Password: (empty)

## Table Structure

| Column | Type |
| -------- | ------ |
| id | INT AUTO_INCREMENT PRIMARY KEY |
| name | VARCHAR(100) |
| age | INT |
| mark | INT |
| cgpa | DECIMAL(3,2) |

## SQL

CREATE TABLE students2 (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100),
    age INT,
    mark INT,
    cgpa DECIMAL(3,2)
);

## Deployment & CI/CD

Automated deployment and testing are configured using **GitHub Actions**:

- **Frontend Deployment (GitHub Pages)**: [`.github/workflows/deploy-frontend.yml`](.github/workflows/deploy-frontend.yml)
- **CI Build & Lint Pipeline**: [`.github/workflows/ci.yml`](.github/workflows/ci.yml)
- **Backend Docker & Cloud Webhook**: [`.github/workflows/deploy-backend.yml`](.github/workflows/deploy-backend.yml)

For full deployment instructions (GitHub Pages, Render, Railway, Docker), see [DEPLOYMENT.md](DEPLOYMENT.md).

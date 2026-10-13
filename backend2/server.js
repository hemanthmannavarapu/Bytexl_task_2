require("dotenv").config();
const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();

const clientOrigin = process.env.CLIENT_URL;
app.use(cors(clientOrigin ? { origin: clientOrigin } : { origin: "*" }));
app.use(express.json());

const dbConfig = {
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD !== undefined ? process.env.DB_PASSWORD : "",
    database: process.env.DB_NAME || "studentdb2",
    port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306,
    ...(process.env.DB_SSL === "true" ? { ssl: { rejectUnauthorized: false } } : {})
};

// Use a connection pool for cloud and production resilience
const db = mysql.createPool({
    ...dbConfig,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Verify connection and ensure students2 table exists
db.getConnection((err, connection) => {
    if (err) {
        console.error("Database connection failed:", err.message);
    } else {
        console.log("MySQL connected successfully");
        const createTableSql = `
            CREATE TABLE IF NOT EXISTS students2 (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(100),
                age INT,
                mark INT,
                cgpa DECIMAL(3,2)
            );
        `;
        connection.query(createTableSql, (tableErr) => {
            connection.release();
            if (tableErr) {
                console.error("Error creating students2 table:", tableErr.message);
            } else {
                console.log("students2 table ready");
            }
        });
    }
});

app.post("/students2", (req, res) => {
    const { name, age, mark } = req.body;

    const parsedMark = Number(mark);
    const parsedAge = Number(age);
    const cgpa = (parsedMark / 10).toFixed(2);

    const sql = `
        INSERT INTO students2 (name, age, mark, cgpa)
        VALUES (?, ?, ?, ?)
    `;

    db.query(sql, [name, parsedAge, parsedMark, cgpa], (err, result) => {
        if (err) {
            console.error("Database insert error:", err);
            return res.status(500).json({
                message: "Database error",
                error: err.message
            });
        }

        res.json({
            message: "Student saved successfully",
            id: result.insertId,
            name: name,
            cgpa: Number(cgpa)
        });
    });
});

const path = require("path");
const fs = require("fs");

app.get("/health", (req, res) => {
    res.json({ status: "healthy", timestamp: new Date().toISOString() });
});

// Serve frontend static build if available (unified full-stack deployment)
const publicPath = fs.existsSync(path.join(__dirname, "public"))
    ? path.join(__dirname, "public")
    : path.join(__dirname, "../frontend2/dist");

if (fs.existsSync(publicPath)) {
    console.log(`Serving frontend static build from: ${publicPath}`);
    app.use(express.static(publicPath));
    app.get("*", (req, res, next) => {
        if (req.path.startsWith("/students2") || req.path === "/health") {
            return next();
        }
        res.sendFile(path.join(publicPath, "index.html"), (err) => {
            if (err) next();
        });
    });
} else {
    app.get("/", (req, res) => {
        res.send("Student API is working");
    });
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

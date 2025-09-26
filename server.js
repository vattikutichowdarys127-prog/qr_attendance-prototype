const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "Welcome123",
    database: "attendance_db"
});

db.connect(err => {
    if (err) throw err;
    console.log("✅ MySQL connected");
});

/* ---------- Students ---------- */
app.get("/api/students", (req, res) => {
    db.query("SELECT * FROM students", (err, rows) => {
        if (err) return res.status(500).json({ error: err });
        res.json(rows);
    });
});

app.post("/api/students", (req, res) => {
    const { roll, name, cls } = req.body;
    db.query("INSERT INTO students (roll, name, class) VALUES (?,?,?)",
        [roll, name, cls],
        err => {
            if (err) return res.status(500).json({ error: err });
            res.json({ success: true });
        });
});

/* ---------- Attendance ---------- */
app.get("/api/attendance", (req, res) => {
    db.query("SELECT * FROM attendance", (err, rows) => {
        if (err) return res.status(500).json({ error: err });
        res.json(rows);
    });
});

app.post("/api/attendance", (req, res) => {
    const { roll } = req.body;
    const today = new Date().toISOString().slice(0, 10);
    db.query("SELECT * FROM attendance WHERE roll=? AND date=?", [roll, today], (err, rows) => {
        if (err) return res.status(500).json({ error: err });
        if (rows.length > 0) {
            return res.json({ error: "Already marked today" });
        }
        db.query("INSERT INTO attendance (roll, date) VALUES (?,?)",
            [roll, today],
            err2 => {
                if (err2) return res.status(500).json({ error: err2 });
                res.json({ success: true });
            });
    });
});

app.listen(3000, () => console.log("✅ API running on http://localhost:3000"));

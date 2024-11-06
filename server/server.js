const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const app = express();

app.use(express.static(path.join(__dirname, "public")));
app.use(cors());
app.use(express.json());

const port = 5000;

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

app.get("/", (req, res) => {
  res.send("Welcome to Rate My University API");
});

app.get("/universities", (req, res) => {
  const q = "SELECT * FROM universities";
  db.query(q, (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
});

app.get("/students", (req, res) => {
  const q = "SELECT * FROM students";
  db.query(q, (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
});

app.get("/universities/:id", (req, res) => {
  const q = "SELECT * FROM universities WHERE UniversityID = ?";
  db.query(q, [req.params.id], (err, data) => {
    if (err) return res.json(err);
    return res.json(data[0]); // Return the first result (the university)
  });
});

app.post("/ratings", async (req, res) => {
  const {
    UniversityID,
    StudentID,
    RatingComment,
    StudentLife,
    ClassesTeachers,
    Cost,
    ReturnOnInvestment,
    DiningFood,
    DormsHousing,
    HealthSafety,
    CitySetting,
  } = req.body;

  try {
    // Use promise-based API with mysql2
    const [result] = await db.promise().query(
      `INSERT INTO Rating 
        (UniversityID, StudentID, RatingComment, StudentLife, ClassesTeachers, Cost, ReturnOnInvestment, DiningFood, DormsHousing, HealthSafety, CitySetting)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        UniversityID,
        StudentID,
        RatingComment,
        StudentLife,
        ClassesTeachers,
        Cost,
        ReturnOnInvestment,
        DiningFood,
        DormsHousing,
        HealthSafety,
        CitySetting,
      ]
    );

    // Respond with success and the new rating ID
    res.status(201).json({
      message: "Rating added successfully",
      ratingID: result.insertId,
    });
  } catch (error) {
    console.error("Error inserting rating:", error);
    res.status(500).json({ error: "Failed to add rating" });
  }
});

app.get("/universities/:id/ratings", async (req, res) => {
  const universityId = req.params.id;
  try {
    const [rows] = await db
      .promise()
      .query("SELECT * FROM Rating WHERE UniversityID = ?", [universityId]);
    res.json(rows); // Send back only ratings related to this university
  } catch (error) {
    console.error("Error fetching ratings:", error);
    res.status(500).json({ error: "Failed to fetch ratings" });
  }
});

app.listen(port, () => {
  console.log("Connect to backend.");
});

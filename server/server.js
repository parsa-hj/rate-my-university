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

db.connect((err) => {
  if (err) {
    console.error("Database connection failed:", err);
    return;
  }
  console.log("Connected to MySQL database.");
});

app.get("/", (req, res) => {
  res.send("Welcome to Rate My University API");
});

app.get("/universities", (req, res) => {
  const { name } = req.query;
  let q = "SELECT * FROM universities";

  if (name) {
    q += " WHERE name LIKE ?";
  }

  db.query(q, [`%${name}%`], (err, data) => {
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

app.get("/avgscores", (req, res) => {
  const q = "SELECT * FROM category";
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

app.get("/ratings/:id", (req, res) => {
  const q = "SELECT * FROM rating WHERE RatingID = ?";
  db.query(q, [req.params.id], (err, data) => {
    if (err) return res.json(err);
    return res.json(data[0]); // Return the first result (the university)
  });
});

app.delete("/ratings/:id", (req, res) => {
  const q = "DELETE FROM rating WHERE RatingID = ?";
  db.query(q, [req.params.id], (err, data) => {
    if (err) return res.json(err); // Handle any errors
    if (data.affectedRows > 0) {
      return res.json({ message: "Rating deleted successfully" });
    } else {
      return res.status(404).json({ message: "Rating not found" });
    }
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
    // Insert the new rating into the Rating table
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

    // Calculate new averages for the university
    const [averages] = await db.promise().query(
      `SELECT 
         AVG(StudentLife) AS AvgStudentLife,
         AVG(ClassesTeachers) AS AvgClassesTeachers,
         AVG(Cost) AS AvgCost,
         AVG(ReturnOnInvestment) AS AvgReturnOnInvestment,
         AVG(DiningFood) AS AvgDiningFood,
         AVG(DormsHousing) AS AvgDormsHousing,
         AVG(HealthSafety) AS AvgHealthSafety,
         AVG(CitySetting) AS AvgCitySetting
       FROM Rating
       WHERE UniversityID = ?`,
      [UniversityID]
    );

    // Update the category table with the new averages
    const {
      AvgStudentLife,
      AvgClassesTeachers,
      AvgCost,
      AvgReturnOnInvestment,
      AvgDiningFood,
      AvgDormsHousing,
      AvgHealthSafety,
      AvgCitySetting,
    } = averages[0]; // The result of the averages query

    await db.promise().query(
      `UPDATE category
       SET 
         AvgStudentLife = ?,
         AvgClassesTeachers = ?,
         AvgCost = ?,
         AvgReturnOnInvestment = ?,
         AvgDiningFood = ?,
         AvgDormsHousing = ?,
         AvgHealthSafety = ?,
         AvgCitySetting = ?
       WHERE UniversityID = ?`,
      [
        AvgStudentLife,
        AvgClassesTeachers,
        AvgCost,
        AvgReturnOnInvestment,
        AvgDiningFood,
        AvgDormsHousing,
        AvgHealthSafety,
        AvgCitySetting,
        UniversityID,
      ]
    );

    // Respond with success and the new rating ID
    res.status(201).json({
      message: "Rating added successfully and averages updated",
      ratingID: result.insertId,
    });
  } catch (error) {
    console.error("Error inserting rating or updating averages:", error);
    res.status(500).json({ error: "Failed to add rating or update averages" });
  }
});

app.get("/universities/:id/averages", async (req, res) => {
  const universityId = req.params.id; // Get the university ID from the URL params
  try {
    const [rows] = await db.promise().query(
      `
      SELECT 
        category.AvgStudentLife, 
        category.AvgClassesTeachers, 
        category.AvgCost, 
        category.AvgReturnOnInvestment, 
        category.AvgDiningFood, 
        category.AvgDormsHousing, 
        category.AvgHealthSafety, 
        category.AvgCitySetting
      FROM category
      WHERE category.UniversityID = ?
    `,
      [universityId]
    );

    if (rows.length === 0) {
      return res
        .status(404)
        .json({ error: "No averages found for this university" });
    }

    res.json(rows[0]); // Return the averages for the specific university
  } catch (error) {
    console.error("Error fetching university averages:", error);
    res.status(500).json({ error: "Failed to fetch university averages" });
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

app.get("/students/:id/ratings", async (req, res) => {
  const studentId = req.params.id;
  try {
    const [rows] = await db
      .promise()
      .query("SELECT * FROM Rating WHERE StudentID = ?", [studentId]);
    res.json(rows); // Send back only ratings related to this university
  } catch (error) {
    console.error("Error fetching ratings:", error);
    res.status(500).json({ error: "Failed to fetch ratings" });
  }
});

app.listen(port, () => {
  console.log("Connect to backend.");
});

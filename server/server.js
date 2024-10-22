const express = require("express");
const mysql = require("mysql");
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

app.listen(port, () => {
  console.log("Connect to backend.");
});

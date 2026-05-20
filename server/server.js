require("dotenv").config();

const express = require("express");

// backend permission for browser (security purpose)
const cors = require("cors");

const db = require("./config/db");

// connecting route to the server
const authRoutes = require("./routes/authRoutes");
// imports a routhe module from a local file located at ./routes/userRoutes.js
const userRoutes = require("./routes/userRoutes");

const app = express();

app.use(cors());
app.use(express.json());


// connecting route to the server
app.use("/api/auth", authRoutes);

// mounts that router at the api/users path
app.use("/api/users", userRoutes);

app.get("/", (req, res) => {
    res.send("Clinic API running");
});

app.listen(5000, () => {
    console.log("Server running on port 5000");
});
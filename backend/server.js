const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/auth");

console.log("AUTH ROUTE LOADED");

const app = express();

const tripRoutes = require("./routes/trip");

app.use("/api/trips", tripRoutes);
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("TripMate API");
});

app.use("/api/auth", authRoutes);

console.log("AUTH ROUTE REGISTERED");

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
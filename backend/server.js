const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/auth");
const tripRoutes = require("./routes/trip");

const app = express();

require("./db");

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("TripMate API");
});

app.use("/api/auth", authRoutes);
app.use("/api/trips", tripRoutes);

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
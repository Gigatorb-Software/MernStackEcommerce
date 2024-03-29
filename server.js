const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const postRoutes = require("./routes/posts.js");

// Load all environment variables:
dotenv.config();

// Instantiate the application:
const app = express();

// Setup the middlewares:
app.use(bodyParser.json({ limit: "30mb", extended: true }))
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }))
app.use(cors());

// Instruct express to also serve built React client application:
app.use(express.static("./client/build"));

// Routes:
app.use("/posts", postRoutes);

// Configuration:
app.set("port", process.env.PORT || 5000);

const CONNECTION_URL = process.env.DB || "mongodb://localhost:27017/memories";
const PORT = process.env.PORT || 5000;

mongoose.connect(
  CONNECTION_URL,
  { useNewUrlParser: true, useUnifiedTopology: true }
).then(() => {
  app.listen(PORT, () => {
    console.log(`Server Running on Port: http://localhost:${PORT}`);
  });
}).catch((error) => {
  console.log(`${error} did not connect`);
});

mongoose.set("useFindAndModify", false);

app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
});

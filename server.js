const express = require("express");
const connectDB = require("./config/db");
const path = require("path");
const bodyParser = require("body-parser");
const morgan = require('morgan');

require("dotenv").config({
  path: path.join(__dirname, "./.env"),
});

const app = express();

// Connect Database
connectDB();

// Init Middleware
app.use(express.json({ extended: false }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Define Routes
app.use("/api/users", require("./routes/api/users"));
app.use("/api/product", require("./routes/api/product"));
app.use("/api/catalogs", require("./routes/api/catalogs"));

// Serve static assets in production
if (process.env.NODE_ENV === "production") {
  // Set static folder
  app.use(express.static("client/build"));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

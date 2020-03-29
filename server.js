require("dotenv").config();
const express = require("express");
const compression = require("compression");
const routes = require("./routes");
const logger = require("morgan");
const PORT = process.env.PORT || 3001;

function shouldCompress(req, res) {
  if (req.headers["x-no-compression"]) {
    // don't compress responses with this request header
    return false;
  }
  // fallback to standard filter function
  return compression.filter(req, res);
}

const app = express();

// Define middleware here
app.use(logger("dev"));
app.use(compression({ filter: shouldCompress }));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Serve up static assets (usually on heroku)
if (process.env.NODE_ENV === "production") {
  console.log("PRODUCTION BUILD!");
  app.use(express.static("client/build"));
} else {
  console.log("DEV BUILD");
}

app.use(routes);

app.listen(PORT, () => {
  console.log(`Now listening on http://localhost:${PORT}`);
});

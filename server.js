require("dotenv").config();
const express = require("express");
require("express-async-errors");
const compression = require("compression");
const routes = require("./routes");
const logger = require("morgan");
const { errorHandler } = require("./utils/middleware");
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
app.use(compression({ filter: shouldCompress }));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(logger("dev"));

// Serve up static assets (usually on heroku)
if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));
}

app.use(routes);
app.use(errorHandler);


app.listen(PORT, () => {
  console.log(`Now listening on http://localhost:${PORT}`);
});

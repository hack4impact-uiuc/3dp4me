const express = require('express')
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const { errorHandler } = require("./utils");

app.use(cors());
app.use(bodyParser.json());
app.use(require("./routes"));
app.use(errorHandler);

module.exports = app;

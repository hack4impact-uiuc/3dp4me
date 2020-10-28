import { uploadFile } from './utils/aws/aws-s3-helpers'

const express = require('express')
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const { errorHandler } = require("./utils");

app.use(cors());
app.use(bodyParser.json());
app.use(require("./routes"));
app.use(errorHandler);
app.listen(8000, () => uploadFile());

module.exports = app;

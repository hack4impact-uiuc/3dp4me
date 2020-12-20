require("dotenv").config();
const mongoose = require("mongoose");
const express = require("express");
const fileUpload = require("express-fileupload");
var cors = require("cors");
const bodyParser = require("body-parser");
const { errorHandler } = require("./utils");

const app = express();
app.use(cors());
app.use(errorHandler);
app.use(fileUpload({
    createParentPath: true,
}));

mongoose.connect(process.env.DB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

mongoose.connection
    .once("open", () => console.log("Connected to the database!"))
    .on("error", error => console.log("Error connecting to the database: ", error));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(require("./routes"));

module.exports = app;

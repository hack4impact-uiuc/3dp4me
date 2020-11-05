require("dotenv").config();
const mongoose = require("mongoose");
const express = require("express");
var cors = require("cors");
const bodyParser = require("body-parser");
const { errorHandler } = require("./utils");
const aws = require("./utils/aws/aws-s3-helpers");

const app = express();
app.use(cors());
app.use(errorHandler);

// mongoose.connect(process.env.DB_URI, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
// });

// mongoose.connection
//     .once("open", () => console.log("Connected to the database!"))
//     .on("error", error => console.log("Error connecting to the database: ", error));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(require("./routes"));

app.listen(3000, () => {
    console.log(`Example app listening at http://localhost:${3000}`)
    aws.uploadFile("10011", "test2.txt", "ASIA2CPQRHMYOZN5K6FT", "ONkoquRLVXpjRcVXZ/495tYykPNzdkw7UUOc0BWE")
})

module.exports = app;

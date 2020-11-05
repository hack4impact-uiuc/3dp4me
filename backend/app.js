require("dotenv").config();
const mongoose = require("mongoose");
const express = require("express");
<<<<<<< HEAD
const fileUpload = require("express-fileupload");
=======
>>>>>>> origin/aws-backend-auth
var cors = require("cors");
const bodyParser = require("body-parser");
const { errorHandler } = require("./utils");
const aws = require("./utils/aws/aws-s3-helpers");

<<<<<<< HEAD

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
=======
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
>>>>>>> origin/aws-backend-auth

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(require("./routes"));
<<<<<<< HEAD

app.listen(process.env.PORT, () =>
    console.log(`Example app listening on port ${process.env.PORT}!`),
);
=======
>>>>>>> origin/aws-backend-auth

module.exports = app;

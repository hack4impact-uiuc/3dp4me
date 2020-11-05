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

app.listen(3001, () => {
    console.log(`Example app listening at http://localhost:${3000}`)
    aws.downloadFile("public/test2.txt", { accessKeyId: "ASIA2CPQRHMYCJ3FG56M", sessionToken: "IQoJb3JpZ2luX2VjEIn//////////wEaCXVzLWVhc3QtMiJIMEYCIQCkTueBAAzqWLRP8huGM6qYOxEbKPjvj2HG/dDBCh9fTQIhAMMP6Znii7mxQwGgrz9nVHWlt14QoF5lBOQtdPRWuD3hKs0ECOL//////////wEQABoMNjkyNTMxMDUxMzEyIgy0lEmYWmJCVq1nHaEqoQTiFb5CQhI1pilggTrHumwuBEdYl8fnkv3/dTiFe+nO9N9Shgjip7zNLC81eGdB6+z5hV6cPKY7my8wDVRiDMyiHC3pEn3xL3AMmYlaqJwAHSv+SXSpyrtqIowixJzkvOUFvLWQtJHFrZBZObIbLZrbfsYKiWIv/puVIXxUwuAM+F5ZLSJ9mce+7WkiTVqjxjkBfzvxrjyMNDSR8UnDuy4XUHwdp6amgYnY1XwyEjHjtzBlKZpUrHbKEC9s8gaYOhx5aPEU0i+v1jx7eSPOPlp4Bfj4t+HhsMsolQN9v0Fl9J18U/Izo/t4w0RXWPKNzys4eF+Sxc+aQDpfMqKR/SRF5Asvm8i3iIZZErLYE5MRI/TfXLHyaOksOQ+q6Zw6qstNBEJPEBl/PnHwJA+at/mz2boZuBFowDNszcH1RpmfN6KRYRXUI90+YrVDxT8XSEeFiyNZsBdKm87bMukWhOdiGXyQatQIiWxEb7bX/nSRk29WttxnQPA6NgcNx4WHVUUabdDysLjAS8SonGg5LsUPdsiXDPETg2dZf9FKoQT1nSwUiq0mjeqkVlCvbpY1AOd1EgRkiQHw+G1RhbT5Pmie4tE1ZV5wQGT6/SMMKoyeoby9elUO68RNuIHaPu1lxQveWb5wSD5kVoDukHNd9Rb1UTsNh/BLlQC4VHnYHpp9DAPN8UGL543I+mKRu1iECVJ7OskllXHMQuZB/ORle59uUzDDoY39BTqEAm6kvgIOOgBAPXybkKBBJg+4BcHWjOQLK33l+AAbXghsMwzU4UNLyqmvl/g089qij4/hPdpQqitgeZubo0bEVtFkJ8Q+wzPni5tPGHdasL3qDNIq1i90kYFQSM2iH9vOwPRoU1grUVvloxkYEakU2EkcRA8YJQMm1Bj9BUlfZqeJaOXJSVTx34doq3pZm2dRYprpSIAvVMQCtRVj3jVC4S7w1cEnoOIN3IcRgrQE/86YugwCSJZxqQSlR8eIc/bwOdzxFd6/XiFvoGSYqIugnGm7ThAzrLlZ4VwjwkAexgFQZmpHVplXHqx8NxMxYXq952gNw4Q1cLiH72UEgxDgZENOldi7", secretAccessKey: "Al/7toTHw48b5Krtyf5syVQBHQaPtJ14jzV5pILw", identityId: "us-east-2:672ec059-db5d-4fff-b509-3e42c5988f87", authenticated: true })
})

module.exports = app;

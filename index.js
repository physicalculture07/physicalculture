const express = require('express');
const bodyParser = require('body-parser');

const cors = require("cors");
const path = require('path')
const fs = require("fs");
const http = require("http");
var https = require("https");
const mongoose = require('mongoose');

require('dotenv').config({ path: path.resolve(__dirname, './.env') });
const apiRoRouter = require("./src/routes/api")
const adminRouter = require("./src/routes/admin")

const app = express();

mongoose.connect(process.env.DB_CONNECTION_URL).then(() => {
    console.log("Connected to DB");
})

app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));
app.use("/uploads", express.static(path.join(__dirname, '../uploads')));
app.use("/", apiRoRouter)
app.use("/admin/", adminRouter)

process.on('uncaughtException', (err) => {
    console.log(`Uncaught Exception`);
  });
  
  // Global error handler for unhandled promise rejections
  process.on('unhandledRejection', (reason, promise) => {
    console.log('Unhandled Rejection:');
  });


const options = {
    key: fs.readFileSync(path.join(__dirname, 'certificates', 'private.key')),
    cert: fs.readFileSync(path.join(__dirname, 'certificates', 'certificate.crt')),
    ca: fs.readFileSync(path.join(__dirname, 'certificates', 'ca_bundle.crt'))
};

//https.createServer(app);
https.createServer(options, app).listen(process.env.PORT, () => {
    console.log('Server is running', process.env.PORT);
})

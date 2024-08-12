const express = require('express');
const bodyParser = require('body-parser');

const cors = require("cors");
const path = require('path')
// const fs = require("fs");
const http = require("http");
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



http.createServer(app).listen(process.env.PORT, () => {
    console.log('Server is running');
})
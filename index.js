//import section
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require('body-parser');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const _ = require('lodash');
require('dotenv').config();//to use env variables
const helmet = require("helmet");
const compression = require("compression");
var multer = require('multer');


//DB connection
mongoose.connect("mongodb://localhost:27017");
mongoose.connection.on("connected", () => {
	console.log("DB connected");
});
mongoose.connection.on("error", (err) => {
	console.log("mongodb failed with", err);
});
//import routes
const routerAuth = require("./routes/auth.routes");
const routerUser = require("./routes/user.routes");
const routerDoc = require("./routes/doc.routes");

//middleware
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(helmet());
app.use(compression());
app.use(express.json({limit: '50mb'}));



// enable files upload
app.use(fileUpload({
    createParentPath: true
}));

//routes middleware
app.use("/auth", routerAuth);
app.use("/user", routerUser);
app.use("/doc", routerDoc);

//server listening
const port = 5000;

app.use(express.static('uploads'));


/////////tests////////
app.listen(port, () => {
	console.log(`Example app listening on port ${port}`);
});



app.set('view-engine','ejs')
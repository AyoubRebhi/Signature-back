//import section
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require('body-parser');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const _ = require('lodash');
const User=require('./models/user.models');
const Doc=require('./models/doc.models');
const helmet = require("helmet");
const compression = require("compression");


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
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(helmet());
app.use(compression());



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

//login User
app.get('/login',(req,res)=>{
	res.render('login.ejs',);
});
app.post('/login',(rep,res)=>{

})
//forgot password
app.get('/forgot',(req,res)=>{
	res.render('forgot.ejs',);
});
//register of user

//upload files




app.set('view-engine','ejs')
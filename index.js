//import section
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require('body-parser');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const _ = require('lodash');

//DB connection
mongoose.connect("mongodb://localhost:27017");
mongoose.connection.on("connected", () => {
	console.log("DB connected");
});
mongoose.connection.on("error", (err) => {
	console.log("mongodb failed with", err);
});
//import routes
const authRoutes = require("./routes/auth.routes");
const userRoutes = require("./routes/user.routes");
const docRoutes = require("./routes/doc.routes");

//middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());


// enable files upload
app.use(fileUpload({
    createParentPath: true
}));

//routes middleware
app.use("/auth", authRoutes);
app.use("/user", userRoutes);
app.use("/doc", docRoutes);

//server listening
const port = 8000;

app.use(express.static('uploads'));


//tests
app.listen(port, () => {
	console.log(`Example app listening on port ${port}`);
});

// app.get('/',(req,res)=>{
// 	res.render('index.ejs', { user: 'youbi'})
// })
app.get('/login',(req,res)=>{
	res.render('login.ejs',)
});

app.get('/register',(req,res)=>{
	res.render('register.ejs',)
})
app.post('/register',(req,res)=>{
    req.body.email
})
//methode youtube
app.get('/',(req,res)=>{
	res.render('upload.ejs',)
	res.sendFile(__dirname +'/views/upload.ejs')
	console.log(req.files);
})

app.post('/', function(req, res) {

	if(req.files) {
		console.log(req.files);
		var file= req.files.file;
		var filename= file.name;
		console.log(filename);
	}
	
})



app.set('view-engine','ejs')
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
//server listening
const port = 8000;

app.use(express.static('uploads'));

app.post('/upload-avatar', async (req, res) => {
    try {
        if(!req.files) {
            res.send({
                status: false,
                message: 'No file uploaded'
            });
        } else {
            //Use the name of the input field (i.e. "avatar") to retrieve the uploaded file
            let avatar = req.files.avatar;
            
            //Use the mv() method to place the file in upload directory (i.e. "uploads")
            avatar.mv('./uploads/' + avatar.name);

            //send response
            res.send({
                status: true,
                message: 'File is uploaded',
                data: {
                    name: avatar.name,
                    mimetype: avatar.mimetype,
                    size: avatar.size
                }
            });
        }
    } catch (err) {
        res.status(500).send(err);
    }
});

app.post('/upload-photos', async (req, res) => {
    try {
        if(!req.files) {
            res.send({
                status: false,
                message: 'No file uploaded'
            });
        } else {
            let data = []; 
    
            //loop all files
            _.forEach(_.keysIn(req.files.photos), (key) => {
                let photo = req.files.photos[key];
                
                //move photo to uploads directory
                photo.mv('./uploads/' + photo.name);

                //push file details
                data.push({
                    name: photo.name,
                    mimetype: photo.mimetype,
                    size: photo.size
                });
            });
    
            //return response
            res.send({
                status: true,
                message: 'Files are uploaded',
                data: data
            });
        }
    } catch (err) {
        res.status(500).send(err);
    }
});

//tests
app.listen(port, () => {
	console.log(`Example app listening on port ${port}`);
});

app.get('/',(req,res)=>{
	res.render('index.ejs', { user: 'youbi'})
})
app.get('/login',(req,res)=>{
	res.render('login.ejs',)
})
app.post('/login',(req,res)=>{
    
})
app.get('/register',(req,res)=>{
	res.render('register.ejs',)
})
app.post('/register',(req,res)=>{
    req.body.email
})
app.post('/upload', function(req, res) {
	console.log(req.files.foo); // the uploaded file object
})

app.get('/',(req,res)=>{
	res.sendFile(__dirname +'/views/index.ejs')
})

app.set('view-engine','ejs')
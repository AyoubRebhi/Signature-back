const mongoose= require('mongoose');

//connect to db 
mongoose.connect(process.env.DATABASE, {
    useNewUrlParser:true,
    useFindAndModify:true,
    useCreateIndex,
    useUnifiedTopology:true
}).then(()=>console.log("DB connected established"))
.catch(err => console.log("DB connection error",err));
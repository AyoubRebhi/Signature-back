//import section
const express = require("express");
const app = express();
const mongoose = require("mongoose");
//DB connection
mongoose.connect("mongodb+srv://youbi2012M:123456789Bestfriend@cluster0.4yv5m.mongodb.net/?retryWrites=true&w=majority");
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
app.use(express.urlencoded({ extended: false }));

//routes middleware
app.use("/auth", authRoutes);
app.use("/user", userRoutes);
//server listening
const port = 8000;

app.listen(port, () => {
	console.log(`Example app listening on port ${port}`);
});
const express = require("express");
const dbConnect = require("./config/dbConnect");
const app = express();
const dotenv =  require("dotenv").config();
const PORT = process.env.PORT || 4000;
const authRoute= require("./routes/routesAuth");
const bodyParser = require("body-parser");
const { notFound, errorHandler } = require("./middlewares/errorHandler");
dbConnect();
app.use(bodyParser.json()); //body-parser was popular in middleware of earlier version of express
//in latest you can use express.json() and express.urlencoded() directly
app.use(bodyParser.urlencoded({extended: false}));

app.use('/api/user', authRoute);
// app.use('/',(req,res)=>{
//     res.send("Hello this is server side");
// })
app.use(notFound);
app.use(errorHandler);
app.listen(PORT, ()=>{
    console.log(`Server is running at PORT ${PORT}`);
})

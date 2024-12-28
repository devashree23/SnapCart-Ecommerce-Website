const express = require("express");
const dotenv =  require("dotenv")
const bodyParser = require("body-parser");
const cookieParser= require("cookie-parser");
const morgan= require("morgan");
const slugify= require("slugify");


// Routes

const authRoute= require("./routes/routesAuth");
const productRoute= require("./routes/productRoute");
const dbConnect = require("./config/dbConnect");

const { notFound, errorHandler } = require("./middlewares/errorHandler");


const app = express();

dotenv.config();

dbConnect();

const PORT = process.env.PORT || 4000;



app.use(morgan("dev"));
app.use(bodyParser.json()); //body-parser was popular in middleware of earlier version of express
//in latest you can use express.json() and express.urlencoded() directly
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());


// app.use('/',(req,res)=>{
//     res.send("Hello this is server side");
// })

app.use('/api/user', authRoute);
app.use('/api/product', productRoute);



app.use(errorHandler);
app.use(notFound);


app.listen(PORT, ()=>{
    console.log(`Server is running at PORT ${PORT}`);
})

const express = require("express");
const dotenv =  require("dotenv")
const bodyParser = require("body-parser");
const cookieParser= require("cookie-parser");
const morgan= require("morgan");
const slugify= require("slugify");

dotenv.config();

const app = express();



const PORT = 6000;




// Routes

const authRoute= require("./routes/routesAuth");
const productRoute= require("./routes/productRoute");
const blogRoute= require("./routes/blogRoute");
const categoryRoute= require("./routes/prodCategoryRoute");
const blogCategoryRoute= require("./routes/blogCatRoutes");
const brandRoute= require("./routes/brandRoutes");
const couponRoute= require("./routes/couponRoutes");
const dbConnect = require("./config/dbConnect");


dbConnect();
const { notFound, errorHandler } = require("./middlewares/errorHandler");



//const PORT = process.env.PORT || 4000;


app.use(morgan("dev"));
app.use(bodyParser.json()); //body-parser was popular in middleware of earlier version of express
//in latest you can use express.json() and express.urlencoded() directly
app.use(bodyParser.urlencoded({extended: false}));

//app.use(express.json()); //this tells express to automatically convert the data in the req body into a JS obj
//app.use(express.urlencoded({extended:false})); //
//extended: true-> allows nested obj & arrays
//extended: true-> only allows simple key-value pairs
app.use(cookieParser());


// app.use('/',(req,res)=>{
//     res.send("Hello this is server side");
// })

app.use('/api/user', authRoute);
app.use('/api/product', productRoute);
app.use('/api/blog', blogRoute);
app.use('/api/prodCategory', categoryRoute);
app.use('/api/blogCategory', blogCategoryRoute);
app.use('/api/brandCategory', brandRoute);
app.use('/api/coupon', couponRoute);



app.use(errorHandler);
app.use(notFound);


app.listen(PORT, ()=>{
    console.log(`Server is running at PORT ${PORT}`);
})

const cloudinary= require("cloudinary");

const dotnev = require("dotenv");

dotnev.config();

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME, 
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_SECRET_KEY,
});

const cloudinaryUploadImg= async(fileToUploads) => {
    return new Promise((resolve) => {
        cloudinary.uploader.upload(fileToUploads, (result)=>{
            resolve({
                url: result.secure_url,
            },{
                resource_type:"auto",
            })
        })
    })
};

module.exports= {cloudinaryUploadImg};
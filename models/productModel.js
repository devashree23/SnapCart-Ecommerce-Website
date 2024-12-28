const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var productSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true,
        trim:true,
    },
    //slug is a string that is used to uniquely idnetify a resource in URL friendly way
    //typically used in URL to identify specific page or post in a website
    slug:{
        type: String,
        required: true,
        unique: true,
        lowercase: true,
    },
    description:{
        type:String,
        required:true,
    },
    price:{
        type: Number,
        required:true,
    },
    category:{
        type: String,
        required: true,
        // type:mongoose.Schema.Types.ObjectId,
        // ref:"Category",
    },
    quantity:{ 
        type: Number,
        required: true,
    },
    images:{
        type: Array,
    },
    color:{
        type: String,
        required: true,
        //enum: ['Black','Red','Brown'],
    },
    rating:[
        {
            star: Number,
            postedBy: {
                type: mongoose.Schema.Types.ObjectId, 
                ref: "User",
            },
        },
    ],
    brand:{
        type: String,
        required: true,
        //enum:["Apple", "Samsung", "Lenovo"],
    },
    sold:{
        type: Number,
        default: 0,
    }
},
{
    timestamps: true,
}

);

//Export the model
module.exports = mongoose.model('Product', productSchema);
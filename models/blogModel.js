const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var blogSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true,
    },
    description  :{
        type:String,
        required:true,
        unique:true,
    },
    category:{
        type:String,
        required:true,
        unique:true,
    },
    numViews:{
        type:String,
        required:true,
    },
    isLiked:{
        type: Boolean,
        default: false,
    },
    isDisliked:{
        type: Boolean,
        default: false,
    },
    likes:[{
        type: mongoose.Schema.Types.ObjectId,
        reference: "User",

    }],
    dislikes:[{
        type: mongoose.Schema.Types.ObjectId,
        reference: "User",
    }],
    image:{
        type:String,
        default: "https://thumbs.dreamstime.com/b/blogging-blog-concepts-ideas-worktable-blogging-blog-concepts-ideas-white-worktable-110423482.jpg"
    },
    author:{
        type: String,
        default: "Admin",
    },
},{
    toJSON:{
        virtuals: true,
    },
    toObject:{
        virtuals: true,
    },
    timestamps: true,
});

//Export the model
module.exports = mongoose.model('User', userSchema);
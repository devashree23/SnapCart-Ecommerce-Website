const mongoose = require('mongoose'); // Erase if already required
const bcrypt= require('bcrypt');
const crypto= require('crypto');
// Declare the Schema of the Mongo model
var userSchema = new mongoose.Schema({
    firstname:{
        type:String,
        required:true,
    
    },
    lastname:{
        type:String,
        required:true, 
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    mobile:{
        type:String,
        required:true,
        unique:true,
    },
    password:{
        type:String,
        required:true,
    },
    role:{
        type: String,
        enum:["user", "admin"],
        default: "admin",
    },
    isBlocked:{
        type:Boolean,
        default: false,
    },
    cart:{
        type: Array,
        default: [],
    },
    //address: [{type: mongoose.Schema.Types.ObjectId , ref: "Address"}],
    address: {
        type: String,
    },
    wishlist: [{type: mongoose.Schema.Types.ObjectId , ref: "Product"}],
    refreshToken:{
        type: String,
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
},{
    timestamps: true,
}
);

userSchema.pre('save',async function(next){
    if(!this.isModified("password")){
        next();
    }

    const salt= await bcrypt.genSaltSync(10);
    this.password= await bcrypt.hash(this.password,salt);

    next();
});


userSchema.methods.isPasswordMatched= async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.methods.createPasswordResetToken=async function () {
    const resetPassword= crypto.randomBytes(16).toString("hex");
    this.passwordResetToken=crypto.createHash('sha256').update(resetPassword).digest('hex');
    this.passwordResetExpires= Date.now()+30*60*1000; //10 mins
    return resetPassword;
};

//Export the model
module.exports = mongoose.model('User', userSchema);
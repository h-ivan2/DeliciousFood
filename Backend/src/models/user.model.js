const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt    = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
    name: {
        type:String,
        required : [true, 'Name is requuired'],
        trim: true,
    },
    email: {
        type:String,
        required: [true, 'Email is required'],
        trim: true,
        lowercase: true,
        trim: true,
    },

    password: {
        type: String,
        required: true,
        minlength: 8,
        select: false,
    },
    role: {
        type: String,
        enum: ['customer','owner','admin'],
        default: 'customer',
    },
    phone : {
        type: String,
        trim: true,
    },
     avatar: {
        public_id: String,
        url :      String,
     },
     isActive: {
        type: Boolean,
        default: true,
     },
     resetPasswordToken: String,
     resetPasswordExpire: Date,
}, {timestamps: true});

userSchema.pre('save',async function (next) {
    if(!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password,12);
        next();
    });

userSchema.methods.comparePassword = async function (candidate) {
    return bcrypt.compare(candidate,this.password);  
};

userSchema.methods.getSignedToken = function(){
    return jwt.sign(
        { id: this._id,role: this.role },
        process.env.JWT_SECRET,
        {expiresIn: process.env.JWT_EXPIRE || '30d'}
    );
};

userSchema.methods.getResetPasswordToken= function(){
    const crypto = require('crypto');
    const resetToken= crypto.randomBytes(20).toString('hex');

    this.resetPasswordToken=crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');

    this.resetPasswordExpire = Date.now() + 10*60*1000;

    return resetToken;
}

module.exports = mongoose.model('User',userSchema)

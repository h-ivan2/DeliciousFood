const mongoose = require ('mongoose');

const restaurantSchema = new mongoose.Schema({
    owner : {
        type : mongoose.Schema.Types.ObjectId,
        ref:   'User',
        required: true,
    },

    name: {
        type: String,
        required: [true,'Restaurant name is required'],
        trim : true,
    },

    description: {
        type: String,
        trim: true,

    },
    cuisine: [{ type: String, trim: true}],
    address: {
        street: {type: String, required: true},
        city: {type: String, required: true},
        state: String,
        zipCode: String,
        Country: {type: String, default:'Rwanda'},
    },
    phone: String,
    email: String,
    logo :{
        public_id: String,
        url:    String,
    },
    coverImage:{
        public_id: String,
        url:  String,
    },
    status: {
        type: String,
        enum: ['pending','approved','rejected','suspended'],
        default:'pending',
    },

    isOpen: {
        type: Boolean,
        default: false,
    },
    rating: {
        type: Number,
        default: 0,
        min:    0,
        max:    5, 
    },
    reviewCount : {
        type: Number,
        default: 0,
    },
    deliveryFee : {
        type: Number,
        default: 0,
    },
    minOrderAmount: {
        type: Number,
        default: 0,

    },
    estimatedDeliveryTime: {
        type: Number,
        default: 30,
    },
    priceRange :{
        type: String,
        enum:   ['$','$$','$$$','$$$$'],
        default: '$$',
    },
}, {timestamps: true});

restaurantSchema.index({name: 'text', description: 'text', cuisine: 'text'});

module.exports=mongoose.model('Restaurant',restaurantSchema);
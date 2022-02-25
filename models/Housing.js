const mongoose = require('mongoose');

// така правим create offer

let housingSchema = new mongoose.Schema({
    name: {
        type: String,
        minlength: 6,
        required: true,
    },
    type: {
        type: String,
        enum: ['Apartment', 'Villa', 'House'],
        required: true,
    },
    year: {
        type: Number,
        required: true,
        min: 1850,
        max: 2021,
    },
    city: {
        type: String,
        minlength: 4,
        required: true,
    },
    image: {
        type: String,
        required: true,
        validate: /^https?:\/\//i, // валидации от стр. 11
    },
    description: {
        type: String,
        required: true,
        max: 60,
    },
    availablePieces: {
        type: Number,
        required: true,
        min: 0,
        max: 10,
    },
    tenants: [{
            type: mongoose.Types.ObjectId,
            ref: "User",
        }],
    owner: {
        type: mongoose.Types.ObjectId,
        ref: 'User'
    },
});

housingSchema.method('getTenants', function(){
    return this.tenants.map( x => x.name).join(', ')
});

let Housing = mongoose.model('Housing', housingSchema);
module.exports = Housing;
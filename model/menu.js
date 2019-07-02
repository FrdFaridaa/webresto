const mongoose = require('mongoose');
const menuSchema = mongoose.Schema({
    kodemenu      : {type: String, unique: true},
    namamenu     	: String,
    tipemenu 	    : String,
    harga	        : String,
    foto            : String,
    created_at		: String
});
module.exports = mongoose.model('menu', menuSchema);

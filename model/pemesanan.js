const mongoose = require('mongoose');
const pemesananSchema = mongoose.Schema({
    kodepemesanan   : {type: String, unique: true},
    kodemenu     	: String,
    qty             : String,
    total           : String,
    created_at		: String
});
module.exports = mongoose.model('pemesanan', pemesananSchema);

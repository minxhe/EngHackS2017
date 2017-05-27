var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var phoneSchema = new Schema({
  phoneNumber: { type: String, required: true }
});

module.exports = mongoose.model('Subscriber', phoneSchema);

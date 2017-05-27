var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var EventSchema = new Schema({
  location: { type: String, required: true},
  roomNumber: { type: String, required: true},
  startingTime: { type: Date, required: true},
  endingTime: { type: Date, required: false},
  servingSize: { type: Number },
  foodType: { type: String, required: true},

  //if an event is 2 hours passed its starting time it will be marked as expired and will be deleted upon next user call
  expiringTime: { type: Date, required: true},
  state: {
    upcoming: { type: Boolean, required: true, default: true},
    ongoing: { type: Boolean, required: true, default: false},
    expired: { type: Boolean, required: true, default: false}
  },

  upvotes: { type: Number, default: 0},
  downvotes: { type: Number, default: 0}

});

module.exports = mongoose.model('freeEvent', EventSchema);

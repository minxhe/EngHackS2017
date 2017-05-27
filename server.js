var express = require('express');
var bodyParser = require('body-parser');
var router = express.Router();
var routes = require('./server/api.js')(router);
var mongoose = require('mongoose');
var twilio = require('twilio');
var accountSid = 'AC5bfaf857260b1a76467e05c406dca4ed'; // Your Account SID from www.twilio.com/console
var authToken = 'e7b6045c47f6e3aa5d09e1eb93e7eea7';   // Your Auth Token from www.twilio.com/console
var app = express();

app.set('port', (process.env.PORT || 9005));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use('/api',routes);
app.use(express.static(__dirname));

var client = new twilio(accountSid, authToken);

app.get('/sendMessage', function(){
  console.log("sending message");
  client.messages.create({
      body: 'Hello send nudes',
      to: '+16475229738',  // Text this number
      from: '+16475591551' // From a valid Twilio number
  })
  .then(function(message){
    console.log(message.sid);
  });
});

mongoose.connect('mongodb://minxhe:123456@ds155811.mlab.com:55811/enghack2017', function(err){
  if(err){
    console.log("not connected to the database: "+err);
  }else{
    console.log("successfully connected to MongoDb");
  }
});

app.get('/', function(req, res){
  res.sendFile(__dirname+'/index.html');
})

app.listen(app.get('port'), function() {
  console.log('Server listening at 9005'); // eslint-disable-line no-console
});

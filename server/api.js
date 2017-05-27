var freeEvent = require('./models/event');
var Subscriber = require('./models/subscriber');
var uwapi=require('uwapi')('100f8c910163784117c5ae5cf49bb5d8');
var twilio = require('twilio');
var accountSid = 'AC5bfaf857260b1a76467e05c406dca4ed'; // Your Account SID from www.twilio.com/console
var authToken = 'e7b6045c47f6e3aa5d09e1eb93e7eea7';   // Your Auth Token from www.twilio.com/console

var client = new twilio(accountSid, authToken);

module.exports = function(router){
  router.post('/subscribe', function(req,res){
    var newSub = new Subscriber();
    Subscriber.phoneNumber = req.body.phoneNumber;
    Subscriber.save(function(err) {
      if(err){
        console.log("Error when saving the model");
        res.json({success: false});
      }else{
        console.log("successfully saved the model");
        res.json({success: true});
      }
    });
  });

  router.get('/campusBuildings', function(req, res){
    console.log("got request for buildings");
    uwapi.buildingsList().then(function(buildings){
      res.json(buildings);
    });
  });

  router.post('/addEvent', function(req, res){
    console.log("got the add event request");
    var currentTime = new Date();
    console.log(req.body);
    var startingTime = new Date(req.body.startingTime);
    if(currentTime.getTime() - startingTime.getTime() >= 7200000){
      res.json({"success": false, "msg": "The event started 2 hours ago. It's most likely expired"});
    }else{
      var newEvent = new freeEvent();

      if(currentTime.getTime() - startingTime.getTime() < 7200000 && currentTime.getTime() - startingTime.getTime() >= 0){
        newEvent.state.ongoing = true;
        newEvent.state.upcoming = false;
      }else{
        newEvent.state.ongoing = false;
        newEvent.state.upcoming = true;
      }

      newEvent.location = req.body.location;
      newEvent.roomNumber = req.body.roomNumber;
      newEvent.startingTime = startingTime;
      newEvent.foodType = req.body.foodType;
      newEvent.servingSize = req.body.servingSize != undefined ? req.body.servingSize : null;

      if(req.body.endingTime !== undefined && req.body.endingTime !== null){
        var endingTime = new Date(req.body.endingTime);
        if(endingTime.getTime() - startingTime.getTime() < 7200000){
          newEvent.endingTime = endingTime;
          newEvent.expiringTime = endingTime;
        }else{
          //if the endingTime is 2 hours away from the starting time
          newEvent.endingTime = new Date(startingTime.getTime() + 7200000);
          newEvent.expiringTime = new Date(startingTime.getTime() + 7200000);
        }

      }else{
        //set the expiringTime 2 hours from the starting time
        newEvent.expiringTime = new Date(startingTime.getTime() + 7200000);
      }

      newEvent.save(function(err){
        if(err){
          console.log("Error when saving the model");
          res.json({success: false});
        }else{
          Subscriber.find({},function(err, subs){
            subs.forEach(function(sub){
              client.messages.create({
                  body: 'There is free food ('+newEvent.foodType+') at '+newEvent.location+' '+newEvent.roomNumber,
                  to: sub.phoneNumber,  // Text this number
                  from: '+16475591551' // From a valid Twilio number
              })
              .then(function(message){
                console.log(message.sid);
              });
            })
          });

          console.log("successfully saved the model");
          res.json({success: true});
        }
      });


    }
  });

  router.get('/getEvents', function(req, res){
    var currentTime = new Date();
    freeEvent.find({}, function(err, events){
      if(err){
        throw err;
      }else {
        //see if the event has expired
        var promise = new Promise(function(resolve, reject){
          events.forEach(function(event){
            //check if the event has expired
            if(currentTime.getTime() - event.expiringTime.getTime() >= 0){
              event.state.upcoming = false;
              event.state.ongoing = false;
              event.state.expired = true;
              //if the event has expired more than 2 hours, delete it
              if(currentTime.getTime() - event.expiringTime.getTime() >= 7200000){
                freeEvent.remove({ _id: event.id }, function(err){
                  if(err) throw err;
                });
              }
            }
          });
        });


        res.json(events);

        //res.json(events);
      }
    });
  });

  router.post('/upvote', function(req, res){
    console.log(req.body);

    var id = req.body.id;

    freeEvent.findOne({ _id: id}, function(err, event){
      console.log("found by id");
      if(err) throw err;
      event.upvotes = event.upvotes+1;
      event.save(function(err){
        if(err) throw err;
        else{
          res.json({success: true});
        }
      })
    });
  });

  router.post('/downvote', function(req, res){
    var id = req.body.id;

    freeEvent.findOne({ _id: id}, function(err, event){
      console.log("found by id");
      if(err) throw err;
      event.downvotes = event.downvotes+1;
      event.save(function(err){
        if(err) throw err;
        else{
          res.json({success: true});
        }
      })
    });
  });

  return router;
}

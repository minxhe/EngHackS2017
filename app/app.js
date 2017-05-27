angular.module('FooApp', ['ui.bootstrap'])
  .controller('AppController', function($scope, $http){
    $scope.buildingList;
    $scope.eventList;
    $scope.location;
    $scope.roomNumber;
    $scope.startingTime;
    $scope.endingTime;
    $scope.servingSize;
    $scope.foodType;

    $scope.mytime = new Date();

    $scope.update = function() {
       var d = new Date();
       d.setHours( 14 );
       d.setMinutes( 0 );
       $scope.mytime = d;
     };

     $scope.changed = function () {
     };

    $scope.getBuildingList = function(){
      $http.get('/api/campusBuildings').then(function(response){
        console.log(response.data);
        $scope.buildingList = response.data;
      });
    }

    $scope.getBuildingList();

    $scope.getEvents = function(){
      $http.get('/api/getEvents').then(function(response){
        console.log(response);
        $scope.eventList = response.data;
      })
    }

    $scope.getEvents();

    $scope.addEvent = function(){
      var servingSize = '';
      if($scope.servingSize !== undefined && $scope.servingSize !== null && $scope.servingSize !== ''){
        $scope.servingSize = servingSize;
      }

      var payload = {
        location: $scope.location,
        roomNumber: $scope.roomNumber,
        startingTime: $scope.startingTime,
        //endingTime: $scope.endingTime, //cheating
        servingSize: $scope.servingSize,
        foodType: $scope.foodType,
      }
      $http.post('/api/addEvent', payload).then(function(response){
        console.log("addEvent"+response);
      });
    }

    $scope.upvote = function(id){
      $http.post('/api/upvote', id).then(function(response){
        console.log("upvote"+response);
      });
    }

    $scope.downvote = function(id){
      $http.post('/api/downvote', id).then(function(response){
        console.log("downvote"+response);
      });
    }

    $scope.subscribeUser = function(phoneNum){
      $http.post('/api/subscribe', phoneNum).then(function(response){
        console.log("subscibe"+response);
      });
    }

  });

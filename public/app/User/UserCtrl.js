'use strict';
angular.module('FileSync').controller('UserCtrl', 
  function ($scope, UserService, SocketIOService) {
    this.users = UserService.users;

    SocketIOService.onUserConnected(function(userid, nom) {
    	UserService.addUser(userid, nom);
    	$scope.$apply();
    }.bind(this));

    SocketIOService.onUserDisconnected(function(userid) {
    	UserService.removeUser(userid);
    	$scope.$apply();
    }.bind(this));

  });

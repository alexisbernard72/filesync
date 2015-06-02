'use strict';
angular.module('FileSync')
  .factory('UserService', function (SocketIOService, _) {
    var users = [];

    return {
      users : users,
      addUser : function (userid, name) {
        users.push({id : userid, nom : name});
      },
      removeUser : function (userid) {
        for(var i = 0; i < users.length; i++) {
          if(users[i].id == userid) {
            users.splice(i, 1);
            break;
          }
        }
      }
    };
  });

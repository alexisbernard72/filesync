'use strict';
angular.module('FileSync')
  .factory('PrivateChatService', function (_) {
    var conversations = {};
    var clients = sockets.sockets.id;

    return {
      clients : clients,
      getConversation : function (src, target) {
      	var conv = conversations[src+target];
      	if(conv != null) {
      		return conv;
      	}
      	conv = conversations[target+src];
      	if(conv != null) {
      		return con;
      	}
      	conversations[src+target] = [];
      	return [];
      }
    };
  });

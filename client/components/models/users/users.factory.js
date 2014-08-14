(function() {

  'use strict';

  angular
    .module('angularNodePhonegapApp')
    .factory('Users', Users);

  function Users(Restangular) {
    var model = Restangular.all('users');
    model.one = function(id) {
      return Restangular.one('users', id);
    };

    return model;
  }

})();
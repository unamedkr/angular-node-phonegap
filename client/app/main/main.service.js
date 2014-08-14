(function() {

  'use strict';

  angular
    .module('angularNodePhonegapApp')
    .service('MainSvc', MainSvc);

  function MainSvc($http) {
    this.getThings = getThings; 
    this.addThing = addThing;
    this.deleteThing = deleteThing;

    function getThings() {
      return $http.get('/api/things');
    }

    function addThing(thing) {
      return $http.post('/api/things', thing);
    }

    function deleteThing(id) {
      return $http.delete('/api/things/' + id);
    }
  }

})();
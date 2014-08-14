(function () {

  'use strict';

  angular
    .module('angularNodePhonegapApp')
    .config(config);

  function config($stateProvider) { 
    $stateProvider
    .state('main', {
      url: '/',
      templateUrl: 'app/main/main.html',
      controller: 'MainCtrl'
    });
  }

})();  
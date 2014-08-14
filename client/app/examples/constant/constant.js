(function () {

  'use strict';

  angular
    .module('angularNodePhonegapApp')
    .config(Config);
    
  function Config($stateProvider) {
    $stateProvider
      .state('constant', {
        url: '/constant',
        templateUrl: 'app/examples/constant/constant.html',
        controller: 'ConstantCtrl'
      });
  }
  
})();
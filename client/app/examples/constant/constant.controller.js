(function() {

  'use strict';

  angular
    .module('angularNodePhonegapApp')
    .controller('ConstantCtrl', ConstantCtrl);

  function ConstantCtrl($scope, $log, BASE_URI, API_VERSION) {
    var vm = $scope;
    vm.BASE_URI = BASE_URI;

    alert('BASE_URI:' + vm.BASE_URI + API_VERSION); 
  }

})();

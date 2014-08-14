(function () {

  'use strict';

  angular
    .module('angularNodePhonegapApp')
    .config(Config);

  function Config($stateProvider) {
    $stateProvider
      .state('examples', {
        url: '/examples',
        templateUrl: 'app/examples/examples.html',
        controller: 'ExamplesCtrl'
      })
      .state('anguar-gettext', {
        url: '/anguar-gettext',
        templateUrl: 'app/examples/anguar-gettext/anguar-gettext.html',
        controller: 'AnguarGettextCtrl'
      });
  }
  
})();
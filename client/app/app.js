(function() {

  'use strict';

  angular
    .module('angularNodePhonegapApp', [
		  'ngCookies',
		  'ngResource',
		  'ngSanitize',
		  'btford.socket-io',
		  'ui.router',
		  'ui.bootstrap',
      'restangular',
      'gettext'
		])
    .config(config)
    .factory('authInterceptor', authInterceptor)
    .run(run);



  function config($stateProvider, $urlRouterProvider, $locationProvider, $httpProvider) {
    $urlRouterProvider
      .otherwise('/');

    $httpProvider.interceptors.push('authInterceptor');
  }

  function run($rootScope, $location, Auth, Restangular, gettextCatalog) {

    // TODO - default language setting through Locale Info.
    gettextCatalog.currentLanguage = 'ko_KR';


    
    // TODO 고도화
    $rootScope.remoteURI = 'https://dev.studygps.net';
    $rootScope.remoteApiURI = $rootScope.remoteURI + '/api/v1';
    // init restangular
    Restangular.setBaseUrl($rootScope.remoteApiURI);



    // Redirect to login if route requires auth and you're not logged in
    $rootScope.$on('$stateChangeStart', function (event, next) {
      Auth.isLoggedInAsync(function(loggedIn) {
        if (next.authenticate && !loggedIn) {
          $location.path('/login');
        }
      });
    });
  }

  function authInterceptor($rootScope, $q, $cookieStore, $location) {
    return {
      // Add authorization token to headers
      request: function (config) {
        config.headers = config.headers || {};
        if ($cookieStore.get('token')) {
          config.headers.Authorization = 'Bearer ' + $cookieStore.get('token');
        }
        return config;
      },

      // Intercept 401s and redirect you to login
      responseError: function(response) {
        if(response.status === 401) {
          $location.path('/login');
          // remove any stale tokens
          $cookieStore.remove('token');
          return $q.reject(response);
        }
        else {
          return $q.reject(response);
        }
      }
    };
  }

})();  
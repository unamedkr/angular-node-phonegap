'use strict';

describe('Controller: AnguarGettextCtrl', function () {

  // load the controller's module
  beforeEach(module('angularNodePhonegapApp'));

  var AnguarGettextCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    AnguarGettextCtrl = $controller('AnguarGettextCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});

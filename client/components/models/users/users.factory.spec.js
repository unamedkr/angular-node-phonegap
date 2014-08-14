'use strict';

describe('Factory: UsersFtry', function () {

  // load the service's module
  beforeEach(module('angularNodePhonegapApp'));

  // instantiate service
  var UsersFtry;
  beforeEach(inject(function (_UsersFtry_) {
    UsersFtry = _UsersFtry_;
  }));

  it('should do something', function () {
    expect(!!UsersFtry).toBe(true);
  });

});

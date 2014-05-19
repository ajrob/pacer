'use strict';

describe('Service: CalculationService', function () {

  // load the service's module
  beforeEach(module('pacerApp'));

  // instantiate service
  var CalculationService;
  beforeEach(inject(function (_CalculationService_) {
    CalculationService = _CalculationService_;
  }));

  it('should do something', function () {
    expect(!!CalculationService).toBe(true);
  });

});

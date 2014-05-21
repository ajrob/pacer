'use strict';

describe('Service: ConversionService', function () {

  // load the service's module
  beforeEach(module('pacerApp'));

  // instantiate service
  var ConversionService;
  beforeEach(inject(function (_ConversionService_) {
    ConversionService = _ConversionService_;
  }));

  it('should do something', function () {
    expect(!!ConversionService).toBe(true);
  });

});

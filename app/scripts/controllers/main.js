'use strict';

angular.module('pacerApp', ['ui.mask'])
  .controller('MainCtrl', function ($scope,
    $filter, 
    uiMaskConfig,
    CalculationService,
    ConversionService) {
    // uiMaskConfig allows for configuring the types of input

    //Configure uiMaskConfig for hour (H). Do not allow minutes or seconds over 60
    uiMaskConfig.maskDefinitions['H'] = /[0-5]/;

    $scope.disableCalculation = true;

    $scope.reset = function(){
      resetOperands();

    };
    $scope.paceValuesChanged = function(paceVariable){

      var numOperands = 0;

      if ((typeof $scope.pacerVariables[paceVariable].number) == 'string' &&
          $scope.pacerVariables[paceVariable].number != '') {
        $scope.pacerVariables[paceVariable].isOperand = true; //Set to operand
        //Check to see if paceVariable needs to be converted from a time format
        // -->Check "duration" and "rate"
        if(paceVariable == 'duration' || paceVariable == 'rate'){
          // Convert to hours, minutes, seconds
          console.log(ConversionService.convertTimeBlock($scope.pacerVariables[paceVariable].number).toTotalSeconds);
          console.log(ConversionService.convertSeconds(
            ConversionService.convertTimeBlock($scope.pacerVariables[paceVariable].number).toTotalSeconds
            ).toMinutes());
          console.log(ConversionService.convertMinutes(60).toHours());
        }
      };

      for (var key in $scope.pacerVariables){
        //Add the total number of operands
        numOperands += $scope.pacerVariables[key].isOperand;
      };
      if(numOperands == 2){
        //TODO: Gray out the input box
        $scope.disableCalculation = false;
      }
    };

    $scope.runCalculation = function(){
      if(doCalculation()){
        $scope.resultMessage = formMessage();
      }
    };

    $scope.pacerVariables = {
      distance: {
        number: null,
        isOperand: false
      },
      rate: {
        number: null,
        isOperand: false
      },
      duration: {
        number: null,
        isOperand: false
      }
    };

    $scope.unit = {
      duration: "hours",
      distance: "miles",
      rate: "min/mi"
    }

    var _distance = $scope.pacerVariables.distance,
        _rate = $scope.pacerVariables.rate, // Input: min/mi
        _duration = $scope.pacerVariables.duration; // Input: hhmmss string

    var pacerEvaluation = [];

    function resetOperands(){
      _.each($scope.pacerVariables, function(val){
        val.isOperand = false;
        val.number = "";
      });
    };

    function doCalculation(){
      if(_distance.isOperand && _rate.isOperand){
        _duration.number = CalculationService.calculateDuration(_rate.number, _distance.number);
        return true;
      } else if(_distance.isOperand && _duration.isOperand){
        _rate.number = CalculationService.calculateRate(_distance.number, _duration.number);
        return true;
      } else if(_rate.isOperand && _duration.isOperand){
        _distance.number = CalculationService.calculateDistance(_rate.number, _duration.number);
        return true;
      }
      return false;
    }

    function formMessage () {
      //At 8 min/mi, it will take 10 hours to go 10 miles --> rate is known
      if(_rate.isOperand){
        return "At " + _rate.number + " " + $scope.unit.rate + ", " +
                "it will take " + _duration.number + " " + $scope.unit.duration + " " +
                "to go " + _distance.number + " " + $scope.unit.distance;
      } else {
        return "To go " + _distance.number + " " + $scope.unit.distance + ", " +
                "it will take " + _duration.number + " " + $scope.unit.duration + " " +
                "to go " + _rate.number + " " + $scope.unit.rate;
      }
      //To go 10 miles, it will take 10 hours at 8 min/mi --> rate isn't known
    };
  });

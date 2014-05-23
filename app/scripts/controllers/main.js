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
        _rate = $scope.pacerVariables.rate,
        _duration = $scope.pacerVariables.duration;

    var rate = {
      timeBlock: '',
      hours: 0,
      minutes: 0,
      seconds: 0,
      totalSeconds: 0,
      totalSecondsReciprocal: 0
    }

    var duration = {
      timeBlock: '',
      hours: 0,
      minutes: 0,
      seconds: 0,
      totalSeconds: 0
    }

    $scope.disableCalculation = true;

    $scope.reset = function(){
      resetOperands();

    };
    $scope.paceValuesChanged = function(paceVariable){

      var numOperands = 0;

      if ((typeof $scope.pacerVariables[paceVariable].number) == 'string' &&
          $scope.pacerVariables[paceVariable].number != '') {
        //Set to operand
        $scope.pacerVariables[paceVariable].isOperand = true;

        //Check to see if paceVariable needs to be converted from a time format
        // -->Check "duration" and "rate"
        if(paceVariable == 'duration'){
          // Input: hhmmss 'string' --> Output: seconds
          duration.totalSeconds = ConversionService.convertTimeBlock($scope.pacerVariables[paceVariable].number).toTotalSeconds;
        } else if (paceVariable == 'rate') {
          // Input: min/mi --> Output: seconds/mi
          rate.totalSeconds = ConversionService.convertTimeBlock($scope.pacerVariables[paceVariable].number).toTotalSeconds;
          // Is the user input units set to "minute per mile" (default)?
          // TODO: For now, this will be the only option. In the future, add "mph" as an option.
          //       This will not require the following inverse statement.
          rate.totalSecondsReciprocal = 1/rate.totalSeconds;
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

    function resetOperands(){
      _.each($scope.pacerVariables, function(val){
        val.isOperand = false;
        val.number = "";
      });
    };

    function doCalculation(){

      if(_distance.isOperand && _rate.isOperand){
        duration.totalSeconds = CalculationService.calculateDuration(rate.totalSecondsReciprocal, _distance.number);
        duration.timeBlock = ConversionService.convertSeconds(duration.totalSeconds).toTimeBlock();
        rate.timeBlock = ConversionService.convertSeconds(rate.totalSeconds).toTimeBlock();
        return true;
      } else if(_distance.isOperand && _duration.isOperand){
        rate.totalSeconds = CalculationService.calculateRate(_distance.number, duration.totalSeconds);
        rate.timeBlock = ConversionService.convertSeconds(rate.totalSeconds).toTimeBlock();
        duration.timeBlock = ConversionService.convertSeconds(duration.totalSeconds).toTimeBlock();
        return true;
      } else if(_rate.isOperand && _duration.isOperand){
        _distance.number = CalculationService.calculateDistance(rate.totalSecondsReciprocal, duration.totalSeconds);
        rate.timeBlock = ConversionService.convertSeconds(rate.totalSeconds).toTimeBlock();
        duration.timeBlock = ConversionService.convertSeconds(duration.totalSeconds).toTimeBlock();
        return true;
      }
      return false;
    }

    function formMessage () {
      //At 8 min/mi, it will take 10 hours to go 10 miles --> rate is known
      if(_rate.isOperand){
        return "At " + rate.timeBlock.hours + " hrs, " + rate.timeBlock.minutes + " mins, " + rate.timeBlock.seconds + " secs " + $scope.unit.rate + ", " +
                "it will take " + duration.timeBlock.hours + " hrs, " + duration.timeBlock.minutes + " mins, " + duration.timeBlock.seconds + "secs " +
                "to go " + _distance.number + " " + $scope.unit.distance;
      } else {
        return "To go " + _distance.number + " " + $scope.unit.distance + " " +
                "in " + duration.timeBlock.hours + " hrs, " + duration.timeBlock.minutes + " mins, " + duration.timeBlock.seconds + " secs " +
                "you will need to go at a " + rate.timeBlock.hours + ":" + rate.timeBlock.minutes + ":" + rate.timeBlock.seconds + " per mile pace.";
      }
      //To go 10 miles, it will take 10 hours at 8 min/mi --> rate isn't known
    };
  });

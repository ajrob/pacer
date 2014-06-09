'use strict';

angular.module('pacerApp', ['ngAnimate'])
  .controller('MainCtrl', function ($scope,
    $filter,
    CalculationService,
    ConversionService,
    MessageService) {

    $scope.paceInputForm = '';

    $scope.pacerVariables = {
      distance: {
        number: null,
        isOperand: false,
        isDisabled: false
      },
      rate: {
        number: null,
        isOperand: false,
        isDisabled: false
      },
      duration: {
        number: null,
        isOperand: false,
        isDisabled: false
      }
    };

    $scope.unit = {
      distance: "mile",
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
      resetInputVariables();
      $scope.disableCalculation = true;
      $scope.resultMessage = '';
      $scope.splits = [];
    };
    
    $scope.paceValuesChanged = function(paceVariable){

      var numOperands = 0;

      // If the value was an operand but is now empty, reset isOperand to false
      if ($scope.pacerVariables[paceVariable].isOperand && $scope.paceInputForm[paceVariable].$modelValue == '') {
        $scope.pacerVariables[paceVariable].isOperand = false;
      };

      // If the input value is invalid AND it's not $pristine (has already been touched)
      if ($scope.paceInputForm[paceVariable].$invalid && !$scope.paceInputForm[paceVariable].$pristine) {
        //Not a valid number
        //Set isOperand to false
        $scope.pacerVariables[paceVariable].isOperand = false;
        //Disable Run button
        $scope.disableCalculation = true;
      };

      // If the input is valid AND it's not empty
      if ($scope.paceInputForm[paceVariable].$valid &&
          $scope.pacerVariables[paceVariable].number != '') {
        //Set to operand
        $scope.pacerVariables[paceVariable].isOperand = true;

        //Check to see if paceVariable needs to be converted from a time format
        // -->Check "duration" and "rate"
        if(paceVariable == 'duration'){
          // Input: hhmmss 'string' --> Output: seconds
          var durationTime = parseDuration($scope.pacerVariables[paceVariable].number);
          if (durationTime){
            duration.hours = durationTime[1];
            duration.minutes = durationTime[2];
            duration.seconds = durationTime[3];
          }
          // duration.totalSeconds = ConversionService.convertTimeBlock($scope.pacerVariables[paceVariable].number).toTotalSeconds;
          duration.totalSeconds = ConversionService.convertTime(duration.hours, duration.minutes, duration.seconds);
        } else if (paceVariable == 'rate') {
          // Input: min/mi --> Output: seconds/mi
          var rateTime = parseRate($scope.pacerVariables[paceVariable].number);
          if (rateTime) {
            rate.minutes = rateTime[1];
            rate.seconds = rateTime[2];
          }
          
          // rate.totalSeconds = ConversionService.convertTimeBlock($scope.pacerVariables[paceVariable].number).toTotalSeconds;
          rate.totalSeconds = ConversionService.convertTime(0, rate.minutes, rate.seconds);

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
        for (var key in $scope.pacerVariables){
          // Determine which input box is not an operand
          if(!$scope.pacerVariables[key].isOperand){
            $scope.pacerVariables[key].isDisabled = true;
          }
        };
        $scope.disableCalculation = false;
      }
    };

    $scope.runCalculation = function(){
      if(doCalculation()){
        $scope.resultMessage = MessageService.formMessage(_rate.isOperand, rate, _distance, duration, $scope.unit);
        $scope.splits = calculateSplits(_distance.number, rate.totalSeconds);
      }
    };

    function calculateSplits (distance, rate) {
      var elapsedTime = rate,
          splits = [];
      // Construct splits object
      for (var i = 1; i <= distance; i++) {
        splits.push({
          'mile': i,
          'elapsedTime': ConversionService.convertSeconds(elapsedTime).toTimeBlock().padded()
        })
        elapsedTime += rate
      }
      return splits;
    }

    function parseRate (rate) {
      try {
        return rate.match(/^([0-5]?\d):([0-5]\d)$/);
      }
      catch (e) {
        console.log("Rate is not a string: ", e);
      }
    }

    function parseDuration (duration) {
      try {
        return duration.match(/^(?:(\d+):)?([0-5]\d):([0-5]\d)$/);
      }
      catch (e) {
        console.log("Duration is not a string: ", e);
      }
    }

    function resetInputVariables(){
      _.each($scope.pacerVariables, function(val){
        val.isOperand = false;
        val.number = "";
        val.isDisabled = false;
      });
    }

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
  });

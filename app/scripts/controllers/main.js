'use strict';

angular.module('pacerApp')
  .controller('MainCtrl', function ($scope) {

		var pacerEvaluation = [];

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

    $scope.reset = function(){
      resetOperands();

    };

    function resetOperands(){
      _.each($scope.pacerVariables, function(val){
        val.isOperand = false;
        val.number = "";
      });
    };

    function calculateDistance(){
      $scope.pacerVariables.distance.number = $scope.pacerVariables.rate.number * $scope.pacerVariables.duration.number;
    };
    function calculateRate(){
      // rate = duration/distance
      $scope.pacerVariables.rate.number = $scope.pacerVariables.duration.number / $scope.pacerVariables.distance.number;
    };
    function calculateDuration(){
      // duration = distance/rate
      $scope.pacerVariables.duration.number = $scope.pacerVariables.distance.number / $scope.pacerVariables.rate.number;
    };

    function doCalculation(){
      if($scope.pacerVariables.distance.isOperand && $scope.pacerVariables.rate.isOperand){
        calculateDuration();
        return true;
      } else if($scope.pacerVariables.distance.isOperand && $scope.pacerVariables.duration.isOperand){
        calculateRate();
        return true;
      } else if($scope.pacerVariables.rate.isOperand && $scope.pacerVariables.duration.isOperand){
        calculateDistance();
        return true;
      }
      return false;
    }

    function formMessage () {
      //At 8 min/mi, it will take 10 hours to go 10 miles --> rate is known
      if($scope.pacerVariables.rate.isOperand){
        return "At " + $scope.pacerVariables.rate.number + " --unit of speed--, " +
                "it will take " + $scope.pacerVariables.duration.number + " --unit of time-- " +
                "to go " + $scope.pacerVariables.distance.number + "--unit of distance--";
      } else {
        return "To go " + $scope.pacerVariables.distance.number + " --unit of distance--, " +
                "it will take " + $scope.pacerVariables.duration.number + " --unit of time-- " +
                "to go " + $scope.pacerVariables.rate.number + "--unit of speed--";
      }
      //To go 10 miles, it will take 10 hours at 8 min/mi --> rate isn't known
    };

    var expressionArray = [];
    $scope.paceValuesChanged = function(paceVariable){

      var numOperands = 0;
      for (var key in $scope.pacerVariables){
        numOperands += key.isOperand;
      };
      if(numOperands == 2){
        //Gray out the input box
      }

      $scope.pacerVariables[paceVariable].isOperand = true; //Set to operand

      if(doCalculation()){
        $scope.resultMessage = formMessage();
      }
      
    };
  });

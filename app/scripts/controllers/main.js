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
      } else if($scope.pacerVariables.distance.isOperand && $scope.pacerVariables.duration.isOperand){
        calculateRate();
      } else if($scope.pacerVariables.rate.isOperand && $scope.pacerVariables.duration.isOperand){
        calculateDistance();
      }
    }

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

      doCalculation();
    };
  });

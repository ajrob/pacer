'use strict';

angular.module('pacerApp')
  .controller('MainCtrl', function ($scope) {
  	// function doCalculation (operandArray) {
      
   //    if(operandArray.length == 2) {
   //      var operand1 = operandArray.pop(),
   //          operand2 = operandArray.pop();

   //      switch(operand1.name){
   //        case "distance":
   //        if(operand2.name === "rate"){
   //          $scope.pacerVariables.duration.number = operand1.number/operand2.number;
   //          console.log("Calculate duration");
   //        } else if (operand2.name === "duration") {
   //          console.log("Calculate rate");
   //        }
   //        return true;
   //        break;

   //        case "rate":
   //        if(operand2.name === "distance") {
   //          $scope.pacerVariables.duration.number = operand2.number/operand1.number;
   //          console.log("Calculate duration");
   //        } else if (operand2.name === "duration") {
   //          console.log("Calculate distance");
   //        }
   //        return true;
   //        break;

   //        case "duration":
   //        if(operand2.name === "rate") {
   //          console.log("Calculate distance");
   //        } else if (operand2.name === "distance") {
   //          console.log("Calculate rate");
   //        }
   //        return true;
   //        break;
   //      }
   //    }
   //    return false;

      
  	// 	// if(paceVariable === "rate" || paceVariable === "duration") {
   //    //  // $scope.distance *= 1;
   //    //  // $scope.rate *= 1;
   //    //  // $scope.duration *= 1;

   //    //  $scope.distance = $scope.rate*$scope.duration;
   //    // }
   //    // if (paceVariable === "duration" || paceVariable === "distance") {
   //    //  $scope.rate = $scope.duration/$scope.distance;
   //    // }
   //    // if ( paceVariable === "distance" || paceVariable === "rate") {
   //    //  $scope.duration = $scope.distance/$scope.rate;
   //    // }
  	// }
  // 	var pacerVariable = {
		// 	type: "", //distance, rate, or duration
		// 	value: 0
		// };

		// // var operand1 = Object.create(pacerVariable),
		// // 		operand2 = Object.create(pacerVariable),
		// var	operand = Object.create(pacerVariable),
		// 		computedResult = Object.create(pacerVariable);

		// // var pacerEvaluation = {
		// // 	operand1: operand1,
		// // 	operand2: operand2,
		// // 	computedResult = computedResult
		// // };
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
      // if($scope.pacerVariables.distance.isOperand) {
      //   if($scope.pacerVariables.rate.isOperand) {
      //     calculateDuration();
      //     return true;
      //   } else if($scope.pacerVariables.duration.isOperand) {
      //     calculateRate();
      //     return true;
      //   }
      // } else if($scope.pacerVariables.rate.isOperand) {
      //   if($scope.pacerVariables.distance.isOperand) {
      //     calculateDuration();
      //     return true;
      //   } else if($scope.pacerVariables.duration.isOperand) {
      //     calculateDistance();
      //     return true;
      //   }
      // } else if($scope.pacerVariables.duration.isOperand) {
      //   if($scope.pacerVariables.distance.isOperand) {
      //     calculateRate();
      //     return true;
      //   } else if($scope.pacerVariables.rate.isOperand) {
      //     calculateDistance();
      //     return true;
      //   }
      // }
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

      // //Cycle through each pacerVariable to see if there are 2 valid operands to push
      // _.each($scope.pacerVariables, function(val, key){
      //   if(val.isOperand) {
      //     val.name = key;
      //     expressionArray.push(val);
      //   };
      // });
      // //Are there 2 operands yet?
      // if(expressionArray.length == 2){
      //   doCalculation(expressionArray);
      //   //Reset isOperands
      //   _.each($scope.pacerVariables, function(val){
      //     val.isOperand = false;
      //   });
      // } else { 
      //   //Reset expressionArray
      //   expressionArray = [];
      // }

      
      // if (doCalculation(expressionArray)) {
      //   //If the doCalculation was successful, reset all isOperands.
      //   _.each($scope.pacerVariables, function(val){
      //     val.isOperand = false;
      //   });
      // }
    	// // Push onto the array
    	// expressionArray.push({
    	// 	type: paceVariable,
    	// 	value: $scope.distanceNumber
    	// });

    	// if (expressionArray.length == 2) {
     //    //Evaluate the expressions
     //    var operand1 = expressionArray.pop();
     //    var operand2 = expressionArray.pop();
    	// 	switch (operand1.type){
     //      case "distance":
     //        if (operand2.type === "duration") {
     //          return {
     //            value: operand2.value / operand1.value, //rate = duration/distance
     //            type: "rate"
     //          }
     //        } else if (operand2.type === "rate") {
     //          return {
     //            value: operand1.value/operand2.value, //duration = distance/rate
     //            type: "duration"
     //          }
     //        }
     //  			$scope.distance.isModified = true;
     //  			break;
    	// 		case "rate":
     //        if (operand2.type === "distance") {
     //          return {
     //            value: operand2.value/operand1.value, //duration = distance/rate
     //            type: "duration"
     //          }
     //        } else if (operand2.type === "duration") {
     //          return {
     //            value: operand1.value * operand2.value, //distance = rate*duration
     //            type: "distance"
     //          }
     //        }
     //  			$scope.rate.isModified = true;
     //  			break;
    	// 		case "duration":
     //        if (operand2.type === "distance") {
     //          return {
     //            value: operand1.value/operand2.value, //rate = duration/distance
     //            type: "rate"
     //          } 
     //        } else if (operand2.type === "rate") {
     //          return {
     //            value: operand1.value * operand2.value, //distance = rate * duration
     //            type: "distance"
     //          }
     //        }
     //  			$scope.duration.isModified = true;
     //  			break;
	    // 	}//Switch
    	// };

    	
    	//Add up modified numbers count
    	// if ($scope.distance.isModified + $scope.rate.isModified + $scope.duration.isModified >= 2) {
    	// 	console.log("I'll add some numbers!");
    	// };
    	// if(paceVariable === "rate" || paceVariable === "duration") {
    	// 	// $scope.distance *= 1;
    	// 	// $scope.rate *= 1;
    	// 	// $scope.duration *= 1;

    	// 	$scope.distance = $scope.rate*$scope.duration;
    	// }
    	// if (paceVariable === "duration" || paceVariable === "distance") {
    	// 	$scope.rate = $scope.duration/$scope.distance;
    	// }
    	// if ( paceVariable === "distance" || paceVariable === "rate") {
    	// 	$scope.duration = $scope.distance/$scope.rate;
    	// }
    };
  });

'use strict';

angular.module('pacerApp')
  .service('CalculationService', function CalculationService() {

  	return {
  		calculateDistance: function(rate, duration){
  			return rate * duration; //Returns distance
  		},
  		calculateRate: function(distance, duration){
  			return duration / distance; //Returns rate
  		},
  		calculateDuration: function(rate, distance){
  			return distance / rate; //Returns duration
  		}
  	};
  });

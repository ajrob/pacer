'use strict';

angular.module('pacerApp')
  .service('ConversionService', function ConversionService() {
    return {
    	convertTimeBlock: function(hhmmss){
    		// Length of the incoming string should be exactly 6 characters
    		if (hhmmss.length != 6) {
    			return false;
    		};

    		var _hours = hhmmss.slice(0,2),
    				_minutes = hhmmss.slice(2,4),
    				_seconds = hhmmss.slice(4,6),
    				_totalSeconds = (_hours * 60 * 60) + (_minutes * 60) + (_seconds * 1);

    		return {
    			toHours: _hours,
    			toMinutes: _minutes,
    			toSeconds: _seconds,
    			toTotalSeconds: _totalSeconds
    		}
    	},
    	convertSeconds: function(seconds){
    		return {
    			toMinutes: function(){
	    			return seconds / 60;
	    		}
    		}
    	},
    	convertMinutes: function(minutes){
    		return {
    			toHours: function(){
    				return minutes / 60;
    		   }
    		}
    	}
    }
  });

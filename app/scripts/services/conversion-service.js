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
    	convertSeconds: function(totalSeconds){
    		return {
    			toMinutes: function(){
	    			return totalSeconds / 60;
	    		},
	    		toTimeBlock: function(){
	    			// Do some nifty modulo math
	    			var _seconds = Math.floor(totalSeconds % 60),
	    					_minutes = Math.floor((totalSeconds / 60) % 60),
	    					_hours = Math.floor(totalSeconds / 3600);
	    			return {
	    				hours: _hours,
	    				minutes: _minutes,
	    				seconds: _seconds
	    			}
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

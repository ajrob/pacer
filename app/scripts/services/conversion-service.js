'use strict';

angular.module('pacerApp')
  .service('ConversionService', function ConversionService() {
    return {
    	convertTimeBlock: function(hhmmss){
    		// Length of the incoming string should be exactly 6 characters
    		if (hhmmss.length !== 6 && hhmmss.length !== 4) {
    			return false;
    		};

            if (hhmmss.length === 6) {
                var _hours = hhmmss.slice(0,2),
                    _minutes = hhmmss.slice(2,4),
                    _seconds = hhmmss.slice(4,6),
                    _totalSeconds = (_hours * 60 * 60) + (_minutes * 60) + (_seconds * 1);
            } else if(hhmmss.length === 4) {
                var _minutes = hhmmss.slice(0,2),
                    _seconds = hhmmss.slice(2,4),
                    _totalSeconds = (_minutes * 60) + (_seconds * 1);
            }

    		return {
    			toHours: _hours,
    			toMinutes: _minutes,
    			toSeconds: _seconds,
    			toTotalSeconds: _totalSeconds
    		}
    	},
        convertTime: function(hours, minutes, seconds){
            if (hours) {
                return (hours * 60 * 60) + (minutes * 60) + (seconds * 1);
            } else {
                return (minutes * 60) + (seconds * 1);
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
                        padded: function(){
                            var paddedTimeBlock = '';
                            if(_hours > 0){
                                paddedTimeBlock +=  _hours + ":";
                            }
                            if (_minutes >= 0 && _minutes < 10 && _hours > 0) {
                                paddedTimeBlock += "0" + _minutes + ":";
                            } else {
                                paddedTimeBlock += _minutes + ":";
                            }
                            if (_seconds < 10) {
                                // Pad the number with a 0
                                paddedTimeBlock += "0" + _seconds;
                            } else {
                                paddedTimeBlock += _seconds;
                            }
                            return paddedTimeBlock;
                        },
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

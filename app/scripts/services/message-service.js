'use strict';

angular.module('pacerApp')
  .service('MessageService', function MessageService() {
    return {
    	formMessage: function(isRate, rate, distance, duration, unit){
    		var formedMessage = '',
    				rateMessageFragment = '',
    				distanceMessageFragment = '',
    				durationMessageFragment = '';

    		// Form a different grammatical sentence depending on known variables (based on rate)
	      // "At a 8 min/mi pace, it will take  10 hours    to go   10 miles    " --> rate is known
	      //      |^^^^rate^^^^|              |^duration^|        |^distance^|
	      // Form each message segment, parsing through each condition and eliminating unneeded portions,
	      //   i.e. "0 hrs"

	      function formRateFragment () {
	      	if(rate.timeBlock.hours > 0){
	      		rateMessageFragment +=  rate.timeBlock.hours + ":";
	      	}
	      	if (rate.timeBlock.minutes > 0 && rate.timeBlock.minutes < 10 && rate.timeBlock.hours > 0) {
	      		rateMessageFragment += "0" + rate.timeBlock.minutes + ":";
	      	} else {
	      		rateMessageFragment += rate.timeBlock.minutes + ":";
	      	}
	      	if (rate.timeBlock.seconds < 10) {
	      		// Pad the number with a 0
	      		rateMessageFragment += "0" + rate.timeBlock.seconds;
	      	} else {
	      		rateMessageFragment += rate.timeBlock.seconds;
	      	}
	      	rateMessageFragment += " " + unit.rate + " pace";
	      }

	      function formDistanceFragment () {
	      	//Coerce to a number
	      	distance.number *= 1;
	      	if(distance.number % 1 !== 0){
	      		distanceMessageFragment += distance.number.toFixed(2) + " " + unit.distance;
	      	} else {
	      		distanceMessageFragment += distance.number + " " + unit.distance;
	      	}
	      	if (distance.number > 1) {
	      		distanceMessageFragment += "s ";
	      	};
	      }

	      function formDurationFragment () {
	      	if(duration.timeBlock.hours !== 0){
	      		durationMessageFragment +=  duration.timeBlock.hours + " hour";
	      		if(duration.timeBlock.hours === 1){
	      			// If it equals 1, use singular and add a space for next statement
	      			durationMessageFragment += " ";
	      		} else {
	      			// Otherwise use plural
	      			durationMessageFragment += "s ";
	      		}
	      	}
	      	if (duration.timeBlock.minutes !== 0) {
	      		durationMessageFragment += duration.timeBlock.minutes + " minute";
	      		if(duration.timeBlock.minutes === 1){
	      			durationMessageFragment += " ";
	      		} else {
	      			durationMessageFragment += "s ";
	      		}
	      	}
	      	if (duration.timeBlock.seconds !== 0) {
	      		durationMessageFragment += duration.timeBlock.seconds + " second";
	      		if(duration.timeBlock.seconds === 1){
	      			durationMessageFragment += " ";
	      		} else {
	      			durationMessageFragment += "s ";
	      		}
	      	};
	      }

      	formRateFragment();
      	formDistanceFragment();
      	formDurationFragment();

	      if(isRate){
	      	return formedMessage = "At a " + rateMessageFragment + ", it will take " + durationMessageFragment + 
	      									" to go " + distanceMessageFragment;
	      } else {
	      	return formedMessage = "To go " + distanceMessageFragment + " in " + durationMessageFragment + 
	      	  						", you will need to go at a " + rateMessageFragment;
	      }
    	}
    };
  });

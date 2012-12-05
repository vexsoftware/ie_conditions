/*
 * IE Conditions
 * A JavaScript drop-in replacement for conditional IE statements that were removed in IE 10.
 *
 * Copyright (c) 2012 Vex Software LLC, released under the MIT license.
 */

(function() {
	/*
	 * Regular expression constants.
	 */
	var BROWSER_VERSION_REGEX = /MSIE ([\d.]+)/;
	var CONDITION_BLOCK_REGEX = /<!--\[if (.*|)IE(| \d+)\]>\n(.*?)\n<!\[endif\]-->/gim;
	var CONDITION_EXPRESSION_REGEX = /<!--\[if .*\]>\n(.*?)\n<!\[endif\]-->/im;
	var CONDITION_OPENER_REGEX = /<!--\[if (.*|)IE(| \d+)\]>/i;
	var OPERATOR_REGEX = /(lt|lte|gt|gte)/;
	var VERSION_REGEX = /(\d+)/;
	
	/*
	 * Evaluates the condition returning true if the conditions are meant 
	 * and false otherwise.
	 */
	evaluate = function(condition, browserVersion) {
		var conditionOpener = condition.match(CONDITION_OPENER_REGEX);
		var operator = conditionOpener[1].trim();
		var version = parseInt(conditionOpener[2].trim());
		
		if ((operator.length == 0) &&
			(isNaN(version) || browserVersion == version)) {
				return true;
		}
		
		if ((operator == "lt" && browserVersion < version) ||
			(operator == "lte" && browserVersion <= version) ||
			(operator == "gt" && browserVersion > version) ||
			(operator == "gte" && browserVersion >= version)) {
			return true;
		}
		
		return false;
	};
	
	/*
	 * Executes the expression inside the condition block by simply replacing 
	 * the entire block with just the expression.
	 */
	execute = function(condition) {
		var expression = condition.match(CONDITION_EXPRESSION_REGEX);
		
		// Replace the condition block with just the code itself.
		document.getElementsByTagName("html")[0].innerHTML = document.getElementsByTagName("html")[0].innerHTML.replace(condition, expression[1]);
	}
	
	window.addEventListener("load", function() {
		// Obtain the version of IE.
		var versionMatches = navigator.appVersion.match(BROWSER_VERSION_REGEX);
		
		// Check if there were any matches. If not, the user is likely not using IE.
		if (versionMatches == null) {
			return;
		}
		
		// Set the browser version.
		browserVersion = parseInt(versionMatches[1]);

		// Only run on IE 10 and greater.
		if (browserVersion < 10) {
			return;
		}
		
		// Parse the document for all IE condition blocks.
		var conditions = document.getElementsByTagName("html")[0].innerHTML.match(CONDITION_BLOCK_REGEX);
		
		// Process all IE condition blocks.
		for (var i = 0; i < conditions.length; i++) {
			if (evaluate(conditions[i], browserVersion)) {
				execute(conditions[i]);
			}
		}
	}, false);
})();

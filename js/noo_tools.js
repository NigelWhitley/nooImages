
//Helper methods for handling styles and stylesheets, bundled as a class
//The methods will all be static so don't use prototype as we will never instantiate a class
function nooStyles () {};

//Still indent the static methods as though they are defined inside class
	nooStyles.getSheets = function () {
		var all_sheets = new Array();
		for (var sheet_index=0; sheet_index<document.styleSheets.length; sheet_index++) {
			var sheet = document.styleSheets[sheet_index];
			var sheet_desc = sheet.href + '::' + sheet.title;
			all_sheets.push(sheet_desc);
		}
		return all_sheets;
	}

	nooStyles.getUniqueSheet = function (unique_title) {
		for (var sheet_index=0; sheet_index<document.styleSheets.length; sheet_index++) {
			var sheet = document.styleSheets[sheet_index];
			if (sheet.title == unique_title) {
				return sheet;
			}
		}
	}

	nooStyles.getSheetDescs = function () {
		var all_sheets = new Array();
		for (var sheet_index=0; sheet_index<document.styleSheets.length; sheet_index++) {
			var sheet = document.styleSheets[sheet_index];
			var sheet_desc = sheet.href + '::' + sheet.title;
			all_sheets.push(sheet_desc);
		}
		return all_sheets;
	}

	nooStyles.getInlineSheets = function () {
		var inline_sheets = new Array();
		for (var sheet_index=0; sheet_index<document.styleSheets.length; sheet_index++) {
			var sheet = document.styleSheets[sheet_index];
			if ( sheet.href === null ) {
				var sheet_desc = sheet_index;
				inline_sheets.push(sheet_desc);
			}
		}
		return inline_sheets;
	}

	nooStyles.getCrossProperty = function (property) {
		var cross_property;
		if ( ( property === 'rules' ) || ( property === 'cssRules') ) {
			cross_property = document.styleSheets[0].rules ? 'rules' : 'cssRules';
		} else if ( ( property === 'addRule' ) || ( property === 'insertRule') ) {
			cross_property = document.styleSheets[0].addRule ? 'addRule' : 'insertRule';
		} else if ( ( property === 'removeRule' ) || ( property === 'deleteRule') ) {
			cross_property = document.styleSheets[0].removeRule ? 'removedRule' : 'deleteRule';
		}
		
		return cross_property;
	}

	nooStyles.getMatchingRules = function (rule_condition) {
		var matching_rules = new Array();
		for (var sheet_index=0; sheet_index<sheet_index<document.styleSheets.length; sheet_index++) {
			//var sheet = document.styleSheets[sheet_index];
			var sheet_rules = document.styleSheets[sheet_index][nooStyles.getCrossProperty('rules')];
			for (var rule=0;rule<sheet_rules.length;rule++) {
				if ( sheet_rules[rule].selectorText === rule_condition ) {
					matching_rules.push([sheet_index, rule]);
				}
			}
		}
		return matching_rules;
	}

	nooStyles.getMatchingInlineRules = function (rule_condition) {
		var matching_rules = new Array();
		var inline_sheets = nooStyles.getInlineSheets();
		for (var sheet_index=0; sheet_index<inline_sheets.length; sheet_index++) {
			var inline_sheet = inline_sheets[sheet_index];
			var sheet_rules = document.styleSheets[inline_sheet][nooStyles.getCrossProperty('rules')];
			for (var rule=0;rule<sheet_rules.length;rule++) {
				if ( sheet_rules[rule].selectorText === rule_condition ) {
					matching_rules.push([inline_sheet, rule]);
				}
			}
		}
		return matching_rules;
	}

	nooStyles.getRuleValue = function (sheet, rule, attribute) {
		var rule_values;
		var sheet_rules = document.styleSheets[sheet][nooStyles.getCrossProperty('rules')];
		if (sheet_rules[rule].style[attribute]) {
			rule_values.push([sheet, rule, sheet_rules[rule].style[attribute]]);
		//} else {
			//matching_rules.push([sheet, rule, null]);
		}
		return rule_values;
	}

	nooStyles.changeRuleValue = function (sheet, rule, attribute, value) {
		var rules_changed = 0;
		var sheet_rules = document.styleSheets[sheet][nooStyles.getCrossProperty('rules')];
		if (sheet_rules[rule].style[attribute]) {
			sheet_rules[rule].style[attribute] = value;
			rules_changed++;
		}
		return rules_changed;
	}

	nooStyles.setRuleValue = function (sheet, rule, attribute, value) {
		var rules_changed = 0;
		var sheet_rules = document.styleSheets[sheet][nooStyles.getCrossProperty('rules')];
		sheet_rules[rule].style[attribute] = value;
		rules_changed++;
		return rules_changed;
	}

	nooStyles.setInlineRules = function (rule_condition, attribute, value) {
		var rules_changed = 0;
		var matched_rules = nooStyles.getMatchingInlineRules (rule_condition);
		for (var matched_rule=0; matched_rule < matched_rules.length; matched_rule++) {
			var sheet = matched_rules[matched_rule][0];
			var rule = matched_rules[matched_rule][1];
			nooStyles.setRuleValue(sheet, rule, attribute, value);
			rules_changed++;
		}
		return rules_changed;
	}

function noo_make_resizer_src(img_path, thumbnail_height, thumbnail_width) {
	//alert("noo_make_resizer_src 1000");
	var resizer_src = 'img_resizer.php?file=' + img_path;
	if ( typeof thumbnail_height !== 'undefined' ) {
		var resizer_src = resizer_src + '&height=' + thumbnail_height;
	}
	if ( typeof thumbnail_width !== 'undefined' ) {
		var resizer_src = resizer_src + '&width=' + thumbnail_width;
	}
	return resizer_src;
}

// because we use img_resizer we have to extract the file name from the img src attribute.
// The element is a jQuery img element, not javascript native.
function extract_img_filename(element)  {
	// because we used img_resizer we have to extract the file name
	var resize_src = element.attr("src");
	var resize_parameters_idx=resize_src.indexOf('img_resizer.php?');
	var resize_parameters=resize_src.substr(resize_parameters_idx);
	var file_start_idx=resize_parameters.indexOf('file=')+5;
	var file_start=resize_parameters.substr(file_start_idx);
	var file_end_idx=file_start.indexOf('&');
	var file_name=file_start.substr(0, file_end_idx);

	return file_name;
}

function isIE() {
	return eval("/*@cc_on!@*/!1");
}

var isOldIE = ( function () {
	if (window.attachEvent && !window.addEventListener) {
		return true;
	} else {
		return false;
	}
}) ();


var debugFramework = { debugEnabled : false, debugMain : "debug-text", debugSecondary : "debug-text-2" };
// Display a message in a predefined div
// Note that for this to work the HTML for the text node must have been created elsewhere.
debugFramework.enableDebug = function () {
	var oldDebugState = debugFramework.debugEnabled;
	debugFramework.debugEnabled = true;
	return oldDebugState;
}

debugFramework.disableDebug = function () {
	var oldDebugState = debugFramework.debugEnabled;
	debugFramework.debugEnabled = false;
	return oldDebugState;
}

debugFramework.restoreDebug = function (oldDebugState) {
	debugFramework.debugEnabled = oldDebugState;
}

debugFramework.isDebugEnabled = function () {
	return debugFramework.debugEnabled;
}

debugFramework.showMessage = function (message, append) {
	if ( debugFramework.isDebugEnabled() ) {
		//alert("throttle 1");
		var log_element = document.getElementById(debugFramework.debugMain);
		var pre_message;
		if ( typeof append === 'undefined' ) {
			pre_message = '';
		} else {
			if (isIE()) {
				pre_message = log_element.innerText + ':';
			} else {
				pre_message = log_element.textContent + ':';
			}
			//pre_message = typeof append + ':';
		}
		if (isIE()) {
			log_element.innerText=pre_message + message;
		} else {
			log_element.textContent=pre_message + message;
		}
	}
}

// Display a message in a predefined div
// Note that for this to work the HTML for the text node must have been created elsewhere.
debugFramework.showMessage2 = function (message, append) {
	if ( debugFramework.isDebugEnabled() ) {
		//alert("throttle 1");
		var log_element = document.getElementById(debugFramework.debugSecondary);
		var pre_message;
		if ( typeof append === 'undefined' ) {
			pre_message = '';
		} else {
			if (isIE()) {
				pre_message = log_element.innerText + ':';
			} else {
				pre_message = log_element.textContent + ':';
			}
			//pre_message = typeof append + ':';
		}
		if (isIE()) {
			log_element.innerText=pre_message + message;
		} else {
			log_element.textContent=pre_message + message;
		}
	}
}

//Fudge get and set textContent functions to cater for old IE limitations.
function setTextContent(element, text) {
	if (isIE()) {
		element.innerText=text;
	} else {
		element.textContent=text;
	}
}

function getTextContent(element) {
	if (isIE()) {
		return element.innerText;
	} else {
		return element.textContent;
	}
}

function noo_debug_info(message, append) {
	//alert("throttle 1");
	var log_element = $('#debug-info');
	var pre_message;
	if ( typeof append === 'undefined' ) {
		pre_message = '';
	} else {
		pre_message = log_element.text() + ':';
		//pre_message = typeof append + ':';
	}
	log_element.text(pre_message + message);
}

function noo_extra_info(message, append) {
	//alert("throttle 1");
	var log_element = $('#extra-info');
	var pre_message;
	if ( typeof append === 'undefined' ) {
		pre_message = '';
	} else {
		pre_message = log_element.text() + ':';
	}
	log_element.text(pre_message + message);
}

function noo_debounce(delay, fn) {
	var timer = null;
	//alert("throttle 1");
	return function () {
		var context = this, args = arguments;
		//alert("throttle 2");
		clearTimeout(timer);
		timer = setTimeout(function () {
			fn.apply(context, args);
		}, delay);
	};
}

function noo_throttle(limit, fn, scope) {
	if ( typeof limit === undefined ) {
		limit = 250;
	}
	var last_run, last_called, deferTimer;
	return function () {
		var context;
		if ( typeof context === 'undefined' ) {
			context = this;
		} else {
			context = scope;
		}

		var now = new Date().getTime(), args = arguments;
		var throttle_tick=function() {
				// Only call the function if this is the first request or one was made since last tick
				if ( ( typeof last_called === 'undefined' ) || ( last_called > last_run ) ) {
					run_fn();
				} else {
					// No new requests since last run so can turn off timer
					clearInterval(deferTimer);
				}
			};

		var run_fn=function() {
				last_run = now;
				fn.apply(context, args);
			};

		//if ( ( typeof last_run === undefined ) || ( now > last_run + limit ) ) {
		if ( typeof last_run === 'undefined' ) {
			// Run first time then check at regular intervals whether it needs to run again until it doesn't
			run_fn();
			deferTimer = setInterval(throttle_tick, limit);
		}
		last_called = now;
	};
}

function noo_size_debounce(limit, fn) {
	if ( typeof limit === undefined ) {
		limit = 250;
	}
	var last_run, defer_timer, after_run_timer;
	var defer_limit, after_run_limit;
	var size_debouncing = false;
	var run_height =0, run_width=0;
	defer_limit=100;
	if ( limit <= defer_limit ) {
		after_run_limit = 100;
	} else {
		after_run_limit = limit - defer_limit;
	}
	return function () {
	        //$('#margin-info').text('size_debounceing is ' + size_debounceing);
		if ( ! size_debouncing ) {
			size_debouncing = true;
			var now = new Date().getTime(), context = this, args = arguments;
		        //$('#debug-info').text('size_debouncing at ' + now);
			var run_fn_and_wait=function() {
				//$('#margin-info').text('running fn');
				last_run = now;
				var the_window=$(window)
				run_height = the_window.height();
				run_width=the_window.width();
				fn.apply(context, args);
				clearTimeout(after_run_timer);
				after_run_timer = setTimeout(function () {
					size_debouncing = false;
					//$('#margin-info').text('stopped size_debounceing');
					final_height = the_window.height();
					final_width=the_window.width();
					if ( ( run_height != final_height ) || ( run_width != final_width ) ) {
						fn.apply(context, args);
					}
				}, after_run_limit);
			};

			clearTimeout(defer_timer);
			defer_timer = setTimeout(function () {
				//$('#margin-info').text('calling fn and wait');
				run_fn_and_wait();
			}, defer_limit);

		}
	};
}

	function noo_hasClass1( has_class, element ) {
		var classname = element.className;
		var reg_exp = new RegExp( "\\b"+has_class+"\\b");
		return reg_exp.test( reg_exp, classname );
	}

	function noo_addClass1( new_class, element ) {
		if ( ! noo_hasClass( new_class, element ) ) {
			var classname = element.className;
			if ( classname.length == 0 ) {
				element.className = new_class;
			} else {
				element.className = classname + ' '  + new_class;
			}
		}
	}

	function noo_removeClass1( old_class, element ) {
		var classname = element.className;
		var reg_exp = new RegExp( "\\b"+old_class+"\\b", "g" );
		var new_classname = classname.replace( reg_exp, '' );
		element.className = new_classname;
	}

	// Check whether class defined on an element
	function noo_hasClass( has_class, element ) {
		// Adding spaces before and after means that any class names must be
		// delimited by spaces.
		var class_list = ' ' + element.className + ' ';
		var check_class = ' ' + has_class + ' ';
		if ( class_list.indexOf(check_class) === -1 ) {
			return false;
		} else {
			return true;
		}
	}

	function noo_addClass( new_class, element ) {
		if ( ! noo_hasClass( new_class, element ) ) {
			var class_list = element.className;
			if ( class_list.length == 0 ) {
				element.className = new_class;
			} else {
				element.className = class_list + ' '  + new_class;
			}
		}
	}

	function noo_removeClass( old_class, element ) {
		var class_list = ' ' + element.className + ' ';
		var check_class = ' ' + old_class + ' ';
		class_index = class_list.indexOf(check_class);
		if ( class_index !== -1 ) {
			if ( class_index !== 0 ) {
				element.className = class_list.replace(' ' + old_class, '');
			} else if ( class_list.length == check_class.length ) {
				element.className = '';
			} else {
				element.className = class_list.replace(old_class + ' ', '');
			}
		}
	}

	// Address some deficiencies in old IE
	if (! document.getElementsByClassName) { // use native implementation if available
		//alert("Non-native implementation");
		document.getElementsByClassName = function (classname){ return document.querySelectorAll('.' + classname); }
		Element.prototype.getElementsByClassName = function (classname){ return this.querySelectorAll('.' + classname); }
	}

	if (! String.prototype.trim ) { // use native implementation if available
		String.prototype.trim = function (){ return this.replace(/^\s+|\s+$/gm,''); }
	}

	if(!Array.isArray) {
		Array.isArray = function(arg) {
			return Object.prototype.toString.call(arg) === '[object Array]';
		};
	}

	if(!HTMLInputElement.prototype.setCustomValidity) {
		var setCustomValidity = function(message) {
			if ( message !== '' ) {
				alert('Validation error:' + message);
				noo_addClass('noo_invalid', this);
			} else {
				noo_removeClass('noo_invalid', this);
			}
		};
		HTMLInputElement.prototype.setCustomValidity = setCustomValidity;
		HTMLSelectElement.prototype.setCustomValidity = setCustomValidity;
		HTMLButtonElement.prototype.setCustomValidity = setCustomValidity;
		HTMLTextAreaElement.prototype.setCustomValidity = setCustomValidity;
	}


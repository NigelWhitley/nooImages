
nooValidationSets = { "sets": {} };
nooValidationSets.hasSet = function (name) {
	return ( ( typeof nooValidationSets.sets[name] !== 'undefined' ) && ( nooValidationSets.sets[name] !== undefined ) );
}

nooValidationSets.addSet = function (validationSet) {
	//alert('Adding validation set ' + validationSet.getName());
	nooValidationSets.sets[validationSet.getName()] = validationSet;
}

nooValidationSets.getSet = function (name) {
	return nooValidationSets.sets[name];
}

nooValidationSets.listSets = function () {
	var setNames = new Array();
	for (var name in nooValidationSets.sets) {
		setNames.push(name);
	}
	return setNames;
}

// The validation object should act against a set of parameter values
// Each object must specify the name of the validation rules within the set 
// and the value to be validated plus optionally a related HTML element.
nooParameterValidation = function(name, value, HTML_element) {
	this.name = name;
	this.value = value;
	this.HTML_element = HTML_element;
};

function nooValidationSet (name, type, message) {
	// List of functions for the basic actions this set of parameters will need
	var this_set = this;
	this.name = name;
	this.type = type;
	this.message = message;

	//rules have an action, a filter and additional arguments dependent on action
	this.rules = new Array();
	//this.set_default_values = function () {;};

	nooValidationSet.prototype.getSet = function (name) {
		return nooValidationSets.getSet(name);
	}

	nooValidationSet.prototype.getName = function() {
		return this.name;
	}

	nooValidationSet.prototype.getType = function() {
		return this.type;
	}

	nooValidationSet.prototype.getRuleCount = function() {
		return this.rules.length;
	}

	nooValidationSet.prototype.hasRules = function() {
		if ( this.getRuleCount() === 0 ) {
			return false;
		} else {
			return true;
		}
	}

	nooValidationSet.prototype.getRule = function(rule_index) {
		return this.rules[rule_index];
	}

	nooValidationSet.prototype.chainValidate = function(name, value) {
		return this.getSet(name).isValidValue(value);
	}

	nooValidationSet.prototype.validIfAllMet = function(value) {
		if ( this.hasRules() ) {
			// Result is invalid if any rule fails so initially assume true
			var error_message = '';
			for ( var rule_index =0; rule_index < this.rules.length; rule_index++ ) {
				rule_message = this.rules[rule_index].test(value);
				if ( rule_message !== '' ) {
					error_message = rule_message;
					break;
				}
			}
			return error_message;
		} else {
			// If there are no rules then the value is (implicitly) valid
			return '';
		}
	}

	nooValidationSet.prototype.validIfAnyMet = function(value) {
		if ( this.hasRules() ) {
			// Result is invalid if any rule true so initially assume false
			var error_message = undefined;
			for ( var rule_index = 0; rule_index < this.rules.length; rule_index++ ) {
				rule_message = this.rules[rule_index].test(value);
				if ( rule_message === '' ) {
					error_message = '';
					break;
				}
			}
			return error_message;
		} else {
			// If there are no rules then the value is (implicitly) valid
			return '';
		}
	}

	nooValidationSet.prototype.isValidValue = function(value) {
		//alert('Validating ' + value);
		if ( this_set.hasRules() ) {
			//alert('Has rules ');
			var set_type = this.getType();
			var error_message;
			if ( set_type === 'any' ) {
				//alert('Doing action ' + action + ' without parameters');
				error_message = this.validIfAnyMet(value);
			} else if (set_type  === 'all' ) {
				error_message = this.validIfAllMet(value);
			} else {
				error_message = 'Invalid validation set type';
				alert('Invalid validation set type ' + set_type + ' for set ' + this.getName() );
			}
			if ( typeof error_message === 'undefined' ) {
				error_message = this.message;
			}
			return error_message;
		} else {
			return '';
		}
	}

	// A validation rule is part of a group of rules assigned a name within a parameter set.
	// Each rule has a rule action which can be
	// a) match - the value must match the specified pattern
	// b) exclude - the value must NOT match the specified pattern
	// c) custom - name of a Javascript function to call
	// d) chain - name of another validation set
	// Each rule returns true if the condition is met and false otherwise.
	// Breaking the patterns down in this way facilitates construction of complex rules from
	// simple elements.
	nooValidationSet.prototype.addRule = function(action, filter, message, additional) {
		var rule = {};
		rule.action = action;
		rule.filter = filter;
		rule.additional = additional;
		rule.message = message;

		rule.test = (function () {
			if ( action === 'match' ) {
				var flags = additional;
				if ( typeof additional === 'undefined' ) {
					flags = "";
				}
				return ( function (value) {
					//alert('constraint flags ' + flags);
					var constraint = new RegExp(filter, flags);
					if ( constraint.test(value) ) {
						return '';
					} else {
						return message;
					}
				});
			} else if ( action === 'exclude' ) {
				var flags = additional;
				if ( typeof additional === 'undefined' ) {
					flags = "";
				}
				return ( function (value) {
					var constraint = new RegExp(filter, flags);
					if ( constraint.test(value) ) {
						return message;
					} else {
						return '';
					}
				});
			} else if ( action === 'chain' ) {
				return ( function (value) {
					return this_set.validateAny(action, value, message, additional);
				});
			} else if ( type === 'custom' ) {
				return ( function (value) {
					return action(value, message, additional);
				});
			} else {
				alert ('Invalid validation rule type ' + type + ' specified');
				return ( function (value) {
					return undefined;
				});
			}
		}) ();
		this.rules.push(rule);
	}

	// A validation rule is part of a group of rules assigned a name within a parameter set.
	// Each rule has a rule action which can be
	// a) match - the value must match the specified pattern
	// b) exclude - the value must NOT match the specified pattern
	// c) custom - name of a Javascript function to call
	// d) chain - name of another validation set
	// Each rule returns true if the condition is met and false otherwise.
	// Breaking the patterns down in this way facilitates construction of complex rules from
	// simple elements.
	nooValidationSet.prototype.makeRule = function(action, filter, message, additional) {
		var rule = {};
		rule.action = action;
		rule.filter = filter;
		rule.additional = additional;
		rule.message = message;

		rule.test = (function () {
			if ( action === 'match' ) {
				var flags = additional;
				if ( typeof additional === 'undefined' ) {
					flags = "";
				}
				return ( function (value) {
					//alert('constraint flags ' + flags);
					var constraint = new RegExp(filter, flags);
					if ( constraint.test(value) ) {
						return '';
					} else {
						return message;
					}
				});
			} else if ( action === 'exclude' ) {
				var flags = additional;
				if ( typeof additional === 'undefined' ) {
					flags = "";
				}
				return ( function (value) {
					var constraint = new RegExp(filter, flags);
					if ( constraint.test(value) ) {
						return message;
					} else {
						return '';
					}
				});
			} else if ( action === 'chain' ) {
				return ( function (value) {
					return this_set.validateAny(action, value, message, additional);
				});
			} else if ( type === 'custom' ) {
				return ( function (value) {
					return action(value, message, additional);
				});
			} else {
				alert ('Invalid validation rule type ' + type + ' specified');
				return ( function (value) {
					return undefined;
				});
			}
		}) ();
		return rule;
	}

	nooValidationSet.prototype.addRules = function(rules) {
		var new_rules = new Array();
		if ( Array.isArray(rules) ) {
			for ( var rule_index =0; rule_index < rules.length; rule_index++ ) {
				new_rules.push(rules[rule_index]);
				//this.parameter_names.push(actions[action_index]);
			}
		} else {
			//alert('New rule is type ' + typeof rules);
			new_rules.push(rules);
		}
		if ( this.hasRules() ) {
			this.rules = this.rules.concat(new_rules);
		} else {
			this.rules = new_rules;
		}
	}

	nooValidationSet.prototype.doValidation = function(name, value) {
		if ( this.hasValidationRules(name) ) {
			// Result is invalid if any rule fails so initially assume true
			var error_message = '';
			for ( var rule_index =0; rule_index < this.validation_rules[name].length; rule_index++ ) {
				rule_message = this.validation_rules[name][rule_index].validateAll();
				if ( rule_message !== '' ) {
					error_message = rule_message;
					break;
				}
			}
			return error_message;
		} else {
			// If there are no rules then the value is (implicitly) valid
			return '';
		}
	}

	nooValidationSet.prototype.definitionIsComplex = function(name) {
		if ( this.hasParameter(name) ) {
			var definition = this.getDefinition(name);
			if ( definition.indexOf(":") !== -1 ) {
				return true;
			} else {
				return false;
			}
		} else {
			return undefined;
		}
	}

}


	// Define some "standard" validation rules
	var integer_rules = new nooValidationSet ('integer', 'any', 'Only digits 0 to 9 permitted here');
	integer_rules.addRule('match', '^[0-9]+$', 'Not a valid integer', '');
	//integer_rules.addRule('exclude', '[^0-9]+', 'Not a valid integer', '');
	nooValidationSets.addSet(integer_rules);
	var size_rules = new nooValidationSet ('size', 'any', 'Invalid size');
	size_rules.addRule('match', '^[0-9]+$', 'Not a valid size', '');
	size_rules.addRule('match', '^[0-9]+px$', 'Not a valid pixel size', '');
	size_rules.addRule('match', '^[0-9]+%$', 'Not a valid size percentage', '');
	size_rules.addRule('match', '^[0-9]+em$', 'Not a valid size from font', '');
	size_rules.addRule('match', '^[0-9]+EM$', 'Not a valid size from font', '');
	nooValidationSets.addSet(size_rules);
	var colour_rules = new nooValidationSet ('colour', 'any', 'Invalid colour');
	colour_rules.addRule('match', '^[a-z]+$', 'Not a valid alpha colour name', '');
	colour_rules.addRule('match', '^[a-z]+[0-9]?$', 'Not a valid colour name', '');
	colour_rules.addRule('match', '^#[0-9a-fA-F]{6}$', 'Not a valid colour value', '');
	nooValidationSets.addSet(colour_rules);




nooParameterSets = { "sets": {} };
nooParameterSets.addSet = function (name, parameterSet) {
	nooParameterSets.sets[name] = parameterSet;
}

nooParameterSets.getSet = function (name) {
	return nooParameterSets.sets[name];
}

nooParameterSets.listSets = function () {
	var setNames = new Array();
	for (var name in nooParameterSets.sets) {
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

function nooParameterSet () {
	// List of functions for the basic actions this set of parameters will need
	var this_set = this;
	this.action_names = {'default': undefined, 'copy': undefined, 'update': undefined};
	//parameters definitions are the name and its type. May extend this to some validation
	this.parameter_definitions = {};
	this.AJAX_parameter_definitions = {};
	this.validation_rules = {};
	this.default_values = undefined;
	//this.set_default_values = function () {;};

	nooParameterSet.prototype.clearActionFunctions = function(actions) {
		if ( Array.isArray(actions) ) {
			for ( var action_index =0; action_index < actions.length; action_index++ ) {
				this.action_names[actions[action_index]] = undefined;
				//this.parameter_names.push(actions[action_index]);
			}
		} else {
			this.action_names[actions] = undefined;
		}
	}

	nooParameterSet.prototype.addActions = function(actions) {
		if ( Array.isArray(actions) ) {
			for ( var action_index =0; action_index < actions.length; action_index++ ) {
				this.action_names[actions[action_index]] = undefined;
				//this.parameter_names.push(actions[action_index]);
			}
		} else {
			this.action_names[actions] = undefined;
		}
	}

	nooParameterSet.prototype.addActionFunction = function(action, functionToAdd) {
		if ( this.hasAction(action) ) {
			this.action_names[action] = functionToAdd;
				//this.parameter_names.push(actions[action_index]);
		} else {
			this.action_names[action] = functionToAdd;
		}
	}

	nooParameterSet.prototype.hasAction = function(action) {
		if ( this.action_names.hasOwnProperty(action) ) {
			return true;
		} else {
			return false;
		}
	}

	nooParameterSet.prototype.doAction = function(action, this_parameters, actionParameters) {
		//alert('Doing action ' + action);
		if ( this.hasAction(action) ) {
			//alert('Has action ' + action);
			if ( typeof actionParameters === 'undefined' ) {
				//alert('Doing action ' + action + ' without parameters');
				this.action_names[action](this_parameters);
			} else {
				//alert('Doing action ' + action + ' with parameters');
				this.action_names[action](this_parameters, actionParameters);
			}
		}
	}

	nooParameterSet.prototype.hasLocalParameter = function(name) {
		if ( typeof this.parameter_definitions[name] === 'undefined' ) {
			return false;
		} else {
			return true;
		}
	}

	nooParameterSet.prototype.hasAJAXParameter = function(name) {
		if ( typeof this.AJAX_parameter_definitions[name] === 'undefined' ) {
			return false;
		} else {
			return true;
		}
	}

	nooParameterSet.prototype.hasParameter = function(name) {
		if ( ! this.hasLocalParameter(name)) {
			return this.hasAJAXParameter(name);
		} else {
			return true;
		}
	}

	// A validation rule is part of a group of rules assigned a name within a parameter set.
	// Each rule has a filter type which can be
	// a) match - the value must match the specified pattern
	// b) exclude - the value must NOT match the specified pattern
	// c) custom - name of a Javascript function to call
	// Each rule returns true if the condition is met and false otherwise.
	// Breaking the patterns down in this way facilitates construction of complex rules from
	// simple elements.
	nooParameterSet.prototype.hasValidation = function(name) {
		if ( ( typeof this.validation_rules[name] === 'undefined' ) || ( ! nooValidationSets.hasSet(this.validation_rules[name]) ) ) {
			return false;
		} else {
			return true;
		}
	}

	nooParameterSet.prototype.setValidation = function(name, rule_name) {
		if ( this.hasParameter(name) ) {
			this.validation_rules[name] = rule_name;
		}
	}

	nooParameterSet.prototype.getValidation = function(name) {
		if ( this.hasParameter(name) ) {
			return this.validation_rules[name];
		} else {
			return undefined;
		}
	}

	// The check for a valid value almost mirrors the setCustomValidity method
	// where returning an empty string indicates the value is valid.
	nooParameterSet.prototype.isValidValue = function(parameter_name, value) {
		if ( this.hasParameter(parameter_name) && this.hasValidation(parameter_name) ) {
			var definition = this.getDefinition(parameter_name);
			var rule_name = this.getValidation(parameter_name);
			var rule_set = nooValidationSets.getSet(rule_name);
			var message;
			if ( this.definitionIsComplex(parameter_name) ) {
				message =  this.isValidComplexValue (definition, rule_set, value);
			} else {
				message = this.isValidSimpleValue(rule_set, value);
			}
			return message;
		} else {
			return '';
		}
	}

	// The check for a valid value almost mirrors the setCustomValidity method
	// where returning an empty string indicates the value is valid.
	nooParameterSet.prototype.isValidNodeValue = function(parameter_name, value) {
		if ( this.hasParameter(parameter_name) && this.hasValidation(parameter_name) ) {
			//var definition = this.getDefinition(parameter_name);
			var rule_name = this.getValidation(parameter_name);
			var rule_set = nooValidationSets.getSet(rule_name);
			var message = rule_set.isValidValue(value);
			return message;
		} else {
			return '';
		}
	}

	// The check for a valid value almost mirrors the setCustomValidity method
	// where returning an empty string indicates the value is valid.
	nooParameterSet.prototype.isValidSimpleValue = function(rule_set, value) {
		var message = rule_set.isValidValue(value);
		return message;
	}

	// The check for a valid value almost mirrors the setCustomValidity method
	// where returning an empty string indicates the value is valid.
	nooParameterSet.prototype.isValidComplexValue = function(definition, rule_set, value) {
		var separator_index = definition.indexOf(':');
		if ( separator_index === -1 ) {
			// Not complex definition so can just validate Simple
			return this.isValidSimpleValue(rule_set, value);
		} else {
			var highest_definition = definition.substr(0, separator_index);
			if ( highest_definition === "array" ) {
				var lower_definition = definition.substr(separator_index+1);
				var message = '';
				if ( Array.isArray(value) ) {
					var lower_definition = definition.substr(separator_index+1);
					// This assumes that the complex_value meet the definition so is an array.
					$.each(value, function(inner_key, inner_value) {
						var inner_message = this.isValidComplexValue(lower_definition, rule_set, inner_value);
						if ( inner_message !== '' ) {
							if ( ( message === '' ) || ( typeof message === 'undefined' )  || ( typeof inner_message !== 'undefined' ) ) {
								message = inner_message;
							}
						}
					});
					return message;
				} else {
					return 'Value not matching definition - should be an array';
				}
			} else {
				//unknown complex definition
				return 'Invalid definition';
			}
		}

	}

	//Get the names of the parameters
	nooParameterSet.prototype.getAllParameterNames = function() {
		var all_names = this.getAllAJAXParameterNames();
		for ( var name in this.parameter_names ) {
			if ( this.parameter_names.hasOwnProperty(name) ) {
				all_names.push(name);
			}
		}
		return all_names;
	}

	//Get the names of the parameters
	nooParameterSet.prototype.getAllLocalParameterNames = function() {
		var all_names = new Array();
		for ( var name in this.parameter_names ) {
			if ( this.parameter_names.hasOwnProperty(name) ) {
				all_names.push(name);
			}
		}
		return all_names;
	}

	//Get the names of the AJAX parameters
	nooParameterSet.prototype.getAllAJAXParameterNames = function() {
		var all_names = new Array();
		//noo_debug_info("setAJAX:=");
		for ( var name in this.AJAX_parameter_definitions ) {
			//noo_debug_info("name=" + name, "append");
			if ( this.AJAX_parameter_definitions.hasOwnProperty(name) ) {
				all_names.push(name);
			}
		}
		return all_names;
	}

	nooParameterSet.prototype.addDefinition = function(name, type) {
		if ( this.hasParameter(name) ) {
			alert('parameter ' + name + ' is already defined. Use makeDefinition instead to set as type ' + type);
		} else {
			this.makeDefinition(name, type);
		}
	}

	nooParameterSet.prototype.makeDefinition = function(name, type) {
		this.parameter_definitions[name] = type;
	}

	nooParameterSet.prototype.addAJAXDefinition = function(name, type) {
		if ( this.hasParameter(name) ) {
			alert('parameter ' + name + ' is already defined. Use makeDefinition instead to set as type ' + type);
		} else {
			this.makeAJAXDefinition(name, type);
		}
	}

	nooParameterSet.prototype.makeAJAXDefinition = function(name, type) {
		this.AJAX_parameter_definitions[name] = type;
		var default_validation = this.getNodeDefinition(name);
		this.setValidation(name, default_validation);
	}

	nooParameterSet.prototype.getDefinition = function(name) {
		if ( this.hasAJAXParameter(name) ) {
			return this.AJAX_parameter_definitions[name];
		} else {
			if ( this.hasLocalParameter(name) ) {
				return this.parameter_definitions[name];
			} else {
				alert('parameter ' + name + ' not defined. Cannot get type');
				return undefined;
			}
		}
	}

	nooParameterSet.prototype.definitionIsComplex = function(name) {
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

	nooParameterSet.prototype.getNodeDefinition = function(name) {
		var definition = this.getDefinition(name);
		var node_start = definition.lastIndexOf(":");
		if ( node_start === -1 ) {
			return definition;
		} else {
			return definition.substr(node_start+1);
		}
	}

	//Get the names of the actions - not sure why anyone would need this.
	nooParameterSet.prototype.getActions = function() {
		var all_actions = new Array();
		for ( var action in this.action_names ) {
			if ( this.action_names.hasOwnProperty(action) ) {
				all_actions.push(action);
			}
		}
		return all_actions;
	}

}


function nooParameters (parameterSetName) {
	//this.parameter_names = new Array('item_border','list_size','file_patterns','file_list','content_class','thumbnail_frame','thumbnail_trim','thumbnail_height','thumbnail_width','thumbnail_margin');
	var this_parameters = this;
	this.parameter_set_name = parameterSetName;
	this.parameter_values = {};
	

	nooParameters.prototype.getParameterSet = function() {
		return nooParameterSets.getSet(this.getParametersName());
		//return nooParameterSets.getSet(this.parameter_set_name);
	}

	nooParameters.prototype.getParametersName = function() {
		return this.parameter_set_name;
	}

	// Only try to get the definition if the name exists in the set
	nooParameters.prototype.getDefinition = function(name) {
		var parameter_set = this.getParameterSet();
		if ( parameter_set.hasParameter(name) ) {
			return parameter_set.getDefinition(name);
		} else {
			return undefined;
		}
	}

	// For a complex definition this returns the deepest element
	// For a "simple" definition this just returns the definition
	// Typically used for validation.
	nooParameters.prototype.getNodeDefinition = function(name) {
		var parameter_set = this.getParameterSet();
		if ( parameter_set.hasParameter(name) ) {
			return parameter_set.getDefinition(name);
		} else {
			return undefined;
		}
	}

	nooParameters.prototype.isValidValue = function(name, value) {
		var parameter_set = this.getParameterSet();
		if ( parameter_set.hasParameter(name) ) {
			return parameter_set.isValidValue(name, value);
		} else {
			return undefined;
		}
	}

	nooParameters.prototype.isValidNodeValue = function(name, value) {
		var parameter_set = this.getParameterSet();
		if ( parameter_set.hasParameter(name) ) {
			return parameter_set.isValidNodeValue(name, value);
		} else {
			return undefined;
		}
	}

	// buildComplexValue moves recursively down through each level in the definition 
	// until it reaches an atomic value (string and integer for now). At each level 
	// above the lowest, it makes and returns a copy of the defined values.
	nooParameters.prototype.buildComplexValue = function(definition, from_values) {
		var separator_index = definition.indexOf(':');
		if ( separator_index === -1 ) {
			if ( definition === 'integer' ) {
				return parseInt(from_values);
			} else {
				return from_values;
			}
		} else {
			var highest_definition = definition.substr(0, separator_index);
			if ( highest_definition === "array" ) {
				var lower_definition = definition.substr(separator_index+1);
				var copied_values = new Array();
				// This assumes that the from_values meet the definition so is an array.
				for ( var array_index = 0; array_index < from_values.length; array_index++ ) {
					copied_values.push( this.buildComplexValue(lower_definition, from_values[array_index]) );
				}
				return copied_values;
			} else {
				//unknown complex definition
				return undefined;
			}
		}
	}

	// setValue should probably behave differently depending on the definition but keep it simple for now
	nooParameters.prototype.setValue = function(name, value) {
		var parameter_set = this.getParameterSet();
		// Only try to set the value if the name exists in the set
		if ( parameter_set.hasParameter(name) ) {
			//this.parameter_values[name] = value;
			this.parameter_values[name] = this.buildComplexValue(this.getDefinition(name), value);
		}
	}

	// getValue should probably behave differently depending on the definition but keep it simple for now
	nooParameters.prototype.getValue = function(name) {
		var parameter_set = this.getParameterSet();
		// Only try to set the value if the name exists in the set
		if ( parameter_set.hasParameter(name) ) {
			return this.parameter_values[name];
		} else {
			return undefined;
		}
	}

	// getAllNames will actually rely on the parameterSet not just those with values
	nooParameters.prototype.getAllNames = function() {
		var parameter_set = this.getParameterSet();
		return parameter_set.getAllParameterNames();
	}

	// getAllAJAXNames will actually rely on the parameterSet not just those with values
	nooParameters.prototype.getAllAJAXNames = function() {
		//noo_debug_info("Name " + this.parameter_set_name);
		var parameter_set = this.getParameterSet(this.parameter_set_name);
		return parameter_set.getAllAJAXParameterNames();
	}

	// getAllValueNames will report on just the defined values
	nooParameters.prototype.getAllValueNames = function() {
		var parameter_set = this.getParameterSet(this.parameter_set_name);
		var all_names = new Array();
		for ( var parameter_name in this.parameter_values ) {
			all_names.push(parameter_name);
		}
		return all_names;
	}

	// getAllAJAXValueNames will report on just the defined values which should exist on the (AJAX) server
	nooParameters.prototype.getAllAJAXValueNames = function() {
		var parameter_set = this.getParameterSet(this.parameter_set_name);
		var all_names = new Array();
		for ( var parameter_name in this.parameter_values ) {
			if ( this.parameter_values.hasAJAXParameter(parameter_name) ) {
				all_names.push(parameter_name);
			}
		}
		return all_names;
	}

	// Copies a single parameter value from another set of parameters
	nooParameters.prototype.copyParameterValue = function(parameter_name, from_parameters) {
		//var definition = this.getDefinition(name);
		this.setValue( parameter_name, from_parameters.getValue(parameter_name) );
	}

	// Copies all defined AJAX parameter values from another set of parameters
	nooParameters.prototype.copyAJAXValues = function(from_parameters) {
		//var definition = this.getDefinition(name);
		var all_names = from_parameters.getAllAJAXValueNames();
		for ( var name_index = 0; name_index < all_names.length; name_index++ ) {
			//this.setValue( all_names[name_index], from_parameters.getValue(all_names[name_index]) );
			this.copyParameterValue(all_names[name_index], from_parameters);
		}
	}

	// Copies all defined parameter values from another set of parameters
	nooParameters.prototype.copyAllValues = function(from_parameters) {
		//var definition = this.getDefinition(name);
		//var all_names = from_parameters.getAllValueNames();
		//for ( var name_index = 0; name_index < all_names.length; name_index++ ) {
			//this.setValue( all_names[name_index], from_parameters.getValue(all_names[name_index]) );
		//}
		if ( ( typeof from_parameters !== 'undefined' ) && ( typeof from_parameters !== 'undefined' ) ) {
			for ( var name in from_parameters.parameter_values ) {
				if ( from_parameters.parameter_values.hasOwnProperty(name) ) {
					//this.setValue(name, from_values.getValue(name));
					this.copyParameterValue(name, from_parameters);
				}
			}
			return true;
		} else {
			return false;
		}
	}

	// buildComplexValue moves recursively down through each level in the definition 
	// until it reaches an atomic value (string and integer for now). At each level 
	// above the lowest, it makes and returns a copy of the defined values.
	nooParameters.prototype.buildComplexValue = function(definition, from_values) {
		var separator_index = definition.indexOf(':');
		if ( separator_index === -1 ) {
			return from_values;
		} else {
			var highest_definition = definition.substr(0, separator_index);
			if ( highest_definition === "array" ) {
				var lower_definition = definition.substr(separator_index+1);
				var copied_values = new Array();
				// This assumes that the from_values meet the definition so is an array.
				for ( var array_index = 0; array_index < from_values.length; array_index++ ) {
					copied_values.push( this.buildComplexValue(lower_definition, from_values[array_index]) );
				}
				return copied_values;
			} else {
				//unknown complex definition
				return undefined;
			}
		}
	}

	// Called to retrieve parameter values from the server via AJAX
	nooParameters.prototype.fromServer = function(which_parameters, success_function) {
		var parameter_set = this.getParameterSet(this.parameter_set_name);
		//noo_extra_info("set Name " + this.parameter_set_name);

		var local_parameters = this;
		if ( ( typeof which_parameters === 'undefined' ) || ( which_parameters == 'all' ) ) {
			which_parameters = this.getAllAJAXNames();
		}

		var parameters_object = {};
		//var parameters_array = new Array();
		//noo_extra_info("Checking type of parameters");
		//noo_debug_info(typeof which_parameters + " of parameters");
		if ( Array.isArray(which_parameters) ) {
			//noo_debug_info("Array of parameters " + which_parameters.length);
			var array_count = which_parameters.length;
			//which_parameters.forEach(function(parameter_name, parameter_key) {
			for (var parameter_key = 0; parameter_key < array_count; parameter_key++ ) {
				var parameter_name = which_parameters[parameter_key];
				if ( parameter_set.hasAJAXParameter(parameter_name) ) {
					//noo_debug_info("OK:", "append");
					//parameters_object[parameter_name]=local_parameters.parameter_values[parameter_name];
					parameters_object[parameter_name]=null;
					//noo_debug_info(":key=" + parameter_name + ":value=" + parameters_object[parameter_name], "append");
					//parameters_array.push(parameter_name);
				}
			}
		} else {
			if ( parameter_set.hasAJAXParameter(which_parameters) ) {
				parameters_object[which_parameters]=local_parameters.parameter_values[which_parameters];
			}
		}

		var extractComplexValue = function(definition, complex_value) {
			var separator_index = definition.indexOf(':');
			if ( separator_index === -1 ) {
				return complex_value;
			} else {
				var highest_definition = definition.substr(0, separator_index);
				if ( highest_definition === "array" ) {
					var lower_definition = definition.substr(separator_index+1);
					var extracted_values = new Array();
					// This assumes that the complex_value meet the definition so is an array.
					$.each(complex_value, function(inner_key, inner_value) {
						extracted_values.push( extractComplexValue(lower_definition, inner_value) );
					});
					//local_parameters.setValue(data_key, array_values);
					//for ( var array_index = 0; array_index < complex_value.length; array_index++ ) {
						//copied_values.push( extractComplexValue(lower_definition, complex_value[array_index]) );
					//}
					return extracted_values;
				} else {
					//unknown complex definition
					return undefined;
				}
			}
		}

		var extract_parameters = function(data) {
			//noo_debug_info(typeof data);
			//noo_extra_info(data.constructor);
			//noo_extra_info(data);
			//noo_extra_info(":");
			$.each(data, function(data_key, data_value) {
				//noo_extra_info("key=" + data_key + ":value=" + data_value + ":", "append");
				var definition = parameter_set.getDefinition(data_key);
				local_parameters.setValue( data_key, extractComplexValue(definition, data_value) );
			});
		}

		$.ajax( {
			url: 'noo_ajax.php?action=get_parameters',  
			data: parameters_object,
			dataType: 'JSON',
			type: 'POST',
			success: function(json_data) { 
				//noo_debug_info("json_success");
				extract_parameters(json_data);
				if ( typeof success_function !== 'undefined' ) {
					success_function(json_data);
				}
			}
		});
	}

	nooParameters.prototype.toServer = function(which_parameters, success_function) {
		var parameter_set = this.getParameterSet(this.parameter_set_name);
		//noo_extra_info("toServer set Name " + this.parameter_set_name);

		var local_parameters = this;
		if ( ( typeof which_parameters === 'undefined' ) || ( which_parameters == 'all' ) ) {
			which_parameters = this.getAllAJAXNames();
			//alert('updating all parameters');
		}
		//alert('updating parameters');

		//noo_extra_info("toServer param count " + which_parameters.length);
		var parameters_object = {};
		//noo_extra_info("Checking type of parameters");
		//noo_debug_info(typeof which_parameters + " of parameters");
		if ( Array.isArray(which_parameters) ) {
			//noo_debug_info("Array of parameters " + which_parameters.length);
			//alert('updating array of parameters');
			var array_count = which_parameters.length;
			//which_parameters.forEach(function(parameter_name, parameter_key) {
			for (var parameter_key = 0; parameter_key < array_count; parameter_key++ ) {
				var parameter_name = which_parameters[parameter_key];
				//alert('checking parameter ' + parameter_name);
				if ( parameter_set.hasAJAXParameter(parameter_name) ) {
					//noo_debug_info("OK:", "append");
					//parameters_object[parameter_name]=local_parameters.parameter_values[parameter_name];
					//alert('updating parameter ' + parameter_name);
					parameters_object[parameter_name]=local_parameters.getValue(parameter_name);
					//noo_debug_info(":key=" + parameter_name + ":value=" + parameters_object[parameter_name], "append");
					//parameters_array.push(parameter_name);
				}
			}
		} else {
			//alert('updating parameter ' + which_parameters);
			if ( parameter_set.hasAJAXParameter(which_parameters) ) {
				parameters_object[which_parameters]=local_parameters.parameter_values[which_parameters];
			}
		}

		//noo_extra_info("toServer param object set ");

		$.ajax( {
			url: 'noo_ajax.php?action=set_parameters',  
			data: parameters_object,
			dataType: 'JSON',
			type: 'POST',
			success: function(json_data) { 
				//noo_debug_info("json_success");
				//noo_debug_info(JSON.stringify(parameters_object));
				//noo_extra_info(parameters_object);
				if ( typeof success_function !== 'undefined' ) {
					success_function(json_data);
				}
			}
		});
	}

	nooParameters.prototype.doAction = function(action, action_parameters) {
		var parameter_set = this.getParameterSet();
		//alert('doAction param action is ' + action + ' set is ' + this.getParametersName() );
		parameter_set.doAction(action, this, action_parameters);
	}

	//noo_debug_info('Creating ' + parameterSetName + ":" + typeof parameterSetName);
	if ( typeof parameterSetName === 'string' )
	{
		//noo_debug_info(parameterSetName);
		this.parameter_set_name = parameterSetName;
		var parameter_set = this.getParameterSet(this.parameter_set_name);
		this.parameter_values = {};
		if ( typeof parameter_set.set_default_values !== 'undefined' ) {
			parameter_set.set_default_values(this);
		}
	}

}

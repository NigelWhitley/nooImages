
function nooReconfigure() {

	// define a variable to hold this parameter name because it is used in many places
	var patterns_parameter_name = 'file_patterns';
	var this_object = this;
	this.gallery_parameters = new nooParameters('gallery');
	this.slideshow_parameters = new nooParameters('slideshow');
	this.configuration_valid = true;

	// Set the maximum number of rows to display for file patterns
	nooReconfigure.prototype.set_pattern_window_rows = function (number_of_rows) {
		this.pattern_window_rows = number_of_rows;
	}

	//Populate the specified text configuration parameter on the form
	nooReconfigure.prototype.load_text_parameter = function (this_parameters, parameter_name) {
		//noo_extra_info('Data is ' + this_parameters[parameter_name]);
		//var this_parameters = this;
		$('#' + nooReconfigure.parameter_to_field_name(parameter_name) + ' input').each(function() {
			$(this).val(this_parameters.getValue(parameter_name));
			$(this).get(0).setCustomValidity('');
			$(this).blur(function(input_element) {
				//alert('Blur for ' + parameter_name);
				this_object.check_text_parameter(this_parameters, parameter_name);
			});
		});
	}

	//Populate the specified text array configuration parameter on the form
	nooReconfigure.prototype.load_text_array_parameter = function (this_parameters, parameter_name) {
		var parameter_array = this_parameters.getValue(parameter_name);
		//alert('got value for ' + parameter_name + ' values: ' + parameter_array);

		//noo_debug_info("file_patterns: count=" + gallery_parameters.getValue('file_patterns').length + ":");
		var array_count = parameter_array.length;
		//parameter_array.forEach(function(array_value, array_key) {
		for (var array_key = 0; array_key < array_count; array_key++ ) {
			var array_value = parameter_array[array_key];
			//file_pattern_1
			//noo_debug_info("key=" + pattern_key + ",value=" + pattern_value + ":", "append");

			var parameter_index = array_key + 1;
			//alert('applying value ' + array_value + ' to field name ' + nooReconfigure.parameter_to_field_name(parameter_name, parameter_index));
			$('#' + nooReconfigure.parameter_to_field_name(parameter_name, parameter_index)).each(function() {
				//alert('field name ' + nooReconfigure.parameter_to_field_name(parameter_name, parameter_index) + ' value: ' + array_value);
				$(this).get(0).setCustomValidity('');
				$(this).val(array_value);
			});
		}

	}

	//Populate the specified text configuration parameter on the form
	nooReconfigure.prototype.load_select_parameter = function (this_parameters, parameter_name) {
		//noo_extra_info(typeof parameter_name);
		//var this_parameters = this;
		$('#' + nooReconfigure.parameter_to_field_name(parameter_name)).each(function() {
			$(this).val(this_parameters.getValue(parameter_name));
		});
	}

	//Get the specified text configuration parameter from the form
	nooReconfigure.prototype.set_text_parameter = function (this_parameters, parameter_name) {
		//var this_parameters = this;
		$('#' + nooReconfigure.parameter_to_field_name(parameter_name)).find('input').each(function() {
			this_parameters.setValue(parameter_name, $(this).val());
		});
	}

	//Populate the specified text array configuration parameter on the form
	nooReconfigure.prototype.set_text_array_parameter = function (this_parameters, parameter_name) {
		//noo_extra_info('Data is ' + this_parameters[parameter_name]);
		//var this_parameters = this;
		//alert('Setting text array');
		var field_name = nooReconfigure.parameter_to_field_name(parameter_name);
		var input_elements = $('#' + field_name + ' input');
		var input_count = input_elements.length;

		// We will assume the last input element is blank (because it should be for this case);
		input_count--;
		input_index = 1;

		var parameter_array = new Array();
		//noo_debug_info("file_patterns: count=" + gallery_parameters.getValue('file_patterns').length + ":");
		for ( var input_index = 1; input_index <= input_count; input_index++ ) {
			//alert( 'array index ' + input_index + ' name ' + nooReconfigure.parameter_to_field_name(parameter_name, input_index) );
			$('#' + nooReconfigure.parameter_to_field_name(parameter_name, input_index)).each(function() {
				//alert( 'pushing array index ' + input_index + ' -:- value ' + $(this).val() );
				parameter_array.push($(this).val());
			});
			//input_index++;
		}

		this_parameters.setValue(parameter_name, parameter_array);
	}

	//Get the specified text configuration parameter from the form
	nooReconfigure.prototype.set_select_parameter = function (this_parameters, parameter_name) {
		//var this_parameters = this;
		$('#' + nooReconfigure.parameter_to_field_name(parameter_name)).each(function() {
			this_parameters.setValue(parameter_name, $(this).val());
			//alert('Setting ' + parameter_name + ' to ' + $(this).val() + ' from select');
		});
	}

	nooReconfigure.prototype.add_blank_file_patterns = function (number_to_add) {
		//alert('Adding ' + number_to_add + ' pattern fields');
		var file_pattern_rows = $('#' + nooReconfigure.parameter_to_field_name(patterns_parameter_name) + ' li');
		var file_pattern_count=file_pattern_rows.length;
		var last_path = file_pattern_count + number_to_add;

		// Base new paths on the first path's html
		var new_path_index = file_pattern_count + 1;
		var first_pattern = file_pattern_rows.first();
		var pattern_list_base = first_pattern.parent();
		var blank_pattern = first_pattern.clone();
		blank_pattern.children('input').val("");
		while (new_path_index <= last_path) {
			var new_path = $(blank_pattern).clone();
			//var path_list_base = $(file_pattern_rows).parent();
			var new_path_input = new_path.children('input');
			var new_path_name = patterns_parameter_name + '_' + new_path_index;
			var new_path_id = nooReconfigure.parameter_to_field_name(patterns_parameter_name, new_path_index);
			new_path_input.attr('name', new_path_name);
			new_path_input.attr('id', new_path_id);
			//new_path_input.val("");
			pattern_list_base.append(new_path);
			//alert('Adding ' + new_path_index + ' pattern field');
			new_path_index = new_path_index + 1;
		}
	}

	nooReconfigure.prototype.remove_file_patterns = function (path_index) {
		var file_pattern_rows=$('#' + nooReconfigure.parameter_to_field_name(patterns_parameter_name) + ' li');
		var file_pattern_count=file_pattern_rows.length;
		var path_list_base = $(file_pattern_rows[0]).parent();
		if ( $.isArray(path_index) ) {
			//sort descending
			path_index.sort( function(a,b) { return (b - a); } );
			for ( var file_pattern_index=0; file_pattern_index < path_index.length; file_pattern_index++ ) {
				if ( path_index[file_pattern_index] < file_pattern_count ) {
					$(file_pattern_rows[path_index[file_pattern_index]]).remove();
				}
			}
		} else {
			if ( path_index < file_pattern_count ) {
				$(file_pattern_rows[path_index]).remove();
			}
		}
	}

	// If we delete some of the path "li"s then the names and ids for the 
	// text input fields will no longer be consecutive. This routine fixes that.
	nooReconfigure.prototype.reindex_file_patterns = function () {
		var file_pattern_rows=$('#' + nooReconfigure.parameter_to_field_name(patterns_parameter_name) + ' li');
		//alert('reindexing ' + file_pattern_rows.length + ' file patterns');
		var path_index=1;
		file_pattern_rows.each(function (li_index) {
			//alert('reindexing path index ' + path_index);
			$(this).children().each(function(input_index) {
				path_index = li_index + 1;
				var new_path_name = patterns_parameter_name + '_' + path_index;
				var new_path_id = nooReconfigure.parameter_to_field_name(patterns_parameter_name, path_index);
				//alert('reindexing old id ' + $(this).attr('id') + ' : new ' + new_path_id);
				$(this).attr('name', new_path_name);
				$(this).attr('id', new_path_id);
			});
		});
	}

	nooReconfigure.prototype.check_file_pattern = function(input_element) {
		// "remove" any path which has been left blank but add a new blank
		// path if there is none.
		var file_patterns_list = $('#' + nooReconfigure.parameter_to_field_name(patterns_parameter_name) + ' li');
		var path_count = file_patterns_list.length;
		var last_file_pattern_id = nooReconfigure.parameter_to_field_name(patterns_parameter_name, path_count);
		var this_element_id = $(this).attr("id");
		var id_number = parseInt(this_element_id.substr(patterns_parameter_name.length + 1));
		//alert("Checking file pattern for id " + id_number);

		if ( $(this).val().trim() === "" ) {
			//alert("Leaving blank path");

			if ( id_number !== path_count ) {
				//alert('blank pattern - id ' + $(this).attr("id") +' not ' + last_file_pattern_id + ' number ' + id_number);
				$(this).parent().remove();
				this_object.reindex_file_patterns();
			}
		} else {
			//alert("Leaving non-blank path");
			if ( id_number === path_count ) {
				//alert('non-blank pattern - id ' + $(this).attr("id") +' is ' + last_file_pattern_id);
				this_object.add_blank_file_patterns(1);
				$('#' + nooReconfigure.parameter_to_field_name(patterns_parameter_name, (path_count + 1) ) ).blur(this_object.check_file_pattern);
				//$('#' + nooReconfigure.parameter_to_field_name(patterns_parameter_name) + ' input').blur(this_object.check_file_pattern);
				//alert('Blur for ' + parameter_name);
			}
			//alert("Checking non-blank file pattern for id " + id_number);
			this_object.check_text_array_parameter(this_object.gallery_parameters, patterns_parameter_name, id_number);
		}
	}

	nooReconfigure.prototype.choose_slideshow = function() {
		// "remove" any path which has been left blank but add a new blank
		// path if there is none.
		//var slideshow_select = $('#slideshow-choice select');
		//alert('Select is ' + $(this).val());
		var new_choice = $(this).val();
	}

	//Replace the single image with the configuration parameters form
	//$('#noo-reconfigure').click(function() {
	nooReconfigure.prototype.show_reconfigure = (function() {
		return (function() {
			//alert('showing reconfigure');
			var current_display_div;
			var image_div=$('#noo-image-frame');
			if ( image_div.is(':visible') ) {
				current_display_div = $('#noo-highlighted-image');
			} else {
				current_display_div = $('#noo-instructions');
			}
			$('#noo-content-view').slideUp();
			$('#noo-parameter-controls-wrap').slideDown();
			//noo_debug_info(old_parameters.thumbnail_width);

			// Get the current number of rows for the set image paths
			// We need to set that to the maximum so that we can 
			// set a fixed size and scroll if we add more than that.
			var file_pattern_rows=$('#' + nooReconfigure.parameter_to_field_name(patterns_parameter_name) + ' li');
			var file_pattern_count=file_pattern_rows.length;

			if ( file_pattern_count > this_object.pattern_window_rows ) {
				//alert('Too many paths - ' + file_pattern_count);
				var path_index = file_pattern_count;
				while ( path_index > this_object.pattern_window_rows ) {
					path_index = path_index - 1;
					this_object.remove_file_patterns(path_index);
				}
				this_object.reindex_file_patterns();
			} else if ( file_pattern_count < this_object.pattern_window_rows ) {
				//alert('Too few paths - ' + file_pattern_count);
				var paths_to_add = this_object.pattern_window_rows - file_pattern_count;
				this_object.add_blank_file_patterns(paths_to_add);
				this_object.reindex_file_patterns();
			//} else {
				//alert(" baby bear's paths - " + file_pattern_count + " is just right");
			}

			var configuration_paths_area_height = $('#file-patterns-group').height();
			$('#file-patterns-group').height(configuration_paths_area_height);

			//Get current parameters for the gallery. 
			//Initialise a new set of parameters for the gallery then get the values
			//from the server
			this_object.gallery_parameters = new nooParameters('gallery');
			//var this_object = this;
			this_object.gallery_parameters.fromServer('all', function(data) {
				//noo_debug_info("thumbnail_height");
				this_object.load_text_parameter(this_object.gallery_parameters, 'thumbnail_height');
				//noo_debug_info("thumbnail_width");
				this_object.load_text_parameter(this_object.gallery_parameters, 'thumbnail_width');
				//noo_debug_info("thumbnail_margin");
				this_object.load_text_parameter(this_object.gallery_parameters, 'thumbnail_margin');

				//noo_debug_info("thumbnail_trim");
				this_object.load_text_parameter(this_object.gallery_parameters, 'thumbnail_trim');
				this_object.load_text_parameter(this_object.gallery_parameters, 'thumbnail_frame');

				var gallery_file_patterns = this_object.gallery_parameters.getValue(patterns_parameter_name);
				//alert('Got ' + gallery_file_patterns.length + ' file patterns')
				var actual_pattern_rows = gallery_file_patterns.length;
				if ( gallery_file_patterns.length < this_object.pattern_window_rows ) {
					//alert('Removing file patterns')
					for ( var input_index = this_object.pattern_window_rows; input_index > gallery_file_patterns.length; input_index-- ) {
						this_object.remove_file_patterns( input_index );
					}
					$('#' + nooReconfigure.parameter_to_field_name(patterns_parameter_name, (gallery_file_patterns.length + 1) ) ).val('');
				} else {
					//alert('Adding ' + ( ( gallery_file_patterns.length - this_object.pattern_window_rows ) + 1 ) + ' blank patterns');
					this_object.add_blank_file_patterns( ( gallery_file_patterns.length - this_object.pattern_window_rows ) + 1 );
				}

				this_object.load_text_array_parameter(this_object.gallery_parameters, patterns_parameter_name);

				//noo_debug_info("file_patterns: count=" + gallery_parameters.getValue('file_patterns').length + ":");
				var pattern_count = gallery_file_patterns.length;
				//gallery_file_patterns.forEach(function(pattern_value, pattern_key) {
				for (var pattern_key = 0; pattern_key < pattern_count; pattern_key++ ) {
					var pattern_value = gallery_file_patterns[pattern_key];
					//file-pattern-1
					//noo_debug_info("key=" + pattern_key + ",value=" + pattern_value + ":", "append");
					var pattern_index = pattern_key + 1;
					$('#' + nooReconfigure.parameter_to_field_name(patterns_parameter_name, pattern_index)).each(function() {
						$(this).val(pattern_value);
					});
				}

				$('#' + nooReconfigure.parameter_to_field_name(patterns_parameter_name) + ' input').blur(this_object.check_file_pattern);
			});

			//Get slideshow parameters from server
			this_object.slideshow_parameters = new nooParameters('slideshow');
			this_object.slideshow_parameters.fromServer('all', function(data) {
				//noo_debug_info("thumbnail_height");
				this_object.load_select_parameter(this_object.slideshow_parameters, 'slideshow_type');
			});
		});
	})();

	//Validate the specified text parameter on the form and update the parameters if it is valid
	nooReconfigure.prototype.check_text_parameter = function (this_parameters, parameter_name) {
		//noo_extra_info('Data is ' + this_parameters[parameter_name]);
		//var this_parameters = this;
		var input_is_valid = false;
		var field_name = nooReconfigure.parameter_to_field_name(parameter_name);
		var field = $('#' + field_name + ' input');
		var field_value = field.val();
		/*
		var validation_name = this_parameters.getValidationName(parameter_name);
		//$(this).val(this_parameters.getValue(parameter_name));
		var integer_validation = nooValidationSets.getSet('size');
		var field = $('#' + field_name + ' input');
		var error_message = integer_validation.isValidValue(field_value);
		*/
		var error_message = this_parameters.isValidValue(parameter_name, field_value);
		if ( typeof error_message === 'undefined' ) {
			error_message = 'Unknown validation error';
		}
		//alert('Validating field name ' + field_name);
		//var DOM_field=document.getElementById(field_name);
		//alert('Validating field id ' + DOM_field.id + ' node name ' + DOM_field.nodeName);
		if ( error_message !== '' ) {
			//alert('Field ' + field_name + ' ' + error_message);
			input_is_valid = false;
		} else {
			input_is_valid = true;
			this_parameters.setValue(parameter_name, field_value);
		}
		var DOM_field=field.get(0);
		DOM_field.setCustomValidity(error_message);
		return input_is_valid;
		
	}

	//Validate the specified text parameter on the form and update the parameters if it is valid
	nooReconfigure.prototype.check_text_array_parameter = function (this_parameters, parameter_name, input_index) {
		//noo_extra_info('Data is ' + this_parameters[parameter_name]);
		//var this_parameters = this;
		var input_is_valid = false;
		if ( typeof input_index === 'undefined' ) {
			var field_name = nooReconfigure.parameter_to_field_name(parameter_name);
			var input_elements = $('#' + field_name + ' input');
			var last_input_index = input_elements.length;

			// We will assume the last input element is blank (because it should be for this case);
			last_input_index--;

			input_is_valid = true;
			 var parameter_array = new Array;
			//noo_debug_info("file_patterns: count=" + gallery_parameters.getValue('file_patterns').length + ":");
			for ( var input_index = 1; input_index <= last_input_index; input_index++ ) {
				//alert( 'array index ' + input_index + ' name ' + nooReconfigure.parameter_to_field_name(parameter_name, input_index) );
				input_is_valid = input_is_valid && this.check_text_array_parameter(this_parameters, parameter_name, input_index);
			}
		} else {
			//alert("Check text array " + parameter_name + " : " + input_index);
			var field_name = nooReconfigure.parameter_to_field_name(parameter_name, input_index);
			var field = $('#' + field_name);
			var field_value = field.val();
			var error_message = this_parameters.isValidNodeValue(parameter_name, field_value);
			if ( typeof error_message === 'undefined' ) {
				error_message = 'Unknown validation error';
			}
			//alert('Validating field name ' + field_name);
			if ( error_message !== '' ) {
				//alert('Field ' + field_name + ' ' + error_message);
				input_is_valid = false;
			} else {
				input_is_valid = true;
			}
			//alert("Message for text array " + input_index + " : " + error_message);
			var DOM_field=field.get(0);
			DOM_field.setCustomValidity(error_message);
		}
		return input_is_valid;
		
	}

	// To be called when the parameters are to be updated to reconfigure the app
	nooReconfigure.prototype.try_reconfiguration = function(){
		//alert('trying parameters');
		this_object.gallery_parameters = new nooParameters('gallery');
		// Whole is invalid if any parameter input is invalid so assume true
		var valid_configuration = true;
		
		var config_text_parameters = new Array();
		config_text_parameters.push('thumbnail_height');
		config_text_parameters.push('thumbnail_width');
		config_text_parameters.push('thumbnail_margin');

		config_text_parameters.push('thumbnail_trim');
		config_text_parameters.push('thumbnail_frame');
		var array_count = config_text_parameters.length;
		//config_text_parameters.forEach( function(parameter_name, parameter_key) {
		for (var parameter_key = 0; parameter_key < config_text_parameters.length; parameter_key++ ) {
			var parameter_name = config_text_parameters[parameter_key];
			valid_configuration = valid_configuration && this_object.check_text_parameter(this_object.gallery_parameters, parameter_name);
		}

		var config_text_array_parameters = new Array();
		config_text_array_parameters.push(patterns_parameter_name);
		var array_count = config_text_array_parameters.length;
		//config_text_array_parameters.forEach( function(parameter_name, parameter_key) {
		for (var parameter_key = 0; parameter_key < config_text_array_parameters.length; parameter_key++ ) {
			var parameter_name = config_text_array_parameters[parameter_key];
			var array_valid = this_object.check_text_array_parameter(this_object.gallery_parameters, parameter_name);
			valid_configuration = valid_configuration && array_valid;
			if ( array_valid ) {
				this_object.set_text_array_parameter(this_object.gallery_parameters, parameter_name);
			}
		}

		var image_element=$('#noo-single-image');
		if ( image_element.length > 0 ) {
			current_display_div = $('#noo-highlighted-image');
		} else {
			current_display_div = $('#noo-instructions');
		}

		var config_parameters = new Array();
		config_parameters = config_parameters.concat(config_text_parameters);
		config_parameters = config_parameters.concat(config_text_array_parameters);

		this_object.slideshow_parameters = new nooParameters('slideshow');
		var slideshow_config_parameters = new Array();
		slideshow_config_parameters.push('slideshow_type');
		var array_count = slideshow_config_parameters.length;
		//slideshow_config_parameters.forEach( function(parameter_name, parameter_key) {
		for (var parameter_key = 0; parameter_key < array_count; parameter_key++ ) {
			var parameter_name = slideshow_config_parameters[parameter_key];
			this_object.set_select_parameter(this_object.slideshow_parameters, parameter_name);
		}

		if ( valid_configuration ) {
			this_object.gallery_parameters.toServer(config_parameters, function () {
				//noo_debug_info('update gallery parameters' );
				//alert('in toServer calling gallery update');
				//alert('in toServer calling gallery update');
				noo_gallery.updateParameters(this_object.gallery_parameters);
				//alert('in toServer after calling gallery update');
				this_object.slideshow_parameters.toServer(slideshow_config_parameters, function () {
					//alert('in toServer calling slideshow update');
					noo_slideshow.updateParameters(this_object.slideshow_parameters);
					//alert('in toServer after calling slideshow update');
					$('#noo-content-view').slideDown();
					$('#noo-parameter-controls-wrap').slideUp();

					$('#noo-single-image').each(function(){
						var file_name=noo_gallery.extract_img_filename($(this));
						var img_id = $(this).attr('class');
						var img_gallery_id = img_id.substr('single'.length);
						//alert('After reconfigure single id is ' + img_gallery_id);
						noo_images.show_resized_image(file_name, img_gallery_id);
					});

					//noo_debug_info('rebuild gallery content' );
					//nooStyles.setInlineRules('.noo-gallery-content-item', 'width', noo_gallery.currentParameters.content_width+'px');
					noo_gallery.rebuild_gallery_content();
				});
			});
		} else {
			alert('Cannot reconfigure with invalid input');
		}
			//alert('waiting for parameters');
	}

	// To be called when the existing parameters are to be retained
	nooReconfigure.prototype.cancel_reconfiguration = function(){
			var image_element=$('#noo-single-image');
			if ( image_element.length > 0 ) {
				current_display_div = $('#noo-highlighted-image');
			} else {
				current_display_div = $('#noo-instructions');
			}

			$('#noo-content-view').slideDown();
			$('#noo-parameter-controls-wrap').slideUp();

			$('#noo-single-image').each(function(){
				//noo_debug_info('Extracting image filename after cancel');
				var file_name=noo_gallery.extract_img_filename($(this));
				noo_images.show_resized_image(file_name);
			});
	}

	// To be called when the document is ready
	nooReconfigure.prototype.whenReady = function(){

		this.set_pattern_window_rows(5);
		var content_class_selector = '.' + noo_gallery.currentParameters.getValue('content_class');

		//$('#slideshow-choice').change(this_object.choose_slideshow);
	
		//Replace the configuration parameters form with the single image
		$('#try-parameters').click(this_object.try_reconfiguration );

		//Replace the configuration parameters form with the single image
		$('#cancel-parameters').click(this_object.cancel_reconfiguration );

	}

}

	// Get the specified text configuration parameter from the form
	nooReconfigure.parameter_to_field_name = function (parameter_name, parameter_index) {
		//noo_extra_info(typeof parameter_name);
		var field_name = parameter_name.replace(/_/g,"-");
		if ( typeof parameter_index !== "undefined" ) {
			field_name = field_name + '-' + parameter_index;
		}
		return field_name;
	}

var noo_reconfigure = new nooReconfigure();
$(document).ready(function() {
	if ( typeof noo_reconfigure === 'undefined' ) {
		noo_debug_info('self creating main app object', 'append');
		noo_reconfigure = new nooReconfigure();
	}
	noo_reconfigure.whenReady();
});


function nooGallery () {

	// These represent the function which is called for each content item. 
	// By default it uses the basic version from the gallery definition 
	// but can be replaced here for code with other requirements.
	// This could also be done by extending/overriding the basic prototype 
	// but this approach retains access to the basic function. Consequently it 
	// needs to be set for each instance - a hassle if all galleries in the 
	// application use the same code, a convenience if there are different behaviours
	// for some galleries.
	 var before_show_item;
	 var show_item;
	 var after_show_item;
	 // This is the function to be called after the content has been added to the gallery.
	 // It provides a hook to put such things as click or hover actions for each item.
	 var after_content_built;
	 var this_gallery=this;

	nooGallery.prototype.copyGalleryParameters = function(from_parameters, to_parameters) {
		to_parameters.copyAllValues(from_parameters);
		//to_parameters.calculateContentDimensions ();
		to_parameters.doAction('calc');
	}

	nooGallery.prototype.updateGalleryParameters = function(current_parameters, new_parameters) {
		//noo_debug_info('Updating parameters 10');
		gallery_changed = false;
		current_parameters.setValue('item_border', new_parameters.getValue('item_border') );
		/* Leave file patten updates until the #try-parameters.click function has been updated to read it */
		//this.currentParameters.setValue('file_patterns', new_parameters.getValue('file_patterns') );
		current_parameters.setValue('content_class', new_parameters.getValue('content_class') );
		//noo_debug_info('Updating parameters 13');
		/*
		 * In an ideal world the code would update the CSS stylesheets using selectors 
		 * and let the new settings ripple down to the elements. Unfortunately, the 
		 * browser support, where it exists at all, mostly varies between patchy and pitiful. 
		 * Therefore I will use the sledgehammer approach of using the selectors 
		 * to access the elements and update the CSS on them directly. I've tried to include 
		 * commented out versions of the "right way" using the nooStyles helper functions. 
		 * That doesn't mean I am sure the helper functions would work as I have 
		 * found it difficult to separate my bugs from deficiencies in the browsers.
		 * Maybe one day....
		*/
		if ( ( current_parameters.getValue('thumbnail_frame') != new_parameters.getValue('thumbnail_frame') ) || ( current_parameters.getValue('thumbnail_trim') != new_parameters.getValue('thumbnail_trim') ) ) {
			//noo_debug_info('Updating parameters 16');
			var thumbnail_frame = new_parameters.getValue('thumbnail_frame');
			var thumbnail_trim = new_parameters.getValue('thumbnail_trim');
			current_parameters.setValue('thumbnail_frame',  thumbnail_frame);
			current_parameters.setValue('thumbnail_trim', thumbnail_trim );
			//nooStyles.setInlineRules('.noo-gallery-content-item', 'border-color', thumbnail_trim);
			//nooStyles.setInlineRules('.noo-gallery-content-item', 'background-color', thumbnail_frame);
			//nooStyles.setInlineRules('#noo-gallery-content', 'background-color', thumbnail_frame);
			$('.noo-gallery-content-item').css({'border-color': thumbnail_trim, 'background-color': thumbnail_frame });
			//$('#noo-gallery-content').css({'background-color': thumbnail_frame });
		}

		//noo_debug_info('Updating parameters 20');
		if ( ( current_parameters.getValue('thumbnail_height') != new_parameters.getValue('thumbnail_height') ) || ( current_parameters.getValue('thumbnail_width') != new_parameters.getValue('thumbnail_width') ) || ( current_parameters.getValue('thumbnail_margin') != new_parameters.getValue('thumbnail_margin') ) ) {
			current_parameters.setValue('thumbnail_height', new_parameters.getValue('thumbnail_height') );
			current_parameters.setValue('thumbnail_width', new_parameters.getValue('thumbnail_width') );
			current_parameters.setValue('thumbnail_margin', new_parameters.getValue('thumbnail_margin') );
			current_parameters.setValue('item_border', new_parameters.getValue('item_border') );
			//nooStyles.setInlineRules('.' + current_parameters.getValue('content_class'), 'margin', current_parameters.getValue('thumbnail_margin')+'px');
			$('.' + current_parameters.getValue('content_class')).css( { 'margin': current_parameters.getValue('thumbnail_margin') + 'px' } );

			var content_height = current_parameters.getValue('content_height');
			var content_width = current_parameters.getValue('content_width');
			//noo_debug_info('content_width is ' + content_width);
			//nooStyles.setInlineRules('.noo-item-frame', 'width', content_height + 'px');
			//nooStyles.setInlineRules('.noo-item-frame', 'height', content_height + 'px');
			$('.noo-item-frame').css( { 'width': content_width + 'px', 'height': content_height + 'px' } );
			//No need to set height - it works with auto settings
			gallery_changed = true;
		}

		//alert( 'updating file patterns ' + new_parameters.getValue('file_patterns') )
		//noo_debug_info('Updating parameters 30');
		var patterns_changed = false;
		var current_patterns = current_parameters.getValue('file_patterns');
		var new_patterns = new_parameters.getValue('file_patterns');
		if ( current_patterns.length !== new_patterns.length ) {
			patterns_changed = true;
		} else {
			for ( var pattern_index=0; pattern_index < current_patterns.length; pattern_index++ ) {
				if ( current_patterns[pattern_index] !== new_patterns[pattern_index] ) {
					patterns_changed = true;
				}
			}
		}
		gallery_changed = gallery_changed || patterns_changed;
		current_parameters.setValue('file_patterns', new_parameters.getValue('file_patterns') );
		if ( gallery_changed ) {
			//current_parameters.calculateContentDimensions ();
			//alert('Calling action calc');
			if ( patterns_changed ) {
				/*
				current_parameters.expand_patterns(function(parameters) {
					$('#noo-gallery-content').css( { 'width': parameters.getValue('total_content_width') + 'px'} );
					parameters.doAction('calc');
				});
				*/
				current_parameters.doAction('expand', (function(parameters) {
						$('#noo-gallery-content').css( { 'width': parameters.getValue('total_content_width') + 'px'} );
						parameters.doAction('calc');
					})
				);
			} else {
				current_parameters.doAction('calc');
			}
		}
		//}
	}

	nooGallery.prototype.calculateContentDimensions = function(parameters)  {
		//noo_debug_info('calc thumb width ' + parameters.getValue('thumbnail_width'), 'append');
		//noo_debug_info('calc thumb margin ' + parameters.getValue('thumbnail_margin'), 'append');
		parameters.setValue( 'content_height', Number(parameters.getValue('thumbnail_height')) + ( Number(parameters.getValue('thumbnail_margin')) * 2 ) );
		parameters.setValue( 'content_width', Number(parameters.getValue('thumbnail_width')) + ( Number(parameters.getValue('thumbnail_margin')) * 2 ) );
		//noo_debug_info('calc content width ' + parameters.getValue('content_width'), 'append');
		var item_border = Number(parameters.getValue('item_border'));
		var outer_item_width = parameters.getValue('content_width') + item_border;
		//alert('ng ccd outer_item_width ' + outer_item_width);
		//var outer_item_width = parameters.getValue('content_width') + ( Number(parameters.getValue('item_border')) * 2 );
		parameters.setValue('outer_item_width', outer_item_width);
		//alert('recalc list_size is ' + parameters.getValue('list_size') + ' : outer item width ' + outer_item_width);
		var total_content_width = ( outer_item_width * Number( parameters.getValue('list_size') ) ) + item_border;
		//alert('ng ccd outer_item_width ' + outer_item_width + ' : total_content_width ' + total_content_width);
		parameters.setValue('total_content_width', total_content_width );
	}

	nooGallery.prototype.expand_patterns = function(this_parameters, after_expansion) {
		var ajax_pattern_count = 0;
		//noo_debug_info('ARGC file patterns=' + this.currentParameters.getValue('file_patterns'));
		//noo_extra_info('ARGC file patterns length=' + this.currentParameters.getValue('file_patterns').length);
		var file_patterns = this_parameters.getValue('file_patterns');
		this_parameters.setValue('file_list', new Array());
		this_parameters.setValue('list_size', 0);
		var list_count = 0;
		var last_pattern = file_patterns.length - 1;
		pattern_JSON = new Array();
		$.each( this_parameters.getValue('file_patterns'), function( pattern_key, pattern_value ) {
			this_parameters.getValue('file_list')[pattern_key] = new Array();
			pattern_JSON.push($.getJSON( 
				'noo_ajax.php?action=expand_patterns&target=' + pattern_value,
				{file_pattern: pattern_value},
				function(json_data) {
					var file_count = 0;
					var file_total = json_data.length;
					list_count = list_count + file_total;
					//noo_extra_info('j length ' + file_total + ' list_size ' + this_gallery.currentParameters.getValue('list_size'), 'append');
					this_parameters.setValue('list_size', this_parameters.getValue('list_size') + file_total);
				}
			));
		});
		$.when.apply($, pattern_JSON).done(function(){
			if ( typeof after_expansion === 'function' ) {
				after_expansion(this_parameters);
			}
		});
	}


	nooGallery.prototype.defineValidation = function() {
		var content_class_validation = new nooValidationSet ('content_class', 'any', 'Only digits 0 to 9 permitted here');
		content_class_validation.addRule('match', '^[a-zA-Z][a-zA-Z0-9]+$', 'Not a valid content class', '');
		content_class_validation.addRule('match', '^[a-zA-Z][a-zA-Z0-9_]+[a-zA-Z0-9]$', 'Not a valid content class', '');
		content_class_validation.addRule('match', '^[a-zA-Z][a-zA-Z0-9-]+[a-zA-Z0-9]$', 'Not a valid content class', '');
		//content_class_validation.addRule('exclude', '[^0-9]+', 'Not a valid integer', '');
		nooValidationSets.addSet(content_class_validation);
		var file_pattern_validation = new nooValidationSet ('file_pattern', 'all', 'Only digits 0 to 9 permitted here');
		file_pattern_validation.addRule('match', '^[a-zA-Z0-9/_\*\.]*[a-zA-Z0-9\*]$', 'Not a valid file pattern', '');
		file_pattern_validation.addRule('exclude', '\/\/\/', 'Not a valid file path', '');
		//content_class_validation.addRule('exclude', '[^0-9]+', 'Not a valid integer', '');
		nooValidationSets.addSet(file_pattern_validation);
	}

	nooGallery.prototype.defineParameters = function(parameter_set) {
		parameter_set.addAJAXDefinition('item_border', 'integer');
		parameter_set.addAJAXDefinition('content_class', 'string');
		parameter_set.addAJAXDefinition('thumbnail_height', 'integer');
		parameter_set.addAJAXDefinition('thumbnail_width', 'integer');
		parameter_set.addAJAXDefinition('thumbnail_margin', 'integer');
		parameter_set.addAJAXDefinition('thumbnail_frame', 'string');
		parameter_set.addAJAXDefinition('thumbnail_trim', 'string');
		parameter_set.addAJAXDefinition('file_patterns', 'array:string');

		// Derived values
		parameter_set.addDefinition('file_list', 'array:array:string');
		parameter_set.addDefinition('list_size', 'integer');
		parameter_set.addDefinition('content_height', 'integer');
		parameter_set.addDefinition('content_width', 'integer');
		parameter_set.addDefinition('outer_item_width', 'integer');

		parameter_set.addDefinition('total_content_width', 'integer');

		// In part from laziness, I've defined the border, height, width and margin as integers.
		// This makes the code much simpler when calculating composite dimensions. 
		// It also means that specifying pixels just means appending "px" to the value.
		// One day I may knuckle down and cater for percentage and "em" values.
		parameter_set.setValidation('content_class', 'content_class');
		parameter_set.setValidation('thumbnail_frame', 'colour');
		parameter_set.setValidation('thumbnail_trim', 'colour');
		parameter_set.setValidation('file_patterns', 'file_pattern');
	}

	nooGallery.prototype.makeParameters = function() {
		var gallery_set = new nooParameterSet();
		this.defineParameters(gallery_set);
		gallery_set.addActionFunction ( 'copy',  this.copyGalleryParameters);
		gallery_set.addActionFunction ( 'update',  this.updateGalleryParameters);
		if (typeof this.defaultParameters === "undefined") {
			noo_debug_info('defaultParameters undefined - oops', 'append');
		}
		gallery_set.addActionFunction ( 'default',  this.defaultParameters);
		gallery_set.set_default_values = this.defaultParameters;
		gallery_set.addActionFunction ( 'calc',  this.calculateContentDimensions );
		gallery_set.addActionFunction ( 'expand',  this.expand_patterns );
		nooParameterSets.addSet('gallery', gallery_set);

		this.currentParameters = new nooParameters('gallery');
		this.currentParameters.doAction('default');
		//gallery_set.set_default_values(this_gallery.currentParameters);
		//noo_debug_info('parameters thumbnail width is ' + this.currentParameters.getValue('thumbnail_width'), 'append');
	}

	// Add a gallery item to the content
	nooGallery.prototype.updateParameters = function(new_parameters) {
		this.currentParameters.doAction('update', new_parameters);
	}

	// Add a gallery item to the content
	nooGallery.prototype.basic_show_item = function(currentParameters, file_key, pattern_key, item_id) {
		//noo_debug_info("bsi 100", "append");
		var content_item_div = $('#noo-content-item-' + item_id);
		
		var item_frame_div = $(document.createElement("div"));
		item_frame_div.addClass('noo-item-frame');
		item_frame_div.appendTo(content_item_div);
		var content_height = currentParameters.getValue('content_height');
		var content_width = currentParameters.getValue('content_width');
		var frame_background = currentParameters.getValue('thumbnail_frame');
		var frame_border = currentParameters.getValue('thumbnail_trim');
		$(item_frame_div).css({ 'width': content_width + 'px', 'height': content_height + 'px' });
		content_item_div.css({ 'border-color': frame_border, 'background-color': frame_background });

		var item_img = $(document.createElement("img"));
		//item_img.load(function () {noo_gallery.nooVCentre(this);});
		var thumbnail_height = currentParameters.getValue('thumbnail_height');
		var thumbnail_width = currentParameters.getValue('thumbnail_width');
		var full_file_name = currentParameters.getValue('file_list')[pattern_key][file_key];
		var img_file_id = pattern_key + '_' + file_key;
		var file_name = full_file_name.replace(/^.*[\\\/]/, '');
		item_img.attr('src', 'img_resizer.php?file='+full_file_name+'&height='+thumbnail_height+'&width='+thumbnail_width);
		item_img.attr('title', file_name);
		item_img.attr('id', 'file' + img_file_id);
		item_img.addClass(currentParameters.getValue('content_class'));
		item_img.appendTo(item_frame_div);
	}

	// Add a gallery item to the content
	nooGallery.prototype.basic_before_show_item = function(currentParameters, file_key, pattern_key, item_id) {
		//noo_debug_info("bbsi 100", "append");
		var content_item_div = $('#noo-content-item-' + item_id);
		var before_item_div = $(document.createElement("div"));
		//content_item_div.attr('id', '#noo-content-item-' + item_id);
		before_item_div.addClass('noo-item-before');
		before_item_div.appendTo(content_item_div);
	}


	// Add a gallery item to the content
	nooGallery.prototype.basic_after_show_item = function(currentParameters, file_key, pattern_key, item_id) {
		//noo_debug_info("basi 100", "append");
		var content_item_div = $('#noo-content-item-' + item_id);
		var after_item_div = $(document.createElement("div"));
		//content_item_div.attr('id', '#noo-content-item-' + item_id);
		after_item_div.addClass('noo-item-after');
		after_item_div.appendTo(content_item_div);
	}


	// Add a gallery item to the content
	nooGallery.prototype.basic_build_content_item = function(current_parameters, file_key, pattern_key, item_id) {
		//var this_gallery = this;
		//var content_item_div = $(document.createElement("div"));
		//content_item_div.attr('id', '#noo-content-item-' + item_id);
		var content_item_div = $('#noo-content-item-' + item_id);
		content_item_div.addClass('noo-pattern-'+pattern_key);
		//content_item_div.addClass('noo-gallery-content-item');

		//noo_debug_info("bbci 100");
		if ( typeof this.before_show_item !== 'undefined' ) {
			this.before_show_item(current_parameters, file_key, pattern_key, item_id);
		}
		if ( typeof this.show_item !== 'undefined' ) {
			this.show_item(current_parameters, file_key, pattern_key, item_id);
		}
		if ( typeof this.after_show_item !== 'undefined' ) {
			this.after_show_item(current_parameters, file_key, pattern_key, item_id);
		}
		//noo_debug_info("bbci 900", "append");
	}

	nooGallery.prototype.rebuild_gallery_content = function() {
		$('#noo-gallery-content').empty();

		//noo_debug_info('arbc1 outer width is ' + this.currentParameters.getValue('outer_item_width'), 'append');
		var outer_item_width = this.currentParameters.getValue('outer_item_width');
		//No need to set height - it works with auto settings
		//nooStyles.setInlineRules('#noo-gallery-content', 'width', outer_item_width + 'px');
		//$('#noo-gallery-content').width(outer_item_width);
		var file_list = this_gallery.currentParameters.getValue('file_list');
		var list_count = 0;
		var pattern_base = 0;
		for ( var pattern_index = 0, stop_pattern = file_list.length; pattern_index < stop_pattern; pattern_index++) {
			for ( var file_index = 0, stop_file = file_list[pattern_index].length; file_index < stop_file; file_index++) {
				var file_name = file_list[pattern_index][file_index];
				$('#noo-gallery-content').append('<div class="noo-gallery-content-item" id="noo-content-item-' + list_count++ + '"></div>');
				this_gallery.build_content_item(this_gallery.currentParameters, file_index, pattern_index, pattern_base+file_index);

			}
			pattern_base += file_list[pattern_index].length;
		}

		//$('.noo-gallery-content-item').css({ 'border-width': border_width });
		//this_gallery.currentParameters.doAction('calc');
		//nooStyles.setInlineRules('#noo-gallery-content', 'width', this_gallery.currentParameters.getValue('total_content_width') + 'px');
		var total_content_width = this_gallery.currentParameters.getValue('total_content_width');
		$('#noo-gallery-content').css({ 'width' : total_content_width + 'px' });
		//noo_debug_info('g content width ' + this_gallery.currentParameters.getValue('total_content_width'), 'append');
		// Ideally this would have been done by setting the stylesheet before adding the content but 
		// erratic browser support has resulted in this more pragmatic approach.
		$('.noo-content-item').css({ width: this_gallery.currentParameters.getValue('content_width') + 'px' });
		$('.noo-content-item').css({ height: this_gallery.currentParameters.getValue('content_height') + 'px' });
		//noo_debug_info('argc after_content_built check - type ' + typeof(this.after_content_built), 'append');
		if ( typeof(this_gallery.after_content_built) !== 'undefined' ) {
			this_gallery.after_content_built() ;
		}
	}

	// Resize the gallery items/borders
	nooGallery.prototype.resize_content_item = ( function()  {
		//var this_gallery = this;
		var resize_content = function(file_name, pattern_key, item_id) {
			var file_name = this_gallery.currentParameters.getValue('file_list')[pattern_key][file_key];
			$.get('noo_ajax.php?action=add_image&target='+file_name, function(ajax_data) {
				if ( typeof ajax_data === 'undefined' ) {
					$('#debug-info').html('ajax data is undefined ');
				} else {
					var this_content_item = $('#noo-content-item-' + item_id);
					this_content_item.html(ajax_data);
					this_content_item.addClass('noo-pattern-'+pattern_key);
					if ( typeof(this_gallery.after_content_built) !== 'undefined' ) {
						this_gallery.after_content_built() ;
					}
				}
			});
		}
		return resize_content;
	})();

	//To centre image vertically, we must calculate the top and bottom margin after the image has loaded
	//To make things more complicated, we need to centre it in enclosing div but we can't use div's current height.
	//Instead we use the previously calculated "content" height (which is the height that div should be)
	nooGallery.prototype.nooVCentre = function(element)  {
		var img_el = $(element);
		var img_height = img_el.height();
		var content_height = this.currentParameters.getValue('content_height');
		var margin_size = ( content_height - img_height );
		var margin_top = parseInt( margin_size / 2 );
		var margin_bottom = parseInt( margin_size - margin_top );

		if ( ( parseInt(img_el.css('marginTop')) != margin_top ) || ( parseInt(img_el.css('marginBottom')) != margin_bottom ) ) {
			img_el.css( {'marginTop': margin_top, 'marginBottom': margin_bottom} );
		}
	}

	// because we use imgResizer we have to extract the file name from the img src attribute.
	// The element is a jQuery element, not javascript native.
	nooGallery.prototype.extract_img_filename = function(element)  {
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

	nooGallery.prototype.whenReady = function(){
		//noo_debug_info('gallery document ready', 'append');

		var this_gallery = this;
		this.currentParameters.fromServer('all', function(data) {
			//this_gallery.currentParameters.calculateContentDimensions();
			this_gallery.currentParameters.doAction('calc');
		});
	};

	this.before_show_item = this.basic_before_show_item;
	this.show_item = this.basic_show_item;
	this.after_show_item = this.basic_after_show_item;
	this.build_content_item = function(current_parameters, file_key, pattern_key, item_id) {
		this.basic_build_content_item(current_parameters, file_key, pattern_key, item_id);
	}

	this.defineValidation();
	this.makeParameters();
}

// The gallery variable should be created in the js_code part of the php file
//var noo_gallery = new nooGallery();

$(document).ready(function(){
	//noo_debug_info('gallery document ready', 'append');

	if ( typeof noo_gallery === 'undefined' ) {
		noo_debug_info('self creating gallery object', 'append');
		noo_gallery = new nooGallery();
		noo_gallery.whenReady();
	}
});

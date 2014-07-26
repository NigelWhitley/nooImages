
function nooSlideshow (gallery) {
	this.related_gallery = gallery;
	this.current_slide = 0;
	this.native_show_active = false;
	this.native_show_auto = false;
	var this_slideshow = this;
	this.slide_set = new Array();
	
	
	nooSlideshow.prototype.isSlideshowActive = function()  {
		return this.native_show_active;
	}

	
	nooSlideshow.prototype.isSlideshowAuto = function()  {
		return this.native_show_auto;
	}

	nooSlideshow.prototype.copySlideshowParameters = function(from_parameters, to_parameters) {
		to_parameters.setValue('checked_class', from_parameters.getValue('checked_class'));
		to_parameters.setValue('slideshow_group', from_parameters.getValue('slideshow_group'));
		to_parameters.setValue('slideshow_width', from_parameters.getValue('slideshow_width'));
		to_parameters.setValue('slideshow_height', from_parameters.getValue('slideshow_height'));
		to_parameters.setValue('slideshow_type', from_parameters.getValue('slideshow_type'));
	}

	nooSlideshow.prototype.updateSlideshowParameters = function(current_parameters, new_parameters) {
		//noo_debug_info('Updating parameters 10');
		//alert('Updating slideshow parameters as action -');
		slideshow_changed = false;
		current_parameters.setValue('checked_class', new_parameters.getValue('checked_class') );
		current_parameters.setValue('slideshow_group', new_parameters.getValue('slideshow_group') );
		current_parameters.setValue('slideshow_width', new_parameters.getValue('slideshow_width') );
		current_parameters.setValue('slideshow_height', new_parameters.getValue('slideshow_height') );
		current_parameters.setValue('slideshow_type', new_parameters.getValue('slideshow_type') );
		//noo_debug_info('Updating parameters 13');
	}

	nooSlideshow.prototype.defineParameters = function(parameter_set) {
		parameter_set.addAJAXDefinition('slideshow_width', 'string');
		parameter_set.addAJAXDefinition('slideshow_height', 'string');
		parameter_set.addAJAXDefinition('checked_class', 'string');
		parameter_set.addAJAXDefinition('slideshow_group', 'string');
		parameter_set.addAJAXDefinition('slideshow_type', 'string');
	}

	nooSlideshow.prototype.makeParameters = function()  {
		var slideshow_set = new nooParameterSet();
		this.defineParameters(slideshow_set);
		slideshow_set.addActionFunction ( 'copy',  this.copySlideshowParameters);
		slideshow_set.addActionFunction ( 'update',  this.updateSlideshowParameters);
		if (typeof this.defaultParameters === "undefined") {
			noo_debug_info('defaultParameters undefined - oops', 'append');
		}
		slideshow_set.addActionFunction ( 'default',  this.defaultParameters );
		slideshow_set.set_default_values = this.defaultParameters;
		nooParameterSets.addSet('slideshow', slideshow_set);

		//alert('creating slideshow parameters');
		this.currentParameters = new nooParameters('slideshow');
		this.currentParameters.doAction('default');
		//noo_debug_info('parameters thumbnail width is ' + this.currentParameters.getValue('thumbnail_width'), 'append');
	}

	// Add a gallery item to the content
	nooSlideshow.prototype.updateParameters = function(new_parameters) {
		//alert('updating slideshow current parameters');
		this.currentParameters.doAction('update', new_parameters);
	}

	// Redefine the function called after adding a gallery item to the content. It 
	// now displays a checkbox so we can indicate whether to include it in the 
	// slideshow.
	nooSlideshow.prototype.slideshow_after_show_item = function(current_parameters, file_key, pattern_key, item_id) {
		//var this_gallery = this;
		//noo_debug_info("sasi 100", "append");
		var content_item_div = $('#noo-content-item-' + item_id);
		var after_item_div = $(document.createElement("div"));
		//content_item_div.attr('id', '#noo-content-item-' + item_id);
		after_item_div.addClass('noo-item-after');
		after_item_div.appendTo(content_item_div);

		var item_checkbox = $(document.createElement("input"));
		var full_file_name = current_parameters.getValue('file_list')[pattern_key][file_key];
		item_checkbox.attr('type', 'checkbox');
		item_checkbox.attr('name', full_file_name);
		item_checkbox.addClass('noo-gallery-checkbox');
		item_checkbox.appendTo(after_item_div);
	}


	nooSlideshow.prototype.show_current_slide = function () {
		//alert('Showing slide ' + this_slideshow.current_slide);
		var source_slide_checkbox = this.slide_set[this.current_slide];
		
		var content_element = $(source_slide_checkbox).parent().parent();
		//noo_extra_info(content_element.attr("class"));
		var content_class = this.related_gallery.currentParameters.getValue('content_class');
		var image_element = content_element.find('.' + content_class);

		//noo_extra_info('Image element is ' + image_element.constructor);
		// because we used img_resizer we have to extract the file name
		var source_filename = this.related_gallery.extract_img_filename(image_element);
		var gallery_id = image_element.attr('id');

		var slide_height = parseInt($('#noo-slideshow-canvas').height());
		var slide_width = parseInt($('#noo-slideshow-canvas').width());
		//alert('slide height is ' + slide_height);
		var img_src=noo_make_resizer_src(source_filename, slide_height, slide_width);
		$('#noo-slideshow-slide').each( function() {
			$(this).attr('class', 'slide' + gallery_id);
			$(this).attr('src', img_src);
		});

		//alert(clicked_class + ' ' + next_image + ' ' + previous_image);
		//noo_extra_info('Called leaving after rebuild - class ' + this_gallery.currentParameters.getValue('content_class'));
	}

	nooSlideshow.prototype.show_next_slide = (function () {
		//alert('Showing next slide');
		//var this_slideshow = this;

		return (function() {
			this_slideshow.current_slide++;
			if ( this_slideshow.current_slide === this_slideshow.slide_set.length ) {
				this_slideshow.current_slide = 0;
			}
			//alert('Next slide is ' + this_slideshow.current_slide );

			this_slideshow.show_current_slide();
		});
	})();

	nooSlideshow.prototype.show_previous_slide = (function () {
		//alert('Showing previous slide');
		//var this_slideshow = this;

		return (function() {
			if ( this_slideshow.current_slide === 0 ) {
				this_slideshow.current_slide = this_slideshow.slide_set.length;
			}
			this_slideshow.current_slide--;
			//alert('Previous slide is ' + this_slideshow.current_slide );

			this_slideshow.show_current_slide();
		});
	})();

	nooSlideshow.prototype.change_slide = (function () {
		//alert('Changing slide');
		//var this_slideshow = this;

		return (function() {
			var clicked_direction = $(this).attr('id');
			var next_slide = clicked_direction.indexOf('next');
			var previous_slide = clicked_direction.indexOf('previous');
			if ( next_slide !== -1 ) {
				//alert('Next slide clicked from ' + this_slideshow.current_slide );
				this_slideshow.show_next_slide();
			} else if ( previous_slide !== -1 ) {
				//alert('Previous slide clicked from ' + this_slideshow.current_slide );
				this_slideshow.show_previous_slide();
			} else {
				//alert('Unknown element clicked');
			}
		});
	})();

	// Do whatever is necessary to initiate the colorbox slideshow including each of 
	// the items checked in the gallery
	nooSlideshow.prototype.start_colorbox_slideshow = function (auto_change) {
		//noo_debug_info('Starting colorbox slideshow');
		//alert('Starting colorbox slideshow');
		var slideshow_group = this.currentParameters.getValue('slideshow_group');
		var slideshow_width = this.currentParameters.getValue('slideshow_width');
		var slideshow_height = this.currentParameters.getValue('slideshow_height');
		var content_class = this.related_gallery.currentParameters.getValue('content_class');
		var colorbox_parameters={ rel: slideshow_group,
						width: slideshow_width,
						height: slideshow_height,
						scalePhotos:true,
						loop:true,
						open:true };
		if (auto_change) {
			colorbox_parameters.slideshow = true;
			colorbox_parameters.speed = 500;
		} else {
			colorbox_parameters.slideshow = false;
		}
		$('.noo-gallery-checkbox:checked').each(function(index, element) {
			//noo_debug_info('Starting slideshow');
			var content_element = $(this).parent().parent();
			//noo_extra_info(content_element.attr("class"));
			//noo_extra_info(":" + noo_gallery.currentParameters.getValue("content_class"), "append");
			var image_element = content_element.find('.' + content_class);
			//noo_extra_info('Image element is ' + image_element.constructor);
			
			// because we used imgResizer we have to extract the file name
			var file_name=extract_img_filename(image_element);
			colorbox_parameters.href = file_name;
			image_element.colorbox(colorbox_parameters);
		});
	};

	// Do whatever is necessary to initiate the colorbox slideshow including each of 
	// the items checked in the gallery
	nooSlideshow.prototype.start_native_slideshow = (function () {
		//var this_slideshow = this;
		return ( function(auto_change) {
			this_slideshow.slide_set = $('.noo-gallery-checkbox:checked');
			if ( this_slideshow.slide_set.length > 0 ) {
				this_slideshow.native_show_auto = auto_change;
				var content_class = this_slideshow.related_gallery.currentParameters.getValue('content_class');
				var slideshow_width = this_slideshow.currentParameters.getValue('slideshow_width');
				var slideshow_height = this_slideshow.currentParameters.getValue('slideshow_height');
				//alert('Slideshow params  - width=' + slideshow_width + ' height=' + slideshow_height);
				$('#noo-slideshow-canvas').each( function () {
					$(this).width(slideshow_width);
					$(this).height(slideshow_height);
				});
				$('#noo-slideshow-hider').removeClass('noo-slideshow-hidden');
				$('.noo-slideshow-change').height(slideshow_height);
				this_slideshow.current_slide = 0;
				this_slideshow.native_show_active = true;
				//alert('show slide with index ' + this_slideshow.current_slide );
				this_slideshow.show_current_slide();
				if ( this_slideshow.isSlideshowAuto() ) {
					this_slideshow.slideshow_delay = 5000;
					var each_slide=function() {
						// Only call the function if this is the first request or one was made since last tick
						if ( this_slideshow.isSlideshowActive() ) {
							this_slideshow.show_next_slide();
							this_slideshow.deferTimer = setTimeout(each_slide, this_slideshow.slideshow_delay);
						} else {
							// No new requests since last run so can turn off timer
							clearTimeout(this_slideshow.deferTimer);
						}
					};

					clearTimeout(this_slideshow.deferTimer);
					//alert('calling defertimer');
					this_slideshow.deferTimer = setTimeout(each_slide, this_slideshow.slideshow_delay);

				}
			} else {
				alert('No slides selected - cannot start slideshow');
				//$('#noo-slideshow-hider').addClass('noo-slideshow-hidden');
			}

		});
	})();

	// Do whatever is necessary to stop the native slideshow
	nooSlideshow.prototype.stop_native_slideshow = (function () {
		//var this_slideshow = this;
		return ( function(auto_change) {
			this_slideshow.native_show_active = false;
			//var content_class = this_slideshow.related_gallery.currentParameters.getValue('content_class');
			$('#noo-slideshow-hider').each( function () {
				$(this).addClass('noo-slideshow-hidden');
			});
		});
	})();

	//alert(typeof this.start_native_slideshow);
	// Do whatever is necessary to initiate the slideshow including each of the items 
	// checked in the gallery
	nooSlideshow.prototype.start_slideshow = (function () {
		return ( function() {
			var slideshow_type = this_slideshow.currentParameters.getValue('slideshow_type');
			//alert('Starting slideshow type ' + slideshow_type);
			if ( slideshow_type === 'colorbox_auto' ) {
				this_slideshow.start_colorbox_slideshow(true);
			} else if ( slideshow_type === 'colorbox_manual' ) {
				this_slideshow.start_colorbox_slideshow(false);
				//this_slideshow.old_start_slideshow();
			} else if ( slideshow_type === 'native_auto' ) {
				this_slideshow.start_native_slideshow(true);
			} else if ( slideshow_type === 'native_manual' ) {
				this_slideshow.start_native_slideshow(false);
			}
		});
	})();

	// Do whatever is necessary to initiate the slideshow including each of the items 
	// checked in the gallery
	nooSlideshow.prototype.stop_slideshow = (function () {
		//var this_slideshow = this;
		//alert(typeof this.currentParameters);
		return ( function(auto_change) {
			var slideshow_type = this_slideshow.currentParameters.getValue('slideshow_type');
			//alert('Stopping slideshow type ' + slideshow_type);
			if ( slideshow_type === 'colorbox_auto' ) {
				this_slideshow.stop_colorbox_slideshow(true);
			} else if ( slideshow_type === 'colorbox_manual' ) {
				this_slideshow.stop_colorbox_slideshow(false);
				//this_slideshow.old_start_slideshow();
			} else if ( slideshow_type === 'native_auto' ) {
				this_slideshow.stop_native_slideshow(true);
			} else if ( slideshow_type === 'native_manual' ) {
				this_slideshow.stop_native_slideshow(false);
			}
		});
	})();

	// Clean up after the slideshow has finished. For instance, colorbox adds a class 
	// to each item in its slideshow and doesn't remove them on exit.
	nooSlideshow.prototype.after_slideshow = function () {
		//Remove the cboxElement class so clicking on an image will still work the same way
		//(colorbox will start when an image with class cboxElement is clicked)
		$('.cboxElement').each(function(index, element){
			// because we used imgResizer we have to extract the file name
			// var file_name=extract_img_filename(image_element);
			$(this).removeClass('cboxElement');
			//noo_extra_info($(this).attr("class"));
			//noo_debug_info(noo_slideshow_params.slideshow_group);

		});
	};

	nooSlideshow.prototype.whenReady = function() {
		//var this_slideshow = this;

		if ( typeof noo_gallery === 'undefined' ) {
			noo_debug_info('slideshow creating gallery object', 'append');
			noo_gallery = new nooGallery();
			noo_gallery.whenReady();
			related_gallery = noo_gallery;
		}

		jQuery.colorbox.settings.maxWidth  = this.currentParameters.getValue('slideshow_width');
		jQuery.colorbox.settings.maxHeight = this.currentParameters.getValue('slideshow_height');
		$(document).bind('cbox_closed', this.after_slideshow);

		$('.noo-slideshow-change').click(this.change_slide);
		$('#noo-slideshow-stop').click(this.stop_slideshow);
		//$('#noo-slideshow-stop').click(function(){ alert('Slideshow stop') });

		var slideshow_checked_class = this.currentParameters.getValue('checked_class');
		//Adjust classes on the image so colorbox forgets about them when we unclick
		$('.noo-gallery-checkbox').click(function() {
			var img_element=$(this).parent().parent().find('.' + this_slideshow.related_gallery.currentParameters.content_class);
			if ( $(this).prop('checked') ) {
				//noo_debug_info('checkbox checked');
				//add a class to the img here so it can be selected and styled directly
				img_element.addClass(slideshow_checked_class);
			} else {
				//noo_debug_info('checkbox unchecked');
				//Remove the specific class from the img
				img_element.removeClass(slideshow_checked_class);
				img_element.removeClass('cboxElement');
			}
			//noo_extra_info('Classes are : ' + img_element.attr('class'));
			//$('#margin_info').text('Classes are : ' + img_element.attr('class'));
		});

	}

	this.related_gallery.after_show_item = this.slideshow_after_show_item;
	this.makeParameters();

}

$(document).ready(function(){

	if ( typeof noo_gallery === 'undefined' ) {
		noo_debug_info('slideshow creating gallery object', 'append');
		noo_gallery = new nooGallery();
		noo_gallery.whenReady();
	}
	//alert('checking slideshow defined');
	if ( typeof noo_slideshow === 'undefined' ) {
		//alert('checking slideshow defined 2');
		noo_debug_info('self creating slideshow object', 'append');
		noo_slideshow = new nooSlideshow(noo_gallery);
	}
	noo_slideshow.whenReady();

});

// The slideshow variable should be created in the js_code part of the php file
//var noo_slideshow = new nooSlideshow(noo_gallery);


function nooImages () {
	var this_app = this;

	//Display an image 
	nooImages.prototype.show_resized_image = function (file_name, gallery_id) {
		//Pass in the name of the image file as an argument
		//$('#debug-info').text('resizing');
		var image_height;
		var image_div=$('#noo-image-frame');
		var slideshow_div=$('#noo-slideshow-hider');
		//var single_image=$('#noo-single-image');
		//alert('file name is ' + file_name + ' gallery_id is ' + gallery_id);
		if ( image_div.is(':visible') ) {
			//$('#debug-info').text('hidden');
			image_div.empty();
			var copyright_height=$('#noo-copyright-box').height();
			var margin_bottom=copyright_height + 5;
			var toggle_top = parseInt(image_div.offset().top);
			//var inner_height = parseInt($(window).innerHeight());
			var inner_height = parseInt(slideshow_div.innerHeight());
			image_height = inner_height - ( toggle_top + margin_bottom );
			//alert(toggle_top+ ':' + inner_height + ':' + image_height);
		} else {
			//Image area is not visible so cannot calculate height for image
			image_height = single_image.height();
			if ( typeof image_height === 'null' ) {
				image_height = noo_gallery.currentParameters.getValue("thumbnail_height");
			}
		}
		var image_width = parseInt($(window).innerWidth());
		var img_src=noo_make_resizer_src(file_name, image_height, image_width);
		//alert('Image src is ' + img_src);
		image_div.html('<img id="noo-single-image" class="single' + gallery_id + '" src="' + img_src + '"/>');
;		//$('#debug-info').text('toggle-top='+toggle_top+'height=' + image_height + '&width=' + image_width);
	}

	nooImages.prototype.after_gallery_built = (function () {
		//var this_gallery = noo_gallery;
		return ( function() {
		//noo_extra_info('Called after rebuild - class ' + this_gallery.currentParameters.getValue('content_class'));
			$('.' + noo_gallery.currentParameters.getValue('content_class')).click(function() {
				//noo_extra_info('Called content click ');
				if ( $('#noo-instructions').is(':visible') ) {
					$('#noo-instructions').hide();
					$('#noo-highlighted-image').show();
				}
				// because we used img_resizer we have to extract the file name
				//noo_extra_info('Extracting filename for image');
				var file_name=extract_img_filename($(this));
				//var gallery_id = $(this).parent().parent().attr('id');
				var gallery_id = $(this).attr('id');
				//noo_extra_info('showing resized image for ' + file_name);
				this_app.show_resized_image(file_name, gallery_id);
			});
		});
	})();

	nooImages.prototype.change_single_image = (function () {
		return ( function() {
			var current_single_class = $('#noo-single-image').attr('class');
			var current_single_file = current_single_class.substr('singlefile'.length);
			//alert('Changing single file ' + current_single_class);
			var list_pattern_index = parseInt(current_single_file.substr(0, current_single_file.indexOf('_')));
			var list_file_index = parseInt(current_single_file.substr(current_single_file.indexOf('_')+1));

			var clicked_class = $(this).attr('class');
			var next_image = clicked_class.indexOf('next-image');
			var previous_image = clicked_class.indexOf('previous-image');
			var file_list = noo_gallery.currentParameters.getValue('file_list');
			var file_name = file_list[list_pattern_index][list_file_index];
			if ( next_image !== -1 ) {
				list_file_index++;
				if ( list_file_index === file_list[list_pattern_index].length ) {
					list_pattern_index++;
					if ( list_pattern_index === file_list.length ) {
						// Error - called when no next image
						list_pattern_index--;
						list_file_index--;
					} else {
						list_file_index=0;
					}
				}
				//var file_name = file_list[list_pattern_index][list_file_index];
				//alert('Next image clicked ' + list_pattern_index + ' : ' + list_file_index + ' : ' + file_name);
			} else if ( previous_image !== -1 ) {
				if ( list_file_index === 0 ) {
					if ( list_pattern_index === 0 ) {
						// Error - called when no previous image
					} else {
						list_pattern_index--;
						list_file_index=file_list[list_pattern_index].length - 1;
					}
				} else {
					list_file_index--;
				}
				//var file_name = file_list[list_pattern_index][list_file_index];
				//alert('Previous image clicked ' + list_pattern_index + ' : ' + list_file_index + ' : ' + file_name);
			} else {
				//alert('Unknown element clicked');
			}
			
			var current_single_class = $('#noo-single-image').attr('class');
			var new_gallery_id = 'file' + list_pattern_index + '_' + list_file_index;
			var file_name = file_list[list_pattern_index][list_file_index];
			this_app.show_resized_image(file_name, new_gallery_id);
			//alert(clicked_class + ' ' + next_image + ' ' + previous_image);
			//noo_extra_info('Called leaving after rebuild - class ' + this_gallery.currentParameters.getValue('content_class'));
		});
	})();

	//Replace the configuration parameters form with the single image/instructions
	nooImages.prototype.hide_reconfigure = (function() {
		return ( function(parameter_names, new_parameters) {
			var image_element=$('#noo-single-image');
			if ( image_element.length > 0 ) {
				current_display_div = $('#noo-highlighted-image');
			} else {
				current_display_div = $('#noo-instructions');
			}

			$('#noo-image-area').slideDown();
			$('#noo-parameter-controls-wrap').slideUp();

			$('#noo-single-image').each(function(){
				var file_name=noo_gallery.extract_img_filename($(this));
				this_app.show_resized_image(file_name);
			});

		});
	})();

	nooImages.prototype.whenReady = (function () {
		return ( function() {
			if ( typeof noo_gallery === 'undefined' ) {
				noo_gallery = new nooGallery();
				noo_gallery.whenReady();
			}

			if ( typeof noo_slideshow === 'undefined' ) {
				noo_slideshow = new nooSlideshow(noo_gallery);
				noo_slideshow.whenReady();
			}

			if ( typeof noo_reconfigure === 'undefined' ) {
				noo_reconfigure = new nooReconfigure();
				noo_reconfigure.whenReady();
			}

			noo_images.after_gallery_built();

			//$(document,window).on("resize orientationchange fullscreenchange", (noo_stutter(250, function() {
			//$(window).on("resize orientationchange fullscreenchange", (noo_stutter(500, function() {
			$(window).on("resize orientationchange fullscreenchange", (noo_size_debounce(500, function() {
				$('#cboxOverlay:visible').each( function(){
					//jQuery.colorbox.resize({width:noo_slideshow_params.slideshow_width, height:noo_slideshow_params.slideshow_height});
					jQuery.colorbox.resize();
				});

				// Check for visibility before trying to resize
				$('#noo-single-image:visible').each(function(){
					//noo_debug_info('extracting filename for resize single');
					var file_name=extract_img_filename($(this));
					//var file_name=noo_gallery.extract_img_filename($(this));
					var gallery_id=$(this).attr('class').substr('single'.length);
					//noo_debug_info('resize single');
					this_app.show_resized_image(file_name, gallery_id);
				});
				if ( noo_slideshow.isSlideshowActive() ){
					noo_slideshow.show_current_slide();
				}
			}) ) );

			var content_class_selector = '.' + noo_gallery.currentParameters.getValue('content_class');

			$('.change-image').click(this_app.change_single_image);

			//Start the slideshow when the button is clicked
			$('#noo-slideshow-button').click(function () {
				//noo_slideshow.start_slideshow.apply(noo_slideshow);
				noo_slideshow.start_slideshow();
			});

			//Clear all the checkboxes
			$('#noo-select-none').click ( function() { 
				$('.noo-gallery-checkbox').each(function(index, element){
					//$('#debug-info').text('Clicked');
					$(this).prop('checked', false);
				});
			});

			//Tick all the checkboxes
			$('#noo-select-all').click(function () { 
				$('.noo-gallery-checkbox').each(function(index, element){
					//$('#debug-info').text('Clicked');
					$(this).prop('checked', true);
				});
			});

			//Replace the single image with the configuration parameters form
			$('#noo-reconfigure').click(function() {
				var current_display_div;
				var image_div=$('#noo-image-frame');
				if ( image_div.is(':visible') ) {
					current_display_div = $('#noo-highlighted-image');
				} else {
					current_display_div = $('#noo-instructions');
				}
				$('#noo-image-view').slideUp();
				// Could do this using the 'complete' callback but will try doing it 
				// asynchronously so reconfigure function can start while sliding into place
				//$('#noo-parameter-controls-wrap').slideDown({'complete': noo_reconfigure.show_reconfigure});
				$('#noo-parameter-controls-wrap').slideDown();
				noo_reconfigure.show_reconfigure();
			});

		});
	})();

}

var noo_images = new nooImages();
$(document).ready(function() {

	if ( typeof noo_images === 'undefined' ) {
		noo_debug_info('self creating main app object', 'append');
		noo_images = new nooImages();
	}
	noo_images.whenReady();

});

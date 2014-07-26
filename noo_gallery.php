<?php
/* 
 Image Gallery v0.2 by Nigel Whitley (c) Copyright 2013-2014
 This software is released under the terms of the GPL. For details, see license.txt.
 */
/*
 Foundation class for an image gallery. 
 Operates in conjunction with JavaScript (noo_gallery.js) and CSS (noo_gallery.css)
 The gallery has some hooks to support easier subclassing.
 It also generates some of the CSS and Javascript using parameters defined from PHP so
 the browser doesn't need to use AJAX to get that information initially.
 */

	require_once("noo_tools.inc");

class Noo_gallery {

	protected $file_patterns;
	protected $file_list;
	protected $content_class;
	protected $thumbnail_frame;
	protected $thumbnail_trim;
	protected $thumbnail_height;
	protected $thumbnail_width;
	protected $thumbnail_margin;
	protected $item_border;
	protected $content_height;
	protected $content_width;
	protected $total_width;
	protected $list_size;

/*
* Constructor for the class.
* Just sets up some default values
*/
	public function __construct() {

		$this->checked_class = "noo_checked";

		/*
		All of theses variables can be changed after the object has been instantiated.
		They are used during execution of the show_page method.
		The defaults will work well enough (IMHO) so the only elements which really need
		to be set by the user are for the image sources.
		image_pattern populates file_list using a regular expression.
		Alternatively file_list can be populated directly
		*/
		$this->set_fixed_default_values();
	}

	public function set_fixed_default_values() {
		$this->content_class = "nooc";
		$this->file_patterns = array("content/*.jpg");
		$this->gallery_width = "100%";
		$this->thumbnail_height = 80;
		$this->thumbnail_width = 80;
		$this->thumbnail_margin = 5;
		$this->thumbnail_frame = "lightgrey";
		$this->thumbnail_trim = "darkgrey";
		$this->item_border = 1;
	}

	public function parameters_from_session() {
		$this->content_class = $_SESSION["noo_gallery"]["content_class"];
		$this->file_patterns = $_SESSION["noo_gallery"]["file_patterns"];
		$this->gallery_width = $_SESSION["noo_gallery"]["gallery_width"];
		$this->thumbnail_height = $_SESSION["noo_gallery"]["thumbnail_height"];
		$this->thumbnail_width = $_SESSION["noo_gallery"]["thumbnail_width"];
		$this->thumbnail_margin = $_SESSION["noo_gallery"]["thumbnail_margin"];
		$this->thumbnail_frame = $_SESSION["noo_gallery"]["thumbnail_frame"];
		$this->thumbnail_trim = $_SESSION["noo_gallery"]["thumbnail_trim"];
		$this->item_border = $_SESSION["noo_gallery"]["item_border"];
	}

	public function parameters_to_session() {
		$_SESSION["noo_gallery"]["content_class"] = $this->content_class;
		$_SESSION["noo_gallery"]["file_patterns"] = $this->file_patterns;
		$_SESSION["noo_gallery"]["gallery_width"] = $this->gallery_width;
		$_SESSION["noo_gallery"]["thumbnail_height"] = $this->thumbnail_height;
		$_SESSION["noo_gallery"]["thumbnail_width"] = $this->thumbnail_width;
		$_SESSION["noo_gallery"]["thumbnail_margin"] = $this->thumbnail_margin;
		$_SESSION["noo_gallery"]["thumbnail_frame"] = $this->thumbnail_frame;
		$_SESSION["noo_gallery"]["thumbnail_trim"] = $this->thumbnail_trim;
		$_SESSION["noo_gallery"]["item_border"] = $this->item_border;
	}


/*
* Set the colour of the gallery frame (the background for each image)
*/
	public function thumbnail_frame($colour=null) {
		if ( is_null($colour) ) {
			return $this->thumbnail_frame;
		} else {
			$this->thumbnail_frame = $colour;
		}
	}

/*
* Set the colour of the gallery trim (the border for the frames)
*/
	public function thumbnail_trim($colour=null) {
		if ( is_null($colour) ) {
			return $this->thumbnail_trim;
		} else {
			$this->thumbnail_trim = $colour;
		}
	}

/*
* Set the maximum height of the thumbnails for the images
*/
	public function thumbnail_height($height=null) {
		if ( is_null($height) ) {
			return $this->thumbnail_height;
		} else {
			$this->thumbnail_height = $height;
		}
	}

/*
* Set the maximum width of the thumbnails for the images
*/
	public function thumbnail_width($width=null) {
		if ( is_null($width) ) {
			return $this->thumbnail_width;
		} else {
			$this->thumbnail_width = $width;
		}
	}

/*
* Set the minimum margin around the thumbnails for the images
*/
	public function thumbnail_margin($margin=null) {
		if ( is_null($margin) ) {
			return $this->thumbnail_margin;
		} else {
			$this->thumbnail_margin = $margin;
		}
	}

/*
* Set the maximum width of the thumbnails for the images
*/
	public function item_border($width=null) {
		if ( is_null($width) ) {
			return $this->item_border;
		} else {
			$this->item_border = $width;
		}
	}

/*
* Set the patterns for referencing files
*/
	public function file_patterns($patterns=null) {
		if ( is_null($patterns) ) {
			return $this->file_patterns;
		} elseif ( is_array($patterns) ) {
			$this->file_patterns = $patterns;
		} elseif ( is_string($patterns) ) {
			$this->file_patterns = array($patterns);
		} else {
			$this->file_patterns = array($patterns);
		}
	}

/*
* Specify a CSS class name used to identify the set of images in the slider gallery
*/
	public function content_class($img_class=null) {
		if ( is_null($img_class) ) {
			return $this->content_class;
		} else {
			$this->content_class = $img_class;
		}
	}

/*
* Set the maximum width of the gallery for the images
*/
	public function gallery_width($width=null) {
		if ( is_null($width) ) {
			return $this->gallery_width;
		} else {
			$this->gallery_width = $width;
		}
	}

/*
* Output the image patterns in a form suitable for populating a javascript variable
*/
	public function file_patterns_for_js($var_name) {
		echo "var php_file_patterns = new Array();\n";
		$conjunction = "";
		foreach ( $this->file_patterns as $image_element ) {
			echo "\tphp_file_patterns.push('" . $image_element . "');\n";
			//echo $conjunction . "'" . $image_element . "'";
			//$conjunction = ",";
		}
		echo "$var_name.setValue('file_patterns', php_file_patterns);\n";
		//echo ")";
		//if ( count($this->file_list) > 0 ) {
		//	$this->image_pattern = "";
		//}
	}

/*
* Process the file_list in a form suitable for populating a javascript variable
*/
	public function file_list_for_js($var_name) {
		echo "var php_file_list = new Array();\n";
		echo "var php_inner_list = new Array();\n";
		$list_size = 0;
		echo "var list_size = 0;\n";
		foreach ( $this->file_list as $pattern_list ) {
			echo "php_inner_list = new Array();\n";
			foreach ( $pattern_list as $file ) {
				echo "\tphp_inner_list.push('" . $file . "');\n";
				$list_size++;
			}
			echo "\tphp_file_list.push(php_inner_list);\n";
		}
		echo "$var_name.setValue('file_list', php_file_list);\n";
		echo "$var_name.setValue('list_size', $list_size);\n";
	}

/*
* Produce the page header includes for CSS and Javascript
* Note that there still may be a few places where CSS and Javascript are defined in-place because they rely on transient values.
*/
	public function page_includes() {
		$this->content_height = $this->thumbnail_height + ( $this->thumbnail_margin * 2 );
		$this->content_width = $this->thumbnail_width + ( $this->thumbnail_margin * 2 );

		$this->css_includes();
		$this->css_code();
		$this->js_includes();
		$this->js_code();
	}

/*
* Generate the links to include common css files
*/
	public function css_includes() {
?>
<link type="text/css" media="screen" rel="stylesheet" href="css/noo_gallery.css" />
<?php
	}

/*
* CSS definitions specifically related to this PHP and Javascript code
* Only elements with (relatively) fixed CSS should go here, not content generated.
* For the gallery I've put it all in dynamic_css_code which is called during show gallery, 
* after the dimensions should be known, as no elements are fixed values only.
*/
	public function css_code() {
?>
<style>
</style>
<?php
	}

/*
* Include common Javascript libraries
*/
	public function js_includes() {
/*
<script type="text/javascript" src="js/jquery-1.10.2.min.js"></script>
<script type="text/javascript" src="http://code.jquery.com/jquery-1.9.1.js"></script>
*/
?>
<script type="text/javascript" src="js/jquery-1.10.2.min.js"></script>
<script type="text/javascript" src="js/noo_tools.js"></script>
<script type="text/javascript" src="js/noo_validation.js"></script>
<script type="text/javascript" src="js/noo_parameters.js"></script>
<script type="text/javascript" src="js/noo_gallery.js"></script>
<?php
	}

/*
* Javascript code for this application
*/
	public function js_code() {
		$this->define_defaults_function();
?>
<script type="text/javascript">
//noo_debug_info('js_code creating gallery object', 'append');

var noo_gallery = new nooGallery();
</script>
<?php
	}

/*
* Take the list of file patterns and expand each to find the actual files which match
*/
	public function noo_expand_file_patterns() {
		$this->list_size = 0;
		$this->file_list = array();
		foreach ($this->file_patterns as $pattern_index => $image_pattern) {
			if (is_string($image_pattern) && strlen($image_pattern) > 0 ) {
				$this->file_list[$pattern_index] = glob($image_pattern);
				$this->list_size = $this->list_size + count($this->file_list[$pattern_index]);
			}
		}
	}

/*
* To be called before the main gallery item is produced
* This is really a hook for subclassing
*/
	public function noo_item_before($image_file) {
		$response = new responseHTML();
		$response->complex_start("div", array( "class" => "noo-item-before" ) );
		//$response->complex_end( "div" );
		$response->complex_end( );
		return $response->get();
	}

/*
* To be called after the main gallery item is produced
* This is really a hook for subclassing
*/
	public function noo_item_after($image_file) {
		$response = new responseHTML();
		$response->complex_start("div", array( "class" => "noo-item-after" ) );
		//$response->complex_end( "div" );
		$response->complex_end( );
		return $response->get();
	}

/*
* Display the main gallery item
* This is mainly a hook for subclassing
*/
	public function show_item_content($image_file, $internal_name) {
		$image_pathinfo = pathinfo($image_file);
		$image_name = $image_pathinfo['filename'];
		$image_resizer_host = "";
		$response = new responseHTML();
		$response->complex_start("div", array( "class" => "noo-item-frame" ) );
		$response->simple( "img", array("class" => $this->content_class, "id"=>"file" . $internal_name, "title" => $image_name, "src" => $image_resizer_host . "img_resizer.php?file=" . $image_file . "&height=" . $this->thumbnail_height . "&width=" . $this->thumbnail_width) );
		$response->complex_end( );
		return $response->get();
	}

/*
* Define the routine for setting defaults for the gallery 
* (note this can be overridden) 
*/
	public function define_defaults_function() {
		//Expand the image list which may contain wildcards to get the resulting list of files
		$this->noo_expand_file_patterns();
?>
<script type="text/javascript">

noo_debug_info('defining defaults function', 'append');
nooGallery.prototype.defaultParameters = function(parameter_set) {
	parameter_set.setValue('item_border', '<?php echo $this->item_border ?>');
	<?php $this->file_patterns_for_js("parameter_set"); ?>
	parameter_set.setValue('content_class', '<?php echo $this->content_class ?>');
	parameter_set.setValue('thumbnail_frame', '<?php echo $this->thumbnail_frame ?>');
	parameter_set.setValue('thumbnail_trim', '<?php echo $this->thumbnail_trim ?>');
	parameter_set.setValue('thumbnail_height', <?php echo $this->thumbnail_height ?>);
	parameter_set.setValue('thumbnail_width', <?php echo $this->thumbnail_width ?>);
	parameter_set.setValue('thumbnail_margin', <?php echo $this->thumbnail_margin ?>);
	parameter_set.setValue('file_list', new Array());
	<?php $this->file_list_for_js("parameter_set"); ?>
	}
</script>

<?php
	}

/*
* Calculate derived dimensions for the content of the sliding gallery.
* For example, we can calculate the width of the framing div from the thumbnail width and the margin.
* Likewise the total width is based on the content width, the width of the frame border and the number of images.
*/
	public function calculate_content_dimensions() {
		//Calculate the height and width of the div holding the image.
		//Used in centring the image (only need the height really as horizontally centring works as standard).
		$this->content_height = $this->thumbnail_height + ( $this->thumbnail_margin * 2 );
		$this->content_width = $this->thumbnail_width + ( $this->thumbnail_margin * 2 );

		//Expand the image list which may contain wildcards to get the resulting list of files
		//$this->noo_expand_file_patterns();
		//We need to know how many files there are in order to calculate the total width of the image gallery
		//That width is then used by the style for noo-gallery-content 
		//need to include the frame borders in the width calculation (border width of 1 each side so add 2)
		$this->total_width = ( $this->list_size * ( $this->content_width + ( $this->item_border ) ) ) + $this->item_border;

	}

	public function dynamic_css_code() {
		$total_margin = ( $this->content_height - $this->thumbnail_height );
		$margin_top = $this->thumbnail_margin;
		$margin_bottom = $this->thumbnail_margin;

?>
<style>
#noo-gallery { width: <?php echo $this->gallery_width; ?>; margin: auto; border-width: 0; }
#noo-gallery-content { width: <?php echo $this->total_width ?>px; margin: 0 auto; border-width: 0; }
.noo-gallery-content-item {
	float: left; 
	border-width: <?php echo $this->item_border; ?>px;
	border-style: solid;
	border-right-style: hidden;
	border-color: <?php echo $this->thumbnail_trim; ?>;
	background-color: <?php echo $this->thumbnail_frame; ?>;
	text-align: center; }
.noo-gallery-content-item:last-child { border-right-style: solid; }

.<?php echo $this->content_class ?> { margin: auto; position:absolute; top:0; bottom:0; left:0; right:0; }
.noo-item-frame { margin: auto; position:relative; height: <?php echo $this->thumbnail_height + (2 * $this->thumbnail_margin); ?>px; width: <?php echo $this->thumbnail_width + (2 * $this->thumbnail_margin); ?>px; }
</style>
<?php
	}

/*
* Producing the page info for the sliding gallery.
* Most of the work is done in the js_code for the slider from the jQuery UI demo
* So here we just need to set up the divs and images for the js to act on
* This function should be largely plug and play.
*/
	public function show_gallery() {
		if ( isset($_SESSION["noo_gallery"]["content_class"]) ) {
			$this->parameters_from_session();
		}
		$this->calculate_content_dimensions();
		$this->dynamic_css_code();
?>
<div id="noo-gallery">
<div id="noo-gallery-view">
<div id="noo-gallery-content">
<?php

		//For each file(image), we create an enclosing frame for the image thumbnail and before and after divs.
		//We need another div around the image so we can centre the thumbnail inside that.
		//When we place the image, it needs a callback so it can be centred after the actual size is known.
		//The sizing is done through the imgResizer PHP module, using the current maximum width and height
		foreach ($this->file_patterns as $pattern_index => $image_patterns) {
			foreach ($this->file_list[$pattern_index] as $file_index => $image_file) {
?>
<div class="noo-gallery-content-item">

<?php
	echo $this->noo_item_before($image_file);
	echo $this->show_item_content($image_file, $pattern_index . "_" . $file_index);
	echo $this->noo_item_after($image_file);
?>

</div>
<?php
			//End of per file processing
			}
		//End of per pattern processing
		}

?>
</div>
</div>

</div> 
<?php
		//End of show_gallery
	}
}

?>

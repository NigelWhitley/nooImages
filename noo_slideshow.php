<?php
/* 
 Image Gallery v0.2 by Nigel Whitley (c) Copyright 2013-2014
 This software is released under the terms of the GPL. For details, see license.txt.
 */
/*
 Extends image gallery to support a slideshow facility. 
 Operates in conjunction with JavaScript (noo_slideshow.js) and CSS (noo_slideshow.css)
 Overrides noo_item_after hook to add a checkbox.
 It also generates some of the CSS and Javascript using parameters defined from PHP so
 the browser doesn't need to use AJAX to get that information initially.
 */

require_once("noo_gallery.php");

class Noo_slideshow extends Noo_gallery {

	protected $slideshow_group;
	protected $checked_class;
	protected $slideshow_type;

/*
* Constructor for the class.
* Just sets up some default values
*/
	public function __construct() {

		parent::__construct();

		/*
		All of theses variables can be changed after the object has been instantiated.
		They are used during execution of the show_page method.
		The defaults will work well enough (IMHO) so the only elements which really need
		to be set by the user are for the image sources.
		image_pattern populates image_list using a regular expression.
		Alternatively image_list can be populated directly
		*/
	}

	public function set_fixed_default_values() {
		parent::set_fixed_default_values();
		$this->checked_class = "noo-checked";
		$this->slideshow_group = "noog";
		$this->slideshow_width = "90%";
		$this->slideshow_height = "90%";
		$this->slideshow_type = "colorbox_auto";
	}

	public function parameters_from_session() {
		parent::parameters_from_session();
		$this->checked_class = $_SESSION["noo_gallery"]["checked_class"];
		$this->slideshow_group = $_SESSION["noo_gallery"]["slideshow_group"];
		$this->slideshow_width = $_SESSION["noo_gallery"]["slideshow_width"];
		$this->slideshow_height = $_SESSION["noo_gallery"]["slideshow_height"];
		$this->slideshow_type = $_SESSION["noo_gallery"]["slideshow_type"];
	}

	public function parameters_to_session() {
		parent::parameters_to_session();
		$_SESSION["noo_gallery"]["checked_class"] = $this->checked_class;
		$_SESSION["noo_gallery"]["slideshow_group"] = $this->slideshow_group;
		$_SESSION["noo_gallery"]["slideshow_width"] = $this->slideshow_width;
		$_SESSION["noo_gallery"]["slideshow_height"] = $this->slideshow_height;
		$_SESSION["noo_gallery"]["slideshow_type"] = $this->slideshow_type;
	}


/*
* Specify a group name used by colourbox to identify the set of images to display
*/
	public function slideshow_group($slideshow_group=null) {
		if ( is_null($slideshow_group) ) {
			return $this->slideshow_group;
		} else {
			$this->slideshow_group = $slideshow_group;
		}
	}

/*
* Specify a group name used by colourbox to identify the set of images to display
*/
	public function checked_class($checked_class=null) {
		if ( is_null($checked_class) ) {
			return $this->checked_class;
		} else {
			$this->checked_class = $checked_class;
		}
	}

/*
* Specify a group name used by colourbox to identify the set of images to display
*/
	public function slideshow_width($slideshow_width=null) {
		if ( is_null($slideshow_width) ) {
			return $this->slideshow_width;
		} else {
			$this->slideshow_width = $slideshow_width;
		}
	}

/*
* Specify a group name used by colourbox to identify the set of images to display
*/
	public function slideshow_height($slideshow_height=null) {
		if ( is_null($slideshow_height) ) {
			return $this->slideshow_height;
		} else {
			$this->slideshow_height = $slideshow_height;
		}
	}

/*
* Specify a group name used by colourbox to identify the set of images to display
*/
	public function slideshow_type($slideshow_type=null) {
		if ( is_null($slideshow_type) ) {
			return $this->slideshow_type;
		} else {
			$this->slideshow_type = $slideshow_type;
		}
	}

/*
* Generate the links to include common css files
*/
	public function css_includes() {
		parent::css_includes();
?>
<link type="text/css" media="screen" rel="stylesheet" href="css/colorbox.css" />
<link type="text/css" media="screen" rel="stylesheet" href="css/noo_slideshow.css" />
<?php
	}

/*
* CSS definitions specifically related to this PHP and Javascript code
*/
	public function css_code() {
		parent::css_code();
?>
<?php
	}

/*
* Include common Javascript libraries
*/
	public function js_includes() {
/*
*/
		parent::js_includes();
?>
<script type="text/javascript" src="js/jquery.colorbox-min.js"></script>
<script type="text/javascript" src="js/noo_slideshow.js"></script>
<?php
	}

/*
* Javascript code for this application
*/
	public function js_code() {
		parent::js_code();
?>
<script type="text/javascript">

/*
* Parameters for call to colorbox
*/
nooSlideshow.prototype.defaultParameters = function(parameter_set) {
	parameter_set.setValue('checked_class', '<?php echo $this->checked_class ?>');
	parameter_set.setValue('slideshow_group', '<?php echo $this->slideshow_group ?>');
	parameter_set.setValue('slideshow_width', '<?php echo $this->slideshow_width ?>');
	parameter_set.setValue('slideshow_height', '<?php echo $this->slideshow_height ?>');
	parameter_set.setValue('slideshow_type', '<?php echo $this->slideshow_type ?>');
}

var noo_slideshow = new nooSlideshow(noo_gallery);


$(document).bind('cbox_closed', noo_slideshow.after_slideshow);

</script>
<?php
	}

/*
* Define divs for displaying slides modally
*/
	public function include_slideshow() {
		$response = new responseHTML();
		$response->complex_start("div", array( "id" => "noo-slideshow-hider", "class" => "noo-slideshow-hidden" ) );
		
		$response->complex_start("div", array("id" => "noo-slideshow-base") );
		
		$response->complex_start("div", array("id" => "noo-slideshow-canvas") );
		
		$response->simple( "img", array("id" => "noo-slideshow-slide") );
		
		$response->complex_start("div", array( "id" => "noo-slideshow-previous", "class"=> "noo-slideshow-change") );
		$response->simple( "img", array("src" => "images/left_arrow.png") );
		$response->complex_end( "div" );
		
		$response->complex_start("div", array( "id" => "noo-slideshow-next", "class"=> "noo-slideshow-change" ) );
		$response->simple( "img", array("src" => "images/right_arrow.png") );
		$response->complex_end( "div" );

		$response->complex_end( "div" );	//canvas

		$response->complex_start("div", array( "id" => "noo-slideshow-active-controls" ) );
		
		$response->complex_start( "button", array("type" => "button", "id" => "noo-slideshow-stop" ) );
		$response->text( "Stop slideshow" );
		$response->complex_end( "button" );
		
		$response->complex_end( "div" );	//controls

		$response->complex_end( "div" );	//base

		$response->complex_end( "div" );	//hider
		//$response->complex_end( );
		return $response->get();
	}

/*
* To be called after the main gallery item is produced
* subclass uses hook
*/
	public function noo_item_after($image_file) {
		$response = new responseHTML();
		$response->complex_start("div", array( "class" => "noo-item-after" ) );
		$response->simple( "input", array("type" => "checkbox", "class" => "noo-gallery-checkbox", "name" => $image_file, "title"=>"If checked, this image will be included in the slideshow") );
		//$response->complex_end( "div" );
		$response->complex_end( );
		return $response->get();
	}


}

?>

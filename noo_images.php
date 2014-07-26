<?php
/* 
 Image Gallery v0.2 by Nigel Whitley (c) Copyright 2013-2014
 This software is released under the terms of the GPL. For details, see license.txt.
 */
/*
 The main page combines the image gllery and slideshow with the ability to show 
 an image in the main area and also to reconfigure the gallery. 
 Acts in conjunction with JavaScript (noo_images.js) and CSS (noo_images.css)
*/
session_start();

require_once("noo_slideshow.php");
require_once("noo_reconfigure.php");

class Noo_images {

	public $page_title;
	//Gallery object
	protected $noo_gallery;
	//Split the code for the user reconfiguration of the parameters
	protected $noo_reconfigure;
	// Properties primarily for interface
	protected $slideshow_choice;

/*
* Constructor for the class.
* Just sets up some default values
*/
	public function __construct() {

		$this->page_title = "Simple gallery and slideshow";

		$this->noo_gallery = new Noo_slideshow();
		$this->noo_reconfigure = new Noo_reconfigure($this->noo_gallery);

	}

/*
* Store the current gallery parameters to the session variables
*/
	public function parameters_to_session() {
		$this->noo_gallery->parameters_to_session();
	}

/*
* Store the current gallery parameters to the session variables
*/
	public function parameters_from_session() {
		$this->noo_gallery->parameters_from_session();
	}


/*
* Set the colour of the gallery frame (the background for each image)
*/
	public function thumbnail_frame($colour=null) {
		$this->noo_gallery->thumbnail_frame($colour);
	}

/*
* Set the colour of the gallery trim (the border for the frames)
*/
	public function thumbnail_trim($colour=null) {
		$this->noo_gallery->thumbnail_trim($colour);
	}

/*
* Set the maximum height of the thumbnails for the images
*/
	public function thumbnail_height($height=null) {
		$this->noo_gallery->thumbnail_height($height);
	}

/*
* Set the maximum width of the thumbnails for the images
*/
	public function thumbnail_width($width=null) {
		$this->noo_gallery->thumbnail_width($width);
	}

/*
* Set the minimum margin around the thumbnails for the images
*/
	public function thumbnail_margin($margin=null) {
		$this->noo_gallery->thumbnail_margin($margin);
	}

/*
* Set the width of the border around the gallery item
*/
	public function item_border($width=null) {
		if (is_null($width)) { 
			return $this->noo_gallery->item_border($width);
		} else {
			$this->noo_gallery->item_border($width);
		}
	}

/*
* Set the image list explicitly
*/
	public function file_patterns($files=null) {
		$this->noo_gallery->file_patterns($files);
	}

/*
* Specify a group name used by colourbox to identify the set of images to display
*/
	public function slideshow_group($slideshow_group=null) {
		$this->noo_gallery->slideshow_group($slideshow_group);
	}

/*
* Specify a CSS class name used to identify the set of images to in the slider gallery
*/
	public function content_class($content_class=null) {
		$this->noo_gallery->content_class($content_class);
	}

/*
* Set the maximum width of the thumbnails for the images
*/
	public function gallery_width($width=null) {
		$this->noo_gallery->gallery_width($width);
	}

/*
* The method which produces the entire web page based on the values currently set.
*/
	public function show_page() {
		//Calculate the height and width of the div holding the image.
		//Used in centring the image (only need the height really as horizontal centring works as standard).

		$this->page_start();
		$this->body_start();
		$this->body_main();
		$this->body_end();
		$this->page_end();
	}

/*
* Produce the page header including CSS and Javascript
* Note that there still may be a few places where CSS and Javascript are defined in-place because they rely on transient values.
*/
	public function page_start() {
/*
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN"
           "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
*/
?>
<!DOCTYPE html">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=iso-8859-1">
<title><?php echo $this->page_title ?></title>
<?php
		$this->noo_gallery->page_includes();
		$this->noo_reconfigure->js_includes();
		$this->noo_reconfigure->css_includes();
		$this->css_includes();
		$this->css_code();
		$this->noo_reconfigure->js_code();
		$this->js_includes();
		$this->js_code();
?>
</head>
<?php
	}

/*
* Complete the page.
* Usually just closing the html tag
*/
	public function page_end() {
?>
</html> 
<?php
	}

/*
* Produce the page body tag and anything else needed at the start of the body
*/
	public function body_start() {
?>
<body>
<?php
	}

/*
* Close the page body tag and produce anything else needed to complete the body
*/
	public function body_end() {
?>
</body>
<?php
	}

/*
* Generate the links to include common css files
*/
	public function css_includes() {
?>
<link type="text/css" media="screen" rel="stylesheet" href="css/noo_images.css" />
<?php
	}

/*
* CSS definitions specifically related to this PHP and Javascript code
*/
	public function css_code() {
?>
<?php
	}

/*
* Include common Javascript libraries
*/
	public function js_includes() {
/*
<script type="text/javascript" src="js/jquery-1.10.2.min.js"></script>
*/
?>
<script type="text/javascript" src="js/noo_tools.js"></script>
<script type="text/javascript" src="js/noo_images.js"></script>
<?php
	}

/*
* Javascript code for this application
*/
	public function js_code() {
?>
<script type="text/javascript">


</script>
<?php
	}

/*
* Split the body code into three sections
* Typically this will be stuff for the whole page in the prologue and epilogue, and perform will be the the main content.
*/
	public function body_main() {
		$this->body_prologue();
		$this->body_perform();
		$this->body_epilogue();
	}

/*
* Preamble to the main page
* At the moment just a title and place-holders for displaying infor for debugging
*/
	public function body_prologue() {
?>
<div id="noo-prologue">
<h1>Gallery and slideshow using JQuery and Colorbox</h1>
<p id='debug-info'></p>
<p id='extra-info'></p>
</div>
<?php
	}

/*
* Postscript to the main page
* At the moment just the copyright notice
*/
	public function body_epilogue() {
?>
<div id="noo-epilogue">
<div id="noo-copyright-box">
<p id="noo-copyright-notice">(c) Nigel Whitley 2013-2014</p>
</div>
</div>
<?php
	}

/*
* The main page content
* For this demo we'll have the gallery at the top.
* Below that we can show an image the user has selected by clicking on its thumbnail or
* show the configuration parameters for the gallery so the user can experiment with the settings.
*/
	public function body_perform() {
?>
<div id="noo-perform">

<?php
		$this->show_sliding_gallery();
?>
<?php
		$this->include_slideshow();
?>
<div id="noo-toggle-content">

<div id="noo-content-view">
<?php
		$this->main_controls();
		$this->initial_instructions();
		$this->highlight_single_image();
?>
</div> 
<?php

		$this->noo_reconfigure->show_parameter_controls();

?>
</div> 

</div> 
<?php
		//End of body_perform
	}

/*
* For this demo we show the image when the user clicks its thumbnail.
* The work is mostly done with javascript using jQuery
*/
	public function highlight_single_image() {
?>
<div id="noo-highlighted-image">
<div class="change-image previous-image">
<img src='images/left_arrow.png'/>
</div>
<div class="change-image next-image">
<img src='images/right_arrow.png'/>
</div>

<div id='noo-image-frame'>

</div>
</div> 
<?php
		//End of highlight_single_image
	}

/*
* Display some simple instructions for using the demo.
*/
	public function initial_instructions() {
?>
<div id="noo-instructions">

<p id='noo-instructions-text'>Click on a thumbnail in the gallery and the image will replace these instructions.
<br/><br/>Click <span class='noo-button-text'>Reconfigure</span> to change the gallery or the type of slideshow.
<span id='noo-slideshow-instructions'>
<br/><br/>Click <span class='noo-button-text'>Make slideshow</span> to begin a slideshow of the checked images.
<br/>Click <span class='noo-button-text'>Select all</span> to check all of the images.
<br/>Click <span class='noo-button-text'>Select none</span> to uncheck all of the images.
</span>

</p>

</div> 
<?php
		//End of initial_instructions
	}

/*
* Controls for the gallery and slideshow.
* The button code is mostly javascript using jQuery
*/
	public function main_controls() {
?>
<div id="noo-main-controls">

<button type='button' id='noo-reconfigure' class="noo-button-text" title="Change the gallery/slideshow">Reconfigure</button>
<span id=noo-slideshow-controls>
<button type='button' id='noo-slideshow-button' class="noo-button-text" title="Make a slideshow of the selected images">Start slideshow</button>
<button type='button' id='noo-select-none' class="noo-button-text" title="Select all images in the gallery">Select none</button>
<button type='button' id='noo-select-all' class="noo-button-text" title="Clear any selection of images in the gallery">Select all</button>
</span>

</div> 
<?php
		//End ofmain_controls
	}

/*
* For this demo we have controls for the parameters to the gallery
* so folk can play with them and see the effect
* It is structured as a form
*/

/*
* Producing the page info for the sliding gallery.
* Most of the work is done in the js_code for the gallery
* So here we just need to set up the divs and images for the js to act on
* This function should be largely plug and play.
*/
	public function show_sliding_gallery() {
?>
<script type="text/javascript">

noo_gallery.after_content_built = noo_images.after_gallery_built;
//noo_debug_info('argc after_content_built check - type ' + typeof(this.after_content_built), 'append');
noo_gallery.after_content_built();
	//noo_extra_info('Called leaving after rebuild - class ' + this_gallery.currentParameters.getValue('content_class'));
</script>

<?php
		$this->noo_gallery->show_gallery();
	} //End of show_sliding_gallery

/*
* Producing the page markup for the slideshow.
* Most of the work is done in the js_code for the slideshow
* So here we just need to let the slideshow php code generate the divs 
* to display the slides modally.
* This function should be largely plug and play.
*/
	public function include_slideshow() {
?>
<script type="text/javascript">

	//noo_extra_info('Called leaving after rebuild - class ' + this_gallery.currentParameters.getValue('content_class'));
</script>

<?php
		echo $this->noo_gallery->include_slideshow();
	} //End of include_slideshow

}  // end of object Noo_images

$noo_images = new Noo_images();


//unset($_SESSION["noo_gallery"]);
if (isset($_SESSION["noo_gallery"]) ) {
	$noo_images->parameters_from_session();
} else {
	$noo_images->thumbnail_height(100);
	$noo_images->thumbnail_width(80);
	$noo_images->thumbnail_margin(5);
	$noo_images->thumbnail_trim("lavender");
	$noo_images->thumbnail_frame("oldlace");
	$noo_images->gallery_width("90%");
	$noo_images->item_border(3);

	//$noo_images->file_patterns(array("content/some/DSCF0120.JPG", "content/some/DSCF0123.jpg", "content/some/DSCF0138.jpg", "content/some/DSCF0138.jpg", "content/others/DSCF0131.jpg", "content/others/DSCF0134.jpg", "content/others/DSCF0143.jpg"));
	//$noo_images->file_patterns("content/all/*.JPG");
	//$noo_images->file_patterns(array("content/extras/late_roses_red_lores.jpg", "content/extras/late_red_crop.png", "content/all/*.JPG"));
	// getfh doesn't support PNG image manipulation in PHP
	$noo_images->file_patterns(array("content/extras/late_roses_red_lores.jpg", "content/all/*.JPG"));
	//unset($_SESSION["noo_gallery"]);
	$noo_images->parameters_to_session();
}
$noo_images->show_page();

?>

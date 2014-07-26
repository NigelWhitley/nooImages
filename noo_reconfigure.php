<?php
/* 
 Image Gallery v0.2 by Nigel Whitley (c) Copyright 2013-2014
 This software is released under the terms of the GPL. For details, see license.txt.
 */
/*
 Module for reconfiguring the gallery and slideshow. 
 Note that not all parameters can be changed on here.
 The intended use is to play with the look of the gallery here then put those values 
 into the default values in the main noo_images.php file.
 Operates in conjunction with JavaScript (noo_reconfigure.js) and CSS (noo_reconfigure.css)
 The JavaScript processing makes heavy use of the noo_parameter and noo_validation modules
 */
require_once("noo_slideshow.php");

class Noo_reconfigure {

	//Gallery object
	protected $noo_gallery;
	// Properties primarily for interface
	public $pattern_window_max_rows;

/*
* Constructor for the class.
* Just sets up some default values
*/
	public function __construct($gallery) {

		$this->noo_gallery = $gallery;
		$this->pattern_window_max_rows = 5;

		/*
		All of theses variables can be changed after the object has been instantiated.
		They are used during execution of the show_page method.
		The defaults will work well enough (IMHO) so the only elements which really need
		to be set by the user are for the image sources.
		image_pattern populates image_list using a regular expression.
		Alternatively image_list can be populated directly
		*/
	}

/*
* Generate the links to include common css files
*/
	public function css_includes() {
?>
<link type="text/css" media="screen" rel="stylesheet" href="css/noo_reconfigure.css" />
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
?>
<script type="text/javascript" src="js/noo_reconfigure.js"></script>
<?php
	}

/*
* Javascript code for this application
*/
	public function js_code() {
?>
<script type="text/javascript">
function set_pattern_window_rows() {
	var number_of_rows = <?php echo $this->pattern_window_max_rows; ?>;
	noo_reconfigure.set_pattern_window_rows(number_of_rows);
}
</script>
<?php
	}

/*
* For this demo we have controls for the parameters to the gallery
* so folk can play with them and see the effect
* This is structured as a form
*/
	public function show_parameter_controls() {
?>
<div id="noo-parameter-controls-wrap">
<div id="noo-parameter-controls">

<form id='parameter-form' name='parameters' action='#' method='post'>
<div id='parameter-info'>
<p>You can change the parameters of the gallery and slideshow with these controls. <br/>Click <span class='noo-button-text'>Try now</span> when you want to see the result or <span class='noo-button-text'>Cancel</span>.
</p>
<p id='parameter-buttons'>
<button type="button" id="try-parameters" class="noo-button-text" name="try_now" title="Apply the changes and display the gallery">Try now</button>
<button type="button" id="cancel-parameters" name="cancel" title="Ignore any changes and close the configuration form">Cancel</button>
</p>
</div>


<div id='size-controls'>
<span id="thumbnail-height"  title="Maximum height of thumbnail images in the gallery">
<label for="thumbnail_height">Height</label>
<input type="text" class="noo-text-input" name="thumbnail_height" value='<?php echo $this->noo_gallery->thumbnail_height() ?>' size="4">
</span>
<span id="thumbnail-width" title="Maximum width of thumbnail images in the gallery">
<label for="thumbnail_width">Width</label>
<input type="text" class="noo-text-input" name="thumbnail_width" value='<?php echo $this->noo_gallery->thumbnail_width() ?>' size="4">
</span>

<span id="thumbnail-margin" title="Minimum margin around thumbnail images in the gallery">
<label for="thumbnail_margin">Margin</label>
<input type="text" class="noo-text-input" name="thumbnail_margin" value='<?php echo $this->noo_gallery->thumbnail_margin() ?>' size="4">
</span>
</div>

<div id='colour-controls'>
<span id="thumbnail-frame" title="Colour of unused space around thumbnail image">
<label for="thumbnail_frame">Frame colour</label>
<input type="text" class="noo-text-input" name="thumbnail_frame" value='<?php echo $this->noo_gallery->thumbnail_frame() ?>'>
</span>
<span id="thumbnail-trim" title="Colour of border around thumbnail image (including margin)">
<label for="thumbnail_trim">Trim colour</label>
<input type="text" class="noo-text-input" name="thumbnail_trim" value='<?php echo $this->noo_gallery->thumbnail_trim() ?>'>
</span>
<br/>
</div>

<div id='display-choice'>
<span id="slideshow-type-span" title="Type of slideshow to produce">
<label for="slideshow_type">Slideshow</label>
<select id="slideshow-type" name="slideshow_type">
<option value="colorbox_auto">Colorbox - auto</option>
<option value="colorbox_manual">Colorbox - manual</option>
<option value="native_auto">Native - auto</option>
<option value="native_manual">Native - manual</option>
</select>
</span>

<div id="file-patterns" title="File patterns specifying images in the gallery">
<label id="file-pattern-label">Which images?
</label>
<div id="file-patterns-group">
<ol id="file-patterns-list" name="file_patterns_list">
<?php
	for ($pattern_index = 1; $pattern_index <= $this->pattern_window_max_rows; $pattern_index++) {
?>
<li>
<input type="text" class="file-pattern noo-text-input" name="file_patterns_<?php echo $pattern_index; ?>" id="file-patterns-<?php echo $pattern_index; ?>" size="40">
</li>
<?php
	}
?>
</ol>
</div>
</div>

</div>


<?php


?>
</form>
</div> 
</div> 
<?php
		//End of show_parameter_controls
	}


}  // end of object Noo_reconfigure


?>

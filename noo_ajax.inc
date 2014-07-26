<?php
/* 
 Image Gallery v0.2 by Nigel Whitley (c) Copyright 2013-2014
 This software is released under the terms of the GPL. For details, see license.txt.
 */
/*
 Functions for responding to specific AJAX requests
 */
	require_once("noo_tools.inc");
	require_once("noo_slideshow.php");

	function ajax_add_image_to_gallery($image_file) {
		#$response->simple("resize", array("group_id" => $_SESSION["details"]["group_id"],   "image_height" => $_SESSION["details"]["image_height"], "image_width" => $_SESSION["details"]["image_width"]) );
		$noo_gallery = new Noo_slideshow();
		//$image_file=$_GET["file"];
		
		//$response = "<div class='noo-gallery-content-item'>";
		$response = $noo_gallery->noo_item_before($image_file);
		$response .= $noo_gallery->show_gallery_item($image_file);
		$response .= $noo_gallery->noo_item_after($image_file);
		//$response .= "</div>";
		return $response;
	}


	function ajax_test_info() {
		$response=new ResponseHTML();
		$response->start();
		#$response->simple("resize", array("group_id" => $_SESSION["details"]["group_id"],   "image_height" => $_SESSION["details"]["image_height"], "image_width" => $_SESSION["details"]["image_width"]) );
		if (isset($_SESSION["noo_gallery"]["content_class"])) {
			$response->complex_start("div", array("class" => $_SESSION["noo_gallery"]["content_class"]) );
			$response->text("class is ");
			$response->complex_start("strong");
			$response->text($_SESSION["noo_gallery_class"]);
			$response->complex_end("strong");
			$response->complex_end("div");
		}
		$response->end();
		$response->show();
	}


?>

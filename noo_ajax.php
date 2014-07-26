<?php
/* 
 Image Gallery v0.2 by Nigel Whitley (c) Copyright 2013-2014
 This software is released under the terms of the GPL. For details, see license.txt.
 */
/*
 Target for AJAX requests. 
 Processes each request based on "action" and "target" variables passed as part of the GET array.
 */
	session_start();

	#Define global variables


	require_once "noo_ajax.inc";


	function check_ajax_args() {

		if ( isset($_GET["action"]) ) {
			#if (isset($_POST["delfile[]"])) {
			if ( $_GET["action"] == "expand_patterns" ) {
				$image_pattern = $_GET["target"];
				$image_list = array();
				if (is_string($image_pattern) && strlen($image_pattern) > 0 ) {
					$image_list = glob($image_pattern);
				} else {
					$image_list[] = "No target";
				}
				#echo count($image_list) . " files in pattern\n";
				$response=json_encode($image_list);
				echo $response;
			} elseif ( $_GET["action"] == "get_parameters" ) {
				$parameter_values = array();
				foreach ( $_POST as $parameter_key=>$parameter_value ) {
					//$parameter_values["input" . $parameter_key] = $_SESSION["noo_gallery"][$parameter_key];
					if ( isset($_SESSION["noo_gallery"][$parameter_key]) ) {
						$parameter_values[$parameter_key] = $_SESSION["noo_gallery"][$parameter_key];
					}
				}
				$response=json_encode($parameter_values);
				echo $response;
			} elseif ( $_GET["action"] == "set_parameters" ) {
				//$parameter_list = $_POST["data"];
				foreach ( $_POST as $parameter_key=>$parameter_value ) {
					//if ( isset($_SESSION["noo_gallery"][$parameter_key]) ) {
						$_SESSION["noo_gallery"][$parameter_key] = $parameter_value;
					//}
				}
				echo json_encode("Put OK");
			} elseif ( $_GET["action"] == "add_image" ) {
				#print "<p>";
				#print "Expanding images<br/>";
				#print "</p>";
				$image_file = $_GET["target"];
				$response=ajax_add_image_to_gallery($image_file);
				echo $response;
			} elseif ( $_GET["action"] == "ajax_test_info" ) {
				ajax_test_info();
			}
		} else {
				$response="Action " . $_GET["action"] . " for " . $_GET["target"] . " unknown";
				echo $response;
		}

		#echo $response;

	}


	check_ajax_args();


?> 

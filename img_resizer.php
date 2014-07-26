<?php
/* 
 Image Gallery v0.2 by Nigel Whitley (c) Copyright 2013-2014
 This software is released under the terms of the GPL. For details, see license.txt.
 */
/*
 Produces a resized image based on maximum height and width passed as parameters. 
 This is mostly intended for making thumbnail images at the server rather than at the client,
 thus reducing network traffic and CPU load on the client.
 */
	session_start();

	#Define global variables
	$checked_boxes=array();
	$chosen_file="";
	$display_mode="";

	require_once "img_resizer.inc";

	function image_resizer() {
		GLOBAL $checked_boxes;
		GLOBAL $chosen_file;
		GLOBAL $display_mode;

		$resized_height = 0;
		$resized_width = 0;

		$checked_count=0;

		#if ( ( isset($_GET["file"]) ) && ( isset($_GET["target"]) ) ) {
		if ( isset($_GET["file"]) ) {
			if ( isset($_GET["height"]) ) {
				$resized_height = $_GET["height"] + 0;
			}
			if ( isset($_GET["width"]) ) {
				$resized_width = $_GET["width"] + 0;
			}

			if ( ( $resized_width == 0 ) && ( $resized_height == 0 ) ) {
				$resized_height = DEF_THUMBNAIL_HEIGHT;
				$resized_width = DEF_THUMBNAIL_WIDTH;
			}

			$original_image=$_GET["file"];
			$image_info=getimagesize($original_image);
			$image_width=$image_info[0];
			$image_height=$image_info[1];
			$image_type=$image_info[2];

			if ( $resized_height == 0 ) {
				if ( $image_width > $resized_width ) {
					$resized_height = ( $resized_width * $image_height ) / $image_width;
				} else {
					$resized_height = $image_height;
					$resized_width = $image_width;
				}
			} elseif ( $resized_width == 0 ) {
				if ( $image_height > $resized_height ) {
					$resized_width = ( $resized_height * $image_width ) / $image_height;
				} else {
					$resized_height = $image_height;
					$resized_width = $image_width;
				}
			} else {
				if ( ( $image_width > $resized_width ) || ( $image_height > $resized_height ) ) {
					if ( ( $resized_width * $image_height ) > ( $resized_height * $image_width ) ) {
						$resized_width = ( $resized_height * $image_width ) / $image_height;
					} else {
						$resized_height = ( $resized_width * $image_height ) / $image_width;
					}
				} else {
					$resized_height = $image_height;
					$resized_width = $image_width;
				}
			}

			switch ($image_type) {
				case IMAGETYPE_GIF :
					$source_image = imageCreateFromGif($original_image);
					break;
				case IMAGETYPE_JPEG :
					$source_image = imageCreateFromJpeg($original_image);
					break;
				case IMAGETYPE_PNG :
					$source_image = imageCreateFromPng($original_image);
					break;
				case IMAGETYPE_WBMP :
					$source_image = imageCreateFromWbmp($original_image);
					break;
				case IMAGETYPE_XBM :
					$source_image = imageCreateFromXbm($original_image);
					break;
			}
			//$source_image = imagecreatefromjpeg($original_image);
			$resized_image = imagecreatetruecolor($resized_width, $resized_height);
			imagecopyresampled($resized_image,$source_image,0,0,0,0,$resized_width,$resized_height,$image_width,$image_height);
			imagejpeg($resized_image);
			imagedestroy($resized_image);
			#print_r($_SESSION);
		} else {
			$response="file " . $_GET["file"] . " for " . $_GET["height"] . " unknown";
			echo $response;
		}

		#echo $response;

	}

	image_resizer();


?> 

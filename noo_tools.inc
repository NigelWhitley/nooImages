<?php
/* 
 Image Gallery v0.2 by Nigel Whitley (c) Copyright 2013-2014
 This software is released under the terms of the GPL. For details, see license.txt.
 */
/*
 Encapsulations of XML and HTML response such as might be used by AJAX code.
 */
	class ResponseXML
	{

		protected $element_stack = array();
		protected $line = array();
		//protected $last_line_output = -1;

		function start()
		{
			$this->line = array();
			//header('Content-Type: text/xml');
			//header('Content-Type: text/html');
			$this->line[count($this->line)]='<?xml version="1.0" encoding="UTF-8" standalone="yes"?>';
			$this->line[count($this->line)]="<response>";
		}

		function complex_start($name, $attributes=array() )
		{
			$start_line="<$name";
			if ($attributes) {
				foreach($attributes as $key => $val) {
					$start_line=$start_line . " " . $key . "=\"" . $val . "\"";
				}
			}
			$start_line= $start_line . ">";
			$this->line[count($this->line)]=$start_line;
}

		function complex_end($name)
		{
			$this->line[count($this->line)]="</" . $name . ">";
		}

		function simple($name, $attributes=array() )
		{
			$simple_line="<$name";
			if ($attributes) {
				foreach($attributes as $key => $val) {
					$simple_line=$simple_line . " " . $key . "=\"" . $val . "\"";
				}
			}
			$simple_line= $simple_line . "></$name>";
			$this->line[count($this->line)]=$simple_line;
		}

		function text($text)
		{
			$this->line[count($this->line)]="$text";
			//echo "\n";
		}

		function end()
		{
			$this->line[count($this->line)]="</response>";
		}

		function show()
		{
			header('Content-Type: text/xml');
			//header('Content-Type: text/html');
			foreach($this->line as $line_index => $response_line) {
				echo $response_line . "\n";
			}
		}

	}


	class ResponseHTML
	{

		protected $element_stack = array();
		protected $line = array();
		//protected $last_line_output = -1;

		function start()
		{
			$this->line = array();
			//header('Content-Type: text/xml');
			//header('Content-Type: text/html');
			//$this->line[count($this->line)]="<response>";
		}

		function complex_start($name, $attributes=array() )
		{
			$start_line="<$name";
			if ($attributes) {
				foreach($attributes as $key => $val) {
					$start_line=$start_line . " " . $key . "=\"" . $val . "\"";
				}
			}
			$start_line= $start_line . ">";
			$this->line[count($this->line)]=$start_line;
			//This has the same effect as array_push($this->element_stack, $name)
			$this->element_stack[]=$name;
}

		function complex_end($name = null)
		{
			if ( count($this->element_stack) > 0 ) {
				$check_name = array_pop($this->element_stack);
				if ( is_null($name) || strcmp($check_name, $name) == 0 ) {
					$this->line[count($this->line)]="</" . $check_name . ">";
				} else {
					// Error: stack and argument do not match
					$this->line[count($this->line)]="</" . $name . ">";
				}
			} else {
				// Error: stack is empty so no matching start
				$this->line[count($this->line)]="</" . $name . ">";
			}
		}

		function simple($name, $attributes=array() )
		{
			$simple_line="<$name";
			if ($attributes) {
				foreach($attributes as $key => $val) {
					$simple_line=$simple_line . " " . $key . "=\"" . $val . "\"";
				}
			}
			$simple_line= $simple_line . "/>";
			$this->line[count($this->line)]=$simple_line;
		}

		function text($text)
		{
			$this->line[count($this->line)]="$text";
			//echo "\n";
		}

		function end()
		{
			//$this->line[count($this->line)]="</response>";
		}

		function show()
		{
			//header('Content-Type: text/html');
			foreach($this->line as $line_index => $response_line) {
				echo $response_line . "\n";
			}
		}

		function get()
		{
			$combined = "";
			//header('Content-Type: text/html');
			foreach($this->line as $line_index => $response_line) {
				$combined .= $response_line;
			}
			return $combined;
		}

	}


?>

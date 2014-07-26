          noo_images
          ----------
The noo_images image gallery is a way of playing with lots of things at once - notably exploring the jQuery library to simplify Javascript code and trying Javascript and CSS generated from PHP. The idea was to allow initial parameters to be set from PHP and stored server-side but are then used directly by Javascript and CSS without needing AJAX, which should give a better user experience when initially loading the page. I still wanted to allow the parameters to be changed from the browser and persist (via AJAX) across reloads. No-one said it would be easy :-) .

Having seen the JQuery UI demo I plumped for an image gallery and decided to have it feed a slideshow using Colorbox. (Note that although the code for both jQuery and ColorBox are included in the code zip, I claim no copyright in them). My normal practice is to make code as re-usable as possible. In part that may be due to laziness but I like to think it's also more efficient because a problem only needs to be solved once. The downside is that the code tends to be more complex.

For this application I wanted to make the gallery code modular enough to allow some tailoring without touching the original code. Function hooks such as that used in WordPress and Magento seem a sound approach. Therefore you can see that the code divides the processing for each item (image) in the gallery into "before item", "item content" and "after item". The base noo_gallery does nothing for "before item" and "after item". 

The noo_slideshow code then became an example of how to use/extend the noo_gallery "module". To help distinguish between the requirements of ColorBox and the noo_gallery code, there is a "native" slideshow which just puts each slide onto a "modal" screen.

The main noo_images application ties the code together and adds the facility to display each image individually. Clicking on an image in the gallery will display it below the gallery (and the slideshow/reconfigure buttons) scaled to use the remaining space. 

While coding, it became clear that the transfer and coordination of parameter information between PHP, JavaScript and server required lots of repetitive code. Any programmer seeing lots of similar code will (or should) wonder how to reduce it using calls to common functions. Hence the noo_parameter code which provides a basic module for handling sets of parameters, including making AJAX calls using jQuery. The three "standard" actions are 'default', 'copy' and 'update' for each of which there is a function hook.
-'default' simply initialises a set of paramaters to its default values.
-'copy' does what it says on the tin and is not likely to be used much. 
-'update' is the fiddly bit and deals with the knotty problem of what to do when the values of the parameters change. It's up to the application to define a function which interprets the changes and takes the appropriate action.

For testing it was useful to be able to play around with different settings for the gallery so a reconfiguration option was needed. noo_reconfigure handles that by displaying some of the parameters and allowing new values to be tried. The entry of file patterns is perhaps a little quirky. The aim was to have a method of entering any number of file patterns without turning that section into a mini-dialog box with controls for adding and removing fields.Basically it always leaves one blank input field. Moving focus away from a blank input field will cause it to be deleted, unless it is the only one. Moving focus away from a non-blank input field will cause a new blank field to be added, if there are now none.

Allowing users to enter values into text fields inevitably led to the issue of validation. Validation is also linked to the definition of parameters. The noo_validation module provides a basis for supporting both requirements although noo_parameters and noo_validation have far greater general utility than the application specific noo_reconfigure. 
 
The code as a whole seems to work but I've "released" it early so there are bound to be some rough edges, especially on platforms for which I have limited facility to test. 

---------------------
Nigel Whitley - July 2014

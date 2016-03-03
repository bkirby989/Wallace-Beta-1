<!DOCTYPE html>
<html ng-app="wordpressContent" class="no-js" lang="en" ng-strict-di>
<head>
    <base href="<?php bloginfo('url')?>/">



	<link rel="shortcut icon" href="<?php echo get_template_directory_uri(); ?>/logo.jpg" />



    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"  />
    <title ng-bind-html="siteTitle + resourceTitle"> 
    </title>
    

        <?php wp_head(); ?>

        
  </head>

  
  <body>


<?php 


// Load JS

require_once  TEMPLATEPATH. '/rest-api/plugin.php';


function load_scripts() {

	//Load Angular JS
	wp_register_script('angular', 'https://ajax.googleapis.com/ajax/libs/angularjs/1.3.8/angular.min.js', array('jquery'), false, null);
	wp_enqueue_script('angular' );

	//Load Angular-Route 
	wp_register_script('angular-route', 'https://ajax.googleapis.com/ajax/libs/angularjs/1.3.8/angular-route.min.js', false, null);
	wp_enqueue_script('angular-route' );

	//Load ng-touch
	wp_register_script('angular-touch', 'https://ajax.googleapis.com/ajax/libs/angularjs/1.3.8/angular-touch.js', false, null);
	wp_enqueue_script('angular-touch' );

	//Load Angular-Sanitize
	wp_register_script('Angular-Sanitize', 'https://ajax.googleapis.com/ajax/libs/angularjs/1.3.8/angular-sanitize.min.js', false, null);
	wp_enqueue_script('Angular-Sanitize' );

	//Load Angular-Animate
	wp_register_script('angular-animate', 'https://ajax.googleapis.com/ajax/libs/angularjs/1.3.8/angular-animate.min.js', false, null);
	wp_enqueue_script('angular-animate' );

	wp_register_script('angular-cookies', 'https://ajax.googleapis.com/ajax/libs/angularjs/1.3.8/angular-cookies.js', false, null);
	wp_enqueue_script('angular-cookies' );

	//ajax.googleapis.com/ajax/libs/angularjs/X.Y.Z/angular-cookies.js


	//Load Angular-Router 
	wp_enqueue_script('angular-ui-router', get_template_directory_uri() . '/js/angular-ui-router.js', array('angular'), false, true ); 


	wp_enqueue_script('post-service', get_template_directory_uri() . '/angular/services/post-service.js', array('angular'), false, true ); 
	wp_enqueue_script('utilities-service', get_template_directory_uri() . '/angular/services/utilities-service.js', array('angular'), false, true ); 
	wp_enqueue_script('comment-service', get_template_directory_uri() . '/angular/services/comment-service.js', array('angular'), false, true ); 
	wp_enqueue_script('comment-directives', get_template_directory_uri() . '/angular/directives/comment-directives.js', array('angular'), false, true );
	wp_enqueue_script('post-directives', get_template_directory_uri() . '/angular/directives/post-directives.js', array('angular'), false, true ); 
 	wp_enqueue_script('post-menu-directives', get_template_directory_uri() . '/angular/directives/post-menu-directives.js', array('angular'), false, true ); 
 	wp_enqueue_script('topbar-directives', get_template_directory_uri() . '/angular/directives/topbar-directives.js', array('angular'), false, true ); 
 	wp_enqueue_script('aside-directives', get_template_directory_uri() . '/angular/directives/aside-directives.js', array('angular'), false, true ); 

 // wp_enqueue_script('app_js', get_template_directory_uri() . '/app.js', array('angular'), false, true ); 



	

	//Load Foundation JS

	// wp_enqueue_script('foundation_js', get_template_directory_uri() . '/js/foundation.js', array('jquery'), false, true );
	// wp_enqueue_script('theme_js', get_template_directory_uri() . '/js/theme.js', array('jquery', 'foundation_js' ), false, true );

	

	//Load app JS

	wp_enqueue_script('app_js', get_template_directory_uri() . '/angular/app.js', array('angular'), false, true );

	//provide theme path to js files
	$translation_array = array('theme_path' => get_template_directory_uri(), 'some_string' => __('ok go') );
	wp_localize_script( 'app_js', 'red_eye_theme_path', $translation_array );





}

add_action( 'wp_enqueue_scripts', 'load_scripts');


//don't display admin bar
show_admin_bar( false ); 


// add top-level categories to wp api posts response
function add_categories($data, $post, $request) {
	///print_r($post->ID);

	$response_data = $data->get_data();
	$all_categories = wp_get_post_categories($post->ID);
	$top_categories = array();
	foreach ($all_categories as $cat) {
			$c = get_category($cat);
			// if($c -> parent == 0){

				$top_categories[] = $c;
			//}
	}	
	$response_data['category_data'] = $top_categories;
  $data->set_data($response_data);
  //print_r($data);
  return $data;
}
add_filter('rest_prepare_post', 'add_categories', 10, 3);



function lock_in_permalinks() {
    global $wp_rewrite;
    $wp_rewrite->set_permalink_structure( '/blog/%postname%/' );// you can change /%postname%/ to any structure
}
add_action( 'init', 'lock_in_permalinks' );



/**
 * Disable the emoji's
 */
function disable_emojis() {
	remove_action( 'wp_head', 'print_emoji_detection_script', 7 );
	//remove_action( 'admin_print_scripts', 'print_emoji_detection_script' );
	remove_action( 'wp_print_styles', 'print_emoji_styles' );
	//remove_action( 'admin_print_styles', 'print_emoji_styles' );	
	remove_filter( 'the_content_feed', 'wp_staticize_emoji' );
	remove_filter( 'comment_text_rss', 'wp_staticize_emoji' );	
	remove_filter( 'wp_mail', 'wp_staticize_emoji_for_email' );
	//add_filter( 'tiny_mce_plugins', 'disable_emojis_tinymce' );
}
add_action( 'init', 'disable_emojis' );

/**
 * Filter function used to remove the tinymce emoji plugin.
 * 
 * @param    array  $plugins  
 * @return   array             Difference betwen the two arrays
 */
function disable_emojis_tinymce( $plugins ) {
	if ( is_array( $plugins ) ) {
		return array_diff( $plugins, array( 'wpemoji' ) );
	} else {
		return array();
	}
}


//Notes Shortcode Setup

function note_function($atts, $content = "") {

   return '<bc-aside>' . $content . '</bc-aside>';

}
add_shortcode('note', 'note_function');





//enable live preview for customizer

function redeye_customize_register( $wp_customize ) {
   //All our sections, settings, and controls will be added here
	
	//remove front page option since we don't use it
	$wp_customize->remove_section('static_front_page');


	// $wp_customize->add_section(
 //        'example_section_one',
 //        array(
 //            'title' => 'Example Settings',
 //            'description' => 'This is a settings section.',
 //            'priority' => 35,
 //        )
 //    );

 //    $wp_customize->add_setting(
	//     'copyright_textbox',
	//     array(
	//         'default' => 'Default copyright text',
	//     )
	// );

	// $wp_customize->add_control(
	//     'copyright_textbox',
	//     array(
	//         'label' => 'Copyright text',
	//         'section' => 'example_section_one',
	//         'type' => 'text',
	//     )
	// );




	// //color settings
	// $wp_customize->add_control( new WP_Customize_Color_Control( $wp_customize, 'color_control', array(
	//     'label' => __( 'Accent Color', 'theme_textdomain' ),
	//     'section' => 'media',
	// ) ) );



	// //background color
	// $wp_customize->add_setting( 'background_color', array(
 //    'default' => '#f9f7f3',
 //    'sanitize_callback' => 'sanitize_hex_color',
	// ) );
	// $wp_customize->add_section('colors');


	//make all settings update instantly 
	$wp_customize->get_setting( 'blogname' )->transport = 'postMessage';
	$wp_customize->get_setting( 'blogdescription' )->transport = 'postMessage';


}
add_action( 'customize_register', 'redeye_customize_register' );





// Load CSS

function load_styles() {
	wp_enqueue_style( 'foundation-icons', get_template_directory_uri() . '/css/foundation-icons.css' );
	//wp_enqueue_style( 'ionicons', get_template_directory_uri() . '/css/ionicons.css' );

	wp_enqueue_style( 'normalize', get_template_directory_uri() . '/css/normalize.css' );
	wp_enqueue_style( 'style', get_template_directory_uri() . '/style.css' );
	wp_enqueue_style( 'fonts', get_template_directory_uri() . '/fonts/stylesheet.css' );

}

add_action( 'wp_enqueue_scripts', 'load_styles');

?>
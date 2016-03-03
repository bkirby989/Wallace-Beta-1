

<?php get_header(); ?>

<div ui-view></div>


<div class="crawlable">
<?php 
if ( have_posts() ) {
	while ( have_posts() ) {
		the_post(); 
		//
		 ?><h1><?php the_title(); ?></h1>
		 <article><?php the_content(); ?></article>
		 <?php
		//
	} // end while
} // end if
?>

</div>

<?php get_footer(); ?>


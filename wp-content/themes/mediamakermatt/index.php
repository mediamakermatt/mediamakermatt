<?php get_header(); ?>

    <?php if (have_posts()) : while (have_posts()) : the_post(); ?>
        <section class="main-content">
            <div class="content-wrap">
                <div class="module page">
                    <h1 class="title"><?php wp_title(''); ?></h1>
                    <?php the_content(); ?>
                </div><!-- /.blog -->
            <?php get_sidebar(); ?>
            </div><!-- /.content-wrap -->
        </section>
    <?php endwhile; else : ?>
        404 not found
    <?php endif; ?> 

<?php get_footer(); ?>
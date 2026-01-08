<?php
/**
 * Plugin Name: Castle Event Block
 * Description: A custom Gutenberg block for highlighting special events at the castle.
 * Version: 0.1.1
 * Author: Hanscom Park Studio
 * Text Domain: castle-event-block
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

/**
 * Register the block and its assets.
 */
function castle_event_block_init() {
    
    // Register editor script
    wp_register_script(
        'castle-event-block-editor',
        plugins_url( 'build/index.js', __FILE__ ),
        array( 'wp-blocks', 'wp-element', 'wp-editor', 'wp-components', 'wp-i18n', 'wp-block-editor' ),
        filemtime( plugin_dir_path( __FILE__ ) . 'build/index.js' )
    );

    // Register editor styles
    wp_register_style(
        'castle-event-block-editor-style',
        plugins_url( 'build/editor.css', __FILE__ ),
        array( 'wp-edit-blocks' ),
        filemtime( plugin_dir_path( __FILE__ ) . 'build/editor.css' )
    );

    // Register frontend styles
    wp_register_style(
        'castle-event-block-style',
        plugins_url( 'build/style.css', __FILE__ ),
        array(),
        filemtime( plugin_dir_path( __FILE__ ) . 'build/style.css' )
    );

    // Register the block
    register_block_type( 'castle/event-block', array(
        'editor_script'   => 'castle-event-block-editor',
        'editor_style'    => 'castle-event-block-editor-style',
        'style'           => 'castle-event-block-style',
        'render_callback' => 'castle_event_block_render',
        'supports'        => array(
            'align' => array( 'wide', 'full' ),
        ),
        'attributes'      => array(
            'imageId' => array(
                'type'    => 'number',
                'default' => 0,
            ),
            'imageUrl' => array(
                'type'    => 'string',
                'default' => '',
            ),
            'imageAlt' => array(
                'type'    => 'string',
                'default' => '',
            ),
            'title' => array(
                'type'    => 'string',
                'default' => '',
            ),
            'blurb' => array(
                'type'    => 'string',
                'default' => '',
            ),
            'linkUrl' => array(
                'type'    => 'string',
                'default' => '',
            ),
            'buttonText' => array(
                'type'    => 'string',
                'default' => 'Learn More',
            ),
            'showButton' => array(
                'type'    => 'boolean',
                'default' => true,
            ),
            'endDate' => array(
                'type'    => 'string',
                'default' => '',
            ),
            'aspectRatio' => array(
                'type'    => 'string',
                'default' => '4:3',
            ),
        ),
    ) );
}
add_action( 'init', 'castle_event_block_init' );

/**
 * Server-side render callback for the block.
 * Handles the end date logic to hide blurb after event ends.
 */
function castle_event_block_render( $attributes ) {
    $image_url    = esc_url( $attributes['imageUrl'] ?? '' );
    $image_alt    = esc_attr( $attributes['imageAlt'] ?? '' );
    $title        = esc_html( $attributes['title'] ?? '' );
    $blurb        = wp_kses_post( $attributes['blurb'] ?? '' );
    $link_url     = esc_url( $attributes['linkUrl'] ?? '' );
    $button_text  = esc_html( $attributes['buttonText'] ?? 'Learn More' );
    $show_button  = $attributes['showButton'] ?? true;
    $end_date     = $attributes['endDate'] ?? '';
    $aspect_ratio = $attributes['aspectRatio'] ?? '4:3';

    // Calculate aspect ratio padding percentage
    $aspect_ratios = array(
        'original'  => null,
        '1:1'       => 100,
        '4:3'       => 75,
        '3:4'       => 133.33,
        '3:2'       => 66.67,
        '2:3'       => 150,
        '16:9'      => 56.25,
        '9:16'      => 177.78,
    );
    $aspect_padding = isset( $aspect_ratios[ $aspect_ratio ] ) ? $aspect_ratios[ $aspect_ratio ] : 75;

    // Determine if event has ended
    $is_past_event = false;
    if ( ! empty( $end_date ) ) {
        $end_timestamp = strtotime( $end_date );
        $today_timestamp = strtotime( 'today' );
        if ( $end_timestamp && $today_timestamp > $end_timestamp ) {
            $is_past_event = true;
        }
    }

    // Additional wrapper classes (alignment handled by block supports)
    $additional_classes = array();
    if ( $is_past_event ) {
        $additional_classes[] = 'is-past-event';
    }

    // Start output buffer
    ob_start();
    ?>
    <div <?php echo get_block_wrapper_attributes( array( 'class' => implode( ' ', $additional_classes ) ) ); ?>>
        <div class="castle-event-block__image-column">
            <?php if ( ! empty( $link_url ) ) : ?>
                <a href="<?php echo $link_url; ?>" class="castle-event-block__image-link">
            <?php endif; ?>
                <?php if ( ! empty( $image_url ) ) : ?>
                    <?php if ( $aspect_padding ) : ?>
                        <div class="castle-event-block__image-wrapper" style="padding-bottom: <?php echo esc_attr( $aspect_padding ); ?>%;">
                    <?php else : ?>
                        <div class="castle-event-block__image-wrapper castle-event-block__image-wrapper--original">
                    <?php endif; ?>
                        <img 
                            src="<?php echo $image_url; ?>" 
                            alt="<?php echo $image_alt; ?>" 
                            class="castle-event-block__image"
                        />
                    </div>
                <?php else : ?>
                    <div class="castle-event-block__image-wrapper castle-event-block__image-placeholder" style="padding-bottom: <?php echo esc_attr( $aspect_padding ?: 75 ); ?>%;">
                        <span>No image selected</span>
                    </div>
                <?php endif; ?>
            <?php if ( ! empty( $link_url ) ) : ?>
                </a>
            <?php endif; ?>
        </div>
        
        <div class="castle-event-block__content-column">
            <?php if ( ! empty( $title ) ) : ?>
                <h3 class="castle-event-block__title">
                    <?php if ( ! empty( $link_url ) ) : ?>
                        <a href="<?php echo $link_url; ?>"><?php echo $title; ?></a>
                    <?php else : ?>
                        <?php echo $title; ?>
                    <?php endif; ?>
                </h3>
            <?php endif; ?>
            
            <?php if ( ! $is_past_event && ! empty( $blurb ) ) : ?>
                <div class="castle-event-block__blurb"><?php echo $blurb; ?></div>
            <?php endif; ?>
            
            <?php if ( $show_button && ! empty( $link_url ) && ! empty( $button_text ) ) : ?>
                <a href="<?php echo $link_url; ?>" class="castle-event-block__button">
                    <?php echo $button_text; ?>
                </a>
            <?php endif; ?>
        </div>
    </div>
    <?php
    return ob_get_clean();
}

/**
 * Castle Event Block - Compiled for WordPress
 */
(function() {
    'use strict';

    const { registerBlockType } = wp.blocks;
    const { 
        useBlockProps, 
        MediaUpload, 
        MediaUploadCheck,
        RichText,
        InspectorControls,
        BlockControls
    } = wp.blockEditor;
    const { 
        PanelBody, 
        TextControl, 
        Button,
        DatePicker,
        Placeholder,
        ToggleControl,
        SelectControl,
        RangeControl,
        ToolbarGroup,
        ToolbarButton
    } = wp.components;
    const { Fragment, createElement: el } = wp.element;
    const { __ } = wp.i18n;

    registerBlockType( 'castle/event-block', {
        title: __( 'Castle Event', 'castle-event-block' ),
        description: __( 'Highlight a special event at the castle with image, title, description, and link.', 'castle-event-block' ),
        category: 'common',
        icon: 'calendar-alt',
        keywords: [ 
            __( 'event', 'castle-event-block' ), 
            __( 'exhibit', 'castle-event-block' ),
            __( 'castle', 'castle-event-block' )
        ],
        supports: {
            html: false,
            align: [ 'wide', 'full' ],
        },
        attributes: {
            imageId: {
                type: 'number',
                default: 0,
            },
            imageUrl: {
                type: 'string',
                default: '',
            },
            imageAlt: {
                type: 'string',
                default: '',
            },
            title: {
                type: 'string',
                default: '',
            },
            blurb: {
                type: 'string',
                default: '',
            },
            linkUrl: {
                type: 'string',
                default: '',
            },
            buttonText: {
                type: 'string',
                default: 'Learn More',
            },
            showButton: {
                type: 'boolean',
                default: true,
            },
            endDate: {
                type: 'string',
                default: '',
            },
            aspectRatio: {
                type: 'string',
                default: 'original',
            },
            stackOnMobile: {
                type: 'boolean',
                default: true,
            },
            mediaPosition: {
                type: 'string',
                default: 'left', // 'left' | 'right'
            },
            mediaWidth: {
                type: 'number',
                default: 50, // percentage
            },
        },

        edit: function( props ) {
            const { attributes, setAttributes } = props;
            const { 
                imageId, 
                imageUrl, 
                imageAlt,
                title, 
                blurb, 
                linkUrl, 
                buttonText,
                showButton,
                endDate,
                aspectRatio,
                stackOnMobile,
                mediaPosition,
                mediaWidth
            } = attributes;

            var gridColumns = ( mediaPosition === 'right' )
                ? '1fr ' + mediaWidth + '%'
                : mediaWidth + '% 1fr';

            const blockProps = useBlockProps({
                className: 'castle-event-block-editor' 
                    + ( mediaPosition === 'right' ? ' is-media-right' : '' )
                    + ( stackOnMobile ? '' : ' is-not-stacked-on-mobile' ),
                style: { '--castle-grid-columns': gridColumns }
            });

            const onSelectImage = function( media ) {
                setAttributes({
                    imageId: media.id,
                    imageUrl: media.url,
                    imageAlt: media.alt || '',
                });
            };

            const onRemoveImage = function() {
                setAttributes({
                    imageId: 0,
                    imageUrl: '',
                    imageAlt: '',
                });
            };

            // Check if event is past for editor preview
            const isPastEvent = endDate && new Date( endDate ) < new Date().setHours(0,0,0,0);

            // Calculate aspect ratio padding
            const aspectRatios = {
                'original': null,
                '1:1': 100,
                '4:3': 75,
                '3:4': 133.33,
                '3:2': 66.67,
                '2:3': 150,
                '16:9': 56.25,
                '9:16': 177.78,
            };
            var aspectPadding = aspectRatios.hasOwnProperty( aspectRatio ) ? aspectRatios[ aspectRatio ] : 75;

            return el( Fragment, {},
                el( BlockControls, {},
                    el( ToolbarGroup, {},
                        el( ToolbarButton, {
                            icon: 'align-pull-left',
                            label: __( 'Show media on left', 'castle-event-block' ),
                            isPressed: mediaPosition === 'left',
                            onClick: function() { setAttributes( { mediaPosition: 'left' } ); }
                        } ),
                        el( ToolbarButton, {
                            icon: 'align-pull-right',
                            label: __( 'Show media on right', 'castle-event-block' ),
                            isPressed: mediaPosition === 'right',
                            onClick: function() { setAttributes( { mediaPosition: 'right' } ); }
                        } )
                    )
                ),
                el( InspectorControls, {},
                    el( PanelBody, { title: __( 'Event Settings', 'castle-event-block' ), initialOpen: true },
                        el( ToggleControl, {
                            label: __( 'Stack on mobile', 'castle-event-block' ),
                            checked: stackOnMobile,
                            onChange: function( value ) { setAttributes( { stackOnMobile: value } ); }
                        } ),
                        el( RangeControl, {
                            label: __( 'Media width (%)', 'castle-event-block' ),
                            value: mediaWidth,
                            onChange: function( value ) { setAttributes( { mediaWidth: value } ); },
                            min: 15,
                            max: 85,
                            step: 1
                        } ),
                        el( SelectControl, {
                            label: __( 'Aspect Ratio', 'castle-event-block' ),
                            value: aspectRatio,
                            options: [
                                { label: 'Original', value: 'original' },
                                { label: 'Square - 1:1', value: '1:1' },
                                { label: 'Standard - 4:3', value: '4:3' },
                                { label: 'Portrait - 3:4', value: '3:4' },
                                { label: 'Classic - 3:2', value: '3:2' },
                                { label: 'Classic Portrait - 2:3', value: '2:3' },
                                { label: 'Wide - 16:9', value: '16:9' },
                                { label: 'Tall - 9:16', value: '9:16' },
                            ],
                            onChange: function( value ) { setAttributes({ aspectRatio: value }); }
                        }),
                        el( ToggleControl, {
                            label: __( 'Show Button', 'castle-event-block' ),
                            checked: showButton,
                            onChange: function( value ) { setAttributes({ showButton: value }); }
                        }),
                        showButton && el( TextControl, {
                            label: __( 'Link URL', 'castle-event-block' ),
                            value: linkUrl,
                            onChange: function( value ) { setAttributes({ linkUrl: value }); },
                            placeholder: 'https://'
                        }),
                        showButton && el( TextControl, {
                            label: __( 'Button Text', 'castle-event-block' ),
                            value: buttonText,
                            onChange: function( value ) { setAttributes({ buttonText: value }); }
                        }),
                        el( 'div', { className: 'castle-event-block__date-picker' },
                            el( 'label', { className: 'components-base-control__label' },
                                __( 'Event End Date', 'castle-event-block' )
                            ),
                            el( 'p', { className: 'components-base-control__help' },
                                __( 'After this date, the blurb will be hidden.', 'castle-event-block' )
                            ),
                            el( DatePicker, {
                                currentDate: endDate,
                                onChange: function( value ) { setAttributes({ endDate: value }); }
                            }),
                            endDate && el( Button, {
                                isSecondary: true,
                                isSmall: true,
                                onClick: function() { setAttributes({ endDate: '' }); },
                                style: { marginTop: '8px' }
                            }, __( 'Clear Date', 'castle-event-block' ))
                        )
                    )
                ),
                el( 'div', blockProps,
                    el( 'div', { className: 'castle-event-block__image-column' },
                        el( MediaUploadCheck, {},
                            el( MediaUpload, {
                                onSelect: onSelectImage,
                                allowedTypes: [ 'image' ],
                                value: imageId,
                                render: function( renderProps ) {
                                    var wrapperStyle = aspectPadding ? { paddingBottom: aspectPadding + '%' } : {};
                                    var wrapperClass = 'castle-event-block__image-wrapper' + ( !aspectPadding ? ' castle-event-block__image-wrapper--original' : '' );
                                    return el( 'div', { className: wrapperClass, style: wrapperStyle },
                                        imageUrl ? el( Fragment, {},
                                            el( 'img', {
                                                src: imageUrl,
                                                alt: imageAlt,
                                                className: 'castle-event-block__image',
                                                onClick: renderProps.open
                                            }),
                                            el( 'div', { className: 'castle-event-block__image-controls' },
                                                el( Button, {
                                                    onClick: renderProps.open,
                                                    isSecondary: true,
                                                    isSmall: true
                                                }, __( 'Replace', 'castle-event-block' )),
                                                el( Button, {
                                                    onClick: onRemoveImage,
                                                    isDestructive: true,
                                                    isSmall: true
                                                }, __( 'Remove', 'castle-event-block' ))
                                            )
                                        ) : el( Placeholder, {
                                            icon: 'format-image',
                                            label: __( 'Event Image', 'castle-event-block' ),
                                            instructions: __( 'Upload or select an image for this event.', 'castle-event-block' )
                                        },
                                            el( Button, {
                                                onClick: renderProps.open,
                                                isPrimary: true
                                            }, __( 'Select Image', 'castle-event-block' ))
                                        )
                                    );
                                }
                            })
                        )
                    ),
                    el( 'div', { className: 'castle-event-block__content-column' },
                        el( RichText, {
                            tagName: 'h3',
                            className: 'castle-event-block__title',
                            value: title,
                            onChange: function( value ) { setAttributes({ title: value }); },
                            placeholder: __( 'Event Title', 'castle-event-block' ),
                            allowedFormats: []
                        }),
                        el( 'div', { className: 'castle-event-block__blurb-wrapper' + ( isPastEvent ? ' is-past-event' : '' ) },
                            isPastEvent && el( 'span', { className: 'castle-event-block__past-notice' },
                                __( 'Hidden (past event)', 'castle-event-block' )
                            ),
                            el( RichText, {
                                tagName: 'div',
                                className: 'castle-event-block__blurb',
                                value: blurb,
                                onChange: function( value ) { setAttributes({ blurb: value }); },
                                placeholder: __( 'Event description...', 'castle-event-block' ),
                                allowedFormats: [ 'core/bold', 'core/italic', 'core/link' ]
                            })
                        ),
                        showButton && el( 'div', { className: 'castle-event-block__button-preview' },
                            el( 'span', { className: 'castle-event-block__button' },
                                buttonText || __( 'Learn More', 'castle-event-block' )
                            )
                        )
                    )
                )
            );
        },

        // Server-side rendering, so save returns null
        save: function() {
            return null;
        },
    });
})();

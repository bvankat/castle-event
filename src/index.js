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
        BlockControls,
        BlockAlignmentToolbar
    } = wp.blockEditor;
    const { 
        PanelBody, 
        TextControl, 
        Button,
        DatePicker,
        Placeholder,
        ToggleControl,
        SelectControl
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
            align: {
                type: 'string',
                default: '',
            },
            aspectRatio: {
                type: 'string',
                default: '4:3',
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
                align,
                aspectRatio
            } = attributes;

            const blockProps = useBlockProps({
                className: 'castle-event-block-editor' + ( align ? ' align' + align : '' )
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
            const aspectPadding = aspectRatios[ aspectRatio ] || 75;

            return el( Fragment, {},
                el( BlockControls, {},
                    el( BlockAlignmentToolbar, {
                        value: align,
                        onChange: function( value ) { setAttributes({ align: value }); },
                        controls: [ 'wide', 'full' ]
                    })
                ),
                el( InspectorControls, {},
                    el( PanelBody, { title: __( 'Event Settings', 'castle-event-block' ), initialOpen: true },
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

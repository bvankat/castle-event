# Castle Event Block

A custom WordPress Gutenberg block for highlighting special events at the castle. Perfect for rotating exhibits, art shows, music events, and other special occasions.

## Features

- **Two-column responsive layout** - Image on the left, content on the right (stacks on mobile)
- **Flexible aspect ratios** - Choose from Original, 1:1, 4:3, 3:4, 3:2, 2:3, 16:9, or 9:16
- **Native media uploader** - Select images from the WordPress media library
- **Rich text blurb** - Supports bold, italic, and links in the description
- **Optional button** - Toggle the call-to-action button on or off
- **End date functionality** - Automatically hides the event description after the end date passes
- **Alignment support** - Wide and full-width alignment options
- **Linked elements** - Image, title, and button all link to the specified URL
- **Minimal styling** - Designed to inherit your theme's styles with easy overrides

## Installation

### Option 1: Install Pre-built Plugin

1. Download or copy the entire `castle-event-block` folder
2. Upload to `/wp-content/plugins/`
3. Activate the plugin in WordPress admin under Plugins

### Option 2: Build from Source

1. Navigate to the plugin directory:
   ```bash
   cd wp-content/plugins/castle-event-block
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Build the assets:
   ```bash
   npm run build
   ```

4. Activate the plugin in WordPress admin

## Usage

1. Edit any page or post in the WordPress block editor
2. Add a new block and search for "Castle Event"
3. Fill in the fields:
   - **Image**: Click to select from your media library
   - **Title**: Enter the event name
   - **Blurb**: Add a description (supports bold, italic, and links)
4. Configure settings in the sidebar:
   - **Aspect Ratio**: Choose the image crop ratio
   - **Show Button**: Toggle the button on or off
   - **Link URL**: Set the destination for image, title, and button links
   - **Button Text**: Customize the call-to-action text
   - **End Date**: Set when the event ends (blurb hides after this date)

## Block Fields

| Field | Description | Location |
|-------|-------------|----------|
| Image | Event image with selectable aspect ratio | Main editor |
| Title | Event title/heading | Main editor |
| Blurb | Event description (supports bold, italic, links) | Main editor |
| Aspect Ratio | Image crop ratio (Original, 1:1, 4:3, 3:4, 3:2, 2:3, 16:9, 9:16) | Sidebar |
| Show Button | Toggle to show/hide the button | Sidebar |
| Link URL | Destination URL for links (only visible when button is enabled) | Sidebar |
| Button Text | Call-to-action button text (only visible when button is enabled) | Sidebar |
| End Date | Date after which blurb is hidden | Sidebar |

## Aspect Ratio Options

| Option | Ratio | Use Case |
|--------|-------|----------|
| Original | Native | Displays image without cropping |
| Square | 1:1 | Social media style |
| Standard | 4:3 | Default, traditional photo |
| Portrait | 3:4 | Vertical orientation |
| Classic | 3:2 | Classic 35mm photo |
| Classic Portrait | 2:3 | Vertical classic |
| Wide | 16:9 | Cinematic, video thumbnail |
| Tall | 9:16 | Mobile/story format |

## End Date Behavior

When you set an end date:
- **Before the date**: Block displays normally with all content visible
- **After the date**: The blurb/description is automatically hidden
- **In the editor**: Past events show a visual indicator that the blurb will be hidden

This is useful for archiving past events while still showing them on a page.

## Alignment

The block supports WordPress alignment options:
- **Default**: Contained within content width
- **Wide**: Extends beyond content width (theme must support)
- **Full**: Spans the full viewport width (theme must support)

Note: Wide and full alignment require theme support. Most modern themes include this, but if alignment doesn't work, ensure your theme has `add_theme_support('align-wide')` in its functions.php.

## Styling & Customization

The block uses minimal inline styles so it inherits your theme's typography, colors, and spacing.

### CSS Classes

```css
/* Main block wrapper */
.wp-block-castle-event-block { }

/* Alignment modifiers */
.wp-block-castle-event-block.alignwide { }
.wp-block-castle-event-block.alignfull { }

/* Past event modifier */
.wp-block-castle-event-block.is-past-event { }

/* Image column */
.castle-event-block__image-column { }
.castle-event-block__image-wrapper { }
.castle-event-block__image-wrapper--original { } /* When using original aspect ratio */
.castle-event-block__image { }
.castle-event-block__image-link { }

/* Content column */
.castle-event-block__content-column { }
.castle-event-block__title { }
.castle-event-block__title a { }
.castle-event-block__blurb { }
.castle-event-block__button { }
```

### Example Overrides

Add to your theme's CSS:

```css
/* Custom title styling */
.castle-event-block__title {
    font-family: 'Your Font', serif;
    font-size: 2rem;
    color: #333;
}

/* Custom button styling */
.castle-event-block__button {
    background-color: #your-brand-color;
    border-radius: 4px;
    text-transform: uppercase;
    letter-spacing: 1px;
}

/* Style archived/past events differently */
.wp-block-castle-event-block.is-past-event {
    opacity: 0.8;
}

.wp-block-castle-event-block.is-past-event .castle-event-block__image {
    filter: grayscale(50%);
}
```

## Development

For active development with hot reloading:

```bash
npm run start
```

To build for production:

```bash
npm run build
```

## File Structure

```
castle-event-block/
├── castle-event-block.php    # Main plugin file
├── package.json              # NPM dependencies
├── webpack.config.js         # Build configuration
├── README.md                 # This file
├── src/
│   ├── index.js              # Block registration & editor
│   ├── style.css             # Frontend styles
│   └── editor.css            # Editor-only styles
└── build/                    # Compiled assets (generated)
    ├── index.js
    ├── style.css
    └── editor.css
```

## Requirements

- WordPress 5.8+
- PHP 7.4+
- Node.js 16+ (for building from source)

## Changelog

### 1.0.0
- Initial release
- Two-column responsive layout
- Configurable aspect ratios (Original, 1:1, 4:3, 3:4, 3:2, 2:3, 16:9, 9:16)
- Rich text blurb with bold, italic, and link support
- Optional button with toggle control
- End date functionality to auto-hide blurb for past events
- Wide and full alignment support
- Native WordPress media uploader integration

## License

GPL-2.0-or-later
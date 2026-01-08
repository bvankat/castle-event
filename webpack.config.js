const defaultConfig = require( '@wordpress/scripts/config/webpack.config' );
const path = require( 'path' );

module.exports = {
    ...defaultConfig,
    entry: {
        index: path.resolve( process.cwd(), 'src', 'index.js' ),
        style: path.resolve( process.cwd(), 'src', 'style.css' ),
        editor: path.resolve( process.cwd(), 'src', 'editor.css' ),
    },
};

const withImages = require('next-images');
const path = require('path');
console.log(__dirname);
module.exports = withImages({
    exclude: path.resolve(__dirname, 'static/images2'),
    webpack(config, options) {
        return config
    }
})

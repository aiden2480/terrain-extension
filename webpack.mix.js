const mix = require("laravel-mix");
require("laravel-mix-clean");

mix.setPublicPath("dist")
    .clean({ cleanOnceBeforeBuildPatterns: ["./*"] })
    .disableNotifications()
    .sass("src/sass/popup.scss", "dist/css")
    .js("src/js/api.js", "dist/js")
    .js("src/js/background.js", "dist/js")
    .js("src/js/popup.js", "dist/js")
    .vue()
    .copy("src/images/", "dist/images")
    .copy("src/*", "dist")
    .options({
        processCssUrls: false,
        terser: { extractComments: false }
    });

"use strict";

var gulp = require("gulp");
var sass = require("gulp-sass");
var autoprefixer = require("gulp-autoprefixer");
var cleanCSS = require("gulp-clean-css");
var uglify = require("gulp-uglify");
var watch = require("gulp-watch");
var rigger = require("gulp-rigger");
var browserSync = require("browser-sync");
var reload = browserSync.reload;
var clean = require("gulp-clean");
var imagemin = require("gulp-imagemin");
var pngquant = require("imagemin-pngquant");

var config = {
    server: {
        baseDir: "./public/src"
    },
    tunnel: "testingsystem",
    host: "localhost",
    port: 8743,
    logPrefix: "testingsystem"
};

var path = {

    build: {
        html: "./public",
        styles: "./public/css",
        js: "./public/js",
        fonts: "./public/fonts",
        images: "./public/img"
    },

    src: {
        src: "./public/src",
        html: "./public/src/*.html",
        scss: "./public/src/scss/style.scss",
        css: "./public/src/css",
        buildCss: "./public/src/css/**/*.*",
        js: "./public/src/js/*.js",
        fonts: "./public/src/fonts/**/*.*",
        images: "./public/src/img/**/*.*"
    },

    watch: {
        html: "./public/src/*.html",
        styles: "./public/src/scss/**/*.scss",
        js: "./public/src/js/**/*.js",
        fonts: "./public/src/fonts/**/*.*",
        images: "./public/src/img/**/*.*"
    },

    clean: "./build"
};

gulp.task("connect", function () {
    browserSync(config);
});

// html build
gulp.task("html-build", function() {
    return gulp.src(path.src.html)
        .pipe(rigger())
        .pipe(gulp.dest(path.src.src))
        .pipe(reload({ stream: true }));
});

// styles
gulp.task("styles", function() {
    return gulp.src(path.src.scss)
        .pipe(sass().on("error", sass.logError))
        .pipe(autoprefixer())
        .pipe(gulp.dest(path.src.css))
        .pipe(reload({ stream: true }));
});

// html
gulp.task("html", function() {
    return gulp.src(path.src.html)
        .pipe(reload({ stream: true }));
});

// js
gulp.task("js", function(cb) {
    return gulp.src(path.src.js)
        .pipe(reload({ stream: true }));
});

// images
gulp.task("images", function () {
    gulp.src(path.src.images)
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()],
            interlaced: true
        }))
        .pipe(gulp.dest(path.build.images));
});

// fonts
gulp.task("fonts", function () {
    gulp.src(path.src.fonts)
        .pipe(gulp.dest(path.build.fonts))
});

// watch
gulp.task("watch", function() {
    watch([path.watch.html], function (event, cb) {
        gulp.start("html")
    });
    watch([path.watch.styles], function (event, cb) {
        gulp.start("styles");
    });
    watch([path.watch.js], function(event, cb) {
        gulp.start("js");
    });
});

// clean
gulp.task("clean", function() {
    return gulp.src(path.clean, {read: false})
        .pipe(clean());
});

// build
gulp.task("build", function() {
    return gulp.src(path.src.html)
        .pipe(gulp.dest(path.build.html));
});

gulp.task("build-css", function () {
    return gulp.src(path.src.buildCss)
        .pipe(cleanCSS())
        .pipe(gulp.dest(path.build.styles));
});

gulp.task("build-js", function () {
    return gulp.src(path.src.js)
        // .pipe(uglify())
        .pipe(gulp.dest(path.build.js));
});

gulp.task("full-build", ["clean", "build", "build-css", "build-js", "images", "fonts"]);

gulp.task("default", ["connect", "watch"]);
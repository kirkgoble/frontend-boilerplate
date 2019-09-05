//Importing dependencies
var gulp = require ('gulp'),
    autoprefixer = require('autoprefixer'),
    browserSync = require('browser-sync').create(),
    sass = require('gulp-sass'),
    cleanCSS = require('gulp-clean-css'),
    sourcemaps = require('gulp-sourcemaps'),
    concat = require('gulp-concat'),
    imagemin = require('gulp-imagemin'),
    changed = require('gulp-changed'),
    uglify = require('gulp-uglify'),
    lineec = require('gulp-line-ending-corrector');

// BrowserSync
function serve(done) {
    browserSync.init({
        server: {
            baseDir: "./"
        },
        port: 3000
    });
    done();
}

// BrowserSync Reload
function reload(done) {
    browserSync.reload();
    done();
}

//Declaring Paths
var paths = {
    styles:{
        src:'app/scss/**/*.scss',
        dest: 'dist'
    },
    custom_js:{
        src:'app/js/**/*.js',
        dest:'dist'
    }
}

//Compiling & Moving Custom SASS
function custom_sass() {
    return gulp
        .src(paths.styles.src)
        .pipe(sourcemaps.init())
        .pipe(sass())
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false}))
        .pipe(cleanCSS())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(paths.styles.dest));
}

//Custom Scripts
function custom_js(){
    return gulp
        .src(paths.custom_js.src)
        .pipe(sourcemaps.init())
        .pipe(uglify())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(paths.custom_js.dest));
}

//Watching File
function watch() {
    gulp.watch(paths.styles.src, gulp.series(custom_sass,reload));
    gulp.watch(paths.custom_js.src, gulp.series(custom_js,reload));
    gulp.watch('*.html', reload);
}

//Compiling & Moving stylesheets & Scripts
var files = gulp.parallel(custom_sass, custom_js);

//Building task
var build = gulp.series( files, gulp.parallel(serve, watch));
gulp.task(build);
gulp.task('default', build);
// Initialize modules
// Importing specific gulp API functions lets us write them below as series() instead of gulp.series()
// const { src, dest, watch, series, parallel } = require('gulp');
const gulp = require("gulp");
// Importing all the Gulp-related packages we want to use
const sourcemaps = require('gulp-sourcemaps');
const sass = require('gulp-sass');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
var replace = require('gulp-replace');
var browserSync = require('browser-sync').create();


// File paths
const files = {
    scssPath: 'app/scss/**/*.scss',
    jsPath: 'app/js/**/*.js'
}

// BrowserSync
function browserSync(done) {
    browsersync.init({
        server: {
            baseDir: "./"
        },
        port: 3000
    });
    //console.log('browserSync');
    done();
}

// BrowserSync Reload
function browserSyncReload(done) {
    browsersync.reload();
    done();
}

// Sass task: compiles the style.scss file into style.css
function scssTask(){
    return gulp
        .src(files.scssPath)
        .pipe(sourcemaps.init()) // initialize sourcemaps first
        .pipe(sass()) // compile SCSS to CSS
        .pipe(postcss([ autoprefixer(), cssnano() ])) // PostCSS plugins
        .pipe(sourcemaps.write('.')) // write sourcemaps file in current directory
        .pipe(gulp.dest('dist'))
        //.pipe(browsersync.stream())
    // put final CSS in dist folder
}

// JS task: concatenates and uglifies JS files to script.js
// function jsTask(){
//     return src([
//         files.jsPath
//         //,'!' + 'includes/js/jquery.min.js', // to exclude any specific files
//         ])
//         .pipe(concat('all.js'))
//         .pipe(uglify())
//         .pipe(dest('dist')
//     );
// }

// Cachebust
// var cbString = new Date().getTime();
// function cacheBustTask(){
//     return gulp
//         .src(['index.html'])
//         .pipe(replace(/cb=\d+/g, 'cb=' + cbString))
//         .pipe(dest('.'));
// }

// Watch task: watch SCSS and JS files for changes
// If any change, run scss and js tasks simultaneously
function watchFiles(){
    gulp.watch([files.scssPath, files.jsPath], gulp.parallel(scssTask));
}

const build = gulp.series(gulp.parallel(scssTask), browserSync);
//const watch = gulp.parallel(watchFiles, cacheBustTask, browserSync);

// Export the default Gulp task so it can be run
// Runs the scss and js tasks simultaneously
// then runs cacheBust, then watch task
// exports.default = series(
//     parallel(scssTask, jsTask),
//     cacheBustTask,
//     watchTask
//
//);
//exports.default = build;
gulp.task('default', build);
//exports.watch = watch;
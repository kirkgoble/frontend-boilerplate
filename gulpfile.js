// Initialize modules
// Importing specific gulp API functions lets us write them below as series() instead of gulp.series()
const { src, dest, watch, series, parallel } = require('gulp');
// Importing all the Gulp-related packages we want to use
const sourcemaps = require('gulp-sourcemaps');
const sass = require('gulp-sass');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');

var browserSync = require('browser-sync').create();
var replace = require('gulp-replace');
var babel = require('gulp-babel');
var browserify = require('gulp-browserify');


// File paths
const files = {
    scssPath: 'app/scss/**/*.scss',
    jsPath: 'app/js/**/*.js',
    //jsPath: 'app/js/**/app.js',
    indexPath: 'app/index.html'
}

// BrowserSync
function serve(done) {
    browserSync.init({
        server: {
            baseDir: "./dist",
            startPath: "index.html",
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

// Sass task: compiles the style.scss file into style.css
function scssTask(){
    return src(files.scssPath)
        .pipe(sourcemaps.init()) // initialize sourcemaps first
        .pipe(sass()) // compile SCSS to CSS
        .pipe(postcss([ autoprefixer(), cssnano() ])) // PostCSS plugins
        .pipe(sourcemaps.write('.')) // write sourcemaps file in current directory
        .pipe(dest('dist/assets/css')
        ); // put final CSS in dist folder
}

// JS task: concatenates and uglifies JS files to app.js
function jsTask(){
    return src([
        //files.jsPath
        'app/js/**/app.js'
        //,'!' + 'includes/js/jquery.min.js', // to exclude any specific files
    ])
        //.pipe(browserify())
        .pipe(babel({presets: ['@babel/preset-env']}))
        .pipe(concat('bundle.min.js'))
        .pipe(uglify())
        .pipe(dest('dist/assets/js')
        );
}

// HTML task:
function htmlTask(){
    return src("app/*.html")
        //.pipe(uglify())
        .pipe(dest('dist')
        );
}


// Cachebust
function cacheBustTask(){
    var cbString = new Date().getTime();
    console.log('cacheBustTask : '+ cbString);
    return src(['app/index.html'])
        .pipe(replace(/cb=\d+/g, 'cb=' + cbString))
        .pipe(dest('dist')
        );
}

// Watch task: watch SCSS and JS files for changes
// If any change, run scss and js tasks simultaneously
function watchTask(){
    // watch([files.scssPath, files.jsPath],
    //     parallel(scssTask, jsTask));
    watch(files.scssPath, parallel(scssTask, reload));
    watch(files.jsPath, parallel(jsTask, reload));
    watch('app/*.html', parallel(cacheBustTask, reload));
}

// Export the default Gulp task so it can be run
// Runs the scss and js tasks simultaneously
// then runs cacheBust, then watch task
exports.default = series(
    parallel(scssTask, jsTask),
    cacheBustTask,
    //htmlTask,
    serve,
    watchTask
);
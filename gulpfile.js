var gulp         = require('gulp'),
    babel        = require('gulp-babel'),
    autoprefixer = require('gulp-autoprefixer'),
    concat       = require('gulp-concat'),
    header       = require('gulp-header'),
    plumber      = require('gulp-plumber'),
    rename       = require('gulp-rename'),
    sass         = require('gulp-sass'),
    uglify       = require('gulp-uglify'),
    server       = require('gulp-webserver'),
    browserSync  = require('browser-sync'),
    reload       = browserSync.reload;
var pkg = require('./package.json');

var banner = ['/**',
    ' * gulpjs v<%= pkg.version %> - <%= pkg.description %>',
    ' * @copyright 2015-<%= new Date().getFullYear() %> <%= pkg.author %>',
    ' * @license <%= pkg.license %>',
    ' */',
    ''].join('\n');

var helpers = ['src/script.js'],
    helperSass =['assets/sass/style.scss'];
// sass
gulp.task('sass', function(){
    return gulp.src(helperSass)
        .pipe(plumber())
        .pipe(sass({outputStyle: 'expanded'}))
        .pipe(autoprefixer())
        .pipe(concat(pkg.name+'.css'))
        .pipe(gulp.dest('assets/css'))
});

// js
gulp.task('js', function(){
    return gulp.src(helpers)
        .pipe(babel({
            presets: [
                ['@babel/env', {
                    modules: false,
                }]
            ]
        }))
        .pipe(plumber())
        .pipe(concat(pkg.name+'.js'))
        .pipe(header(banner, { pkg : pkg } ))
        .pipe(gulp.dest('assets/js'))
        .pipe(uglify())
        .pipe(rename({suffix: '.min'}))
        .pipe(header(banner, { pkg : pkg } ))
        .pipe(gulp.dest('assets/js'))
});


// serve
gulp.task('serve', function () {
    browserSync.init({
        server: {
            baseDir: "."
        },
        notify: false
    });
    return gulp.src("./html/")
    .pipe(server({
        livereload: true,
        directoryListing: true,
        open: true,
        fallback: 'index.html'
    }))
});

// Watch
gulp.task('watch', function(){
    gulp.watch('src/*.js', gulp.series('js'));
    gulp.watch('assets/sass/*.scss', gulp.series('sass'));
    // gulp.watch('sass/**/*.scss', ['sass']);
    gulp.watch("html/*.html", gulp.series('serve'));
});

// // gulp.task('build', ['sass', 'js']);
gulp.task('default', gulp.series('watch') );
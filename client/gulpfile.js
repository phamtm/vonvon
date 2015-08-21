var gulp = require('gulp');
var concat = require('gulp-concat');
var minifyCss = require('gulp-minify-css');
var browserify = require('browserify');
var reactify = require('reactify');
var source = require('vinyl-source-stream');
var rename = require('gulp-rename');
var streamify = require('gulp-streamify');
var uglify = require('gulp-uglify');
var del = require('del');


// // Clean
// gulp.task('clean', function(cb) {
// 	del(['./src/js/bundle.js'], cb);
// });

// // Copy HTML
// gulp.task('html', function() {
// 	gulp.src('./src/*.html')
// 			.pipe(gulp.dest('./dist/'));
// });

// // Concatenate and minify CSS
// gulp.task('css', function() {
// 	gulp.src('./src/css/**/*.css')
// 			.pipe(concat('style.css'))
// 			.pipe(minifyCss())
// 			.pipe(gulp.dest('./dist/css/'));
// });

// // Copy images
// gulp.task('copy-static', function() {
// 	gulp.src('./src/img/**/*')
// 			.pipe(gulp.dest('./dist/img'));
// });

// // Browserify and compress JS
// gulp.task('js', function() {
//   var bundleStream = browserify('./src/js/app.js').bundle()

//   bundleStream
//     .pipe(source('app.js'))
//     .pipe(streamify(uglify()))
//     .pipe(rename('bundle.js'))
//     .pipe(gulp.dest('./dist/js/'));
// });

// gulp.task('dist', ['clean', 'copy-static', 'html', 'css', 'js']);

// // Default task
// gulp.task('default', ['dist']);

var browserify = require('browserify');
var gulp = require('gulp');
var source = require('vinyl-source-stream');
var reactify = require('reactify');

gulp.task('browserify', function () {
    return browserify('./src/js/app.jsx', {
        debug: true,
        transform: [reactify]
    })
    .bundle()
    .pipe(source('bundle.js'))
    .pipe(gulp.dest('./dist/js'));
});

gulp.task('html', function () {
    return gulp.src('./src/**/*.html')
        .pipe(gulp.dest('./dist'));
});

gulp.task('build', function () {
    gulp.start(['browserify', 'html']);
});

gulp.task('watch', ['build'], function () {
    gulp.watch(['./src/**/*.js', './src/**/*.jsx'], ['browserify']);
    gulp.watch(['./src/**/*.html'], ['html']);
});

gulp.task('default', ['watch']);

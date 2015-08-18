var gulp = require('gulp');
var concat = require('gulp-concat');
var minifyCss = require('gulp-minify-css');
var browserify = require('browserify');
var reactify = require('reactify');
var source = require('vinyl-source-stream');
var rename = require('gulp-rename');
var streamify = require('gulp-streamify');
var uglify = require('gulp-uglify');


// Copy HTML
gulp.task('html', function() {
	gulp.src('./src/*.html')
			.pipe(gulp.dest('./dist/'));
});

// Concatenate and minify CSS
gulp.task('css', function() {
	gulp.src('./src/css/**/*.css')
			.pipe(concat('style.min.css'))
			.pipe(minifyCss())
			.pipe(gulp.dest('./dist/css/'));
});

// Copy images
gulp.task('copy-static', function() {
	gulp.src('./src/img/**/*')
			.pipe(gulp.dest('./dist/img'));
});

// Browserify and compress JS
gulp.task('js', function() {
  var bundleStream = browserify('./src/js/app.js').bundle()

  bundleStream
    .pipe(source('app.js'))
    .pipe(streamify(uglify()))
    .pipe(rename('bundle.js'))
    .pipe(gulp.dest('./dist/js/'));
});

gulp.task('dist', ['copy-static', 'html', 'css', 'js']);

// Default task
gulp.task('default', ['dist']);

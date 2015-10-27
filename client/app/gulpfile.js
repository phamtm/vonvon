const browserify = require('browserify');
const concat = require('gulp-concat');
const del = require('del');
const gulp = require('gulp');
const minifyCss = require('gulp-minify-css');
const reactify = require('reactify');
const rename = require('gulp-rename');
const source = require('vinyl-source-stream');
const streamify = require('gulp-streamify');
const uglify = require('gulp-uglify');


// Concatenate and minify CSS
gulp.task('css', function() {
	gulp.src('./src/css/**/*.css')
 .pipe(concat('style.css'))
 .pipe(minifyCss())
 .pipe(gulp.dest('./dist/css/'));
});

// Browserify
gulp.task('js', function () {
  const bundleStream = browserify('./js/app.jsx', {
        debug: true,
        transform: [reactify]
      }).bundle();

  return bundleStream
    .pipe(source('bundle.js'))
    .pipe(gulp.dest('./dist/js'));
});

// Copy HTML
gulp.task('html', function () {
  return gulp.src('./static/**/*.html')
  .pipe(gulp.dest('./dist'));
});

gulp.task('build', function () {
  gulp.start(['js', 'html']);
});

gulp.task('dist', function() {
  // TODO: build, compress js and copy html
});

gulp.task('watch', ['build'], function () {
  gulp.watch(['./**/*.js', './**/*.jsx'], ['js']);
  gulp.watch(['./static/**/*.html'], ['html']);
  gulp.watch(['./**/*.css'], ['css']);
});

gulp.task('default', ['watch']);

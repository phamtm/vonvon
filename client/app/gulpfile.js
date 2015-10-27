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
const less = require('gulp-less');


// Concatenate and minify CSS
gulp.task('css', function() {
  // return gulp.src('./less/**/style.less')
  //             .pipe(less({
  //              paths: [ path.join(__dirname, 'less') ]
  //             }))
  //             .pipe(gulp.dest('./css'));
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
  gulp.watch(['./js/**/*.js', './js/**/*.jsx'], ['js']);
  gulp.watch(['./static/**/*.html'], ['html']);
  gulp.watch(['../ui2/less/**/*.less', '../ui2/less/**/*.css'], ['css']);
});

gulp.task('default', ['watch']);

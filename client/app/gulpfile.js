const browserify = require('browserify');
const concat = require('gulp-concat');
const del = require('del');
const gulp = require('gulp');
const minifyCss = require('gulp-minify-css');
const reactify = require('reactify');
const rename = require('gulp-rename');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');
const streamify = require('gulp-streamify');
const uglify = require('gulp-uglify');
const less = require('gulp-less');


// Concatenate and minify CSS
gulp.task('less', function() {
  return gulp.src('../ui2/less/style.less')
             .pipe(less( { paths: [ '../ui2/less' ] }))
             .pipe(minifyCss())
             .pipe(gulp.dest('./dist/css'))
             .pipe(gulp.dest('../ui2/css'));
});

// Browserify
gulp.task('js', function () {
  const bundleStream = browserify('./js/app.jsx', {
        debug: true,
        transform: [reactify]
      }).bundle();

  return bundleStream.pipe(source('bundle.js'))
                     .pipe(gulp.dest('./dist/js'));
});

gulp.task('js-compress', function () {
  const bundleStream = browserify('./js/app.jsx', {
        debug: true,
        transform: [reactify]
      }).bundle();

  return bundleStream.pipe(source('bundle.js'))
                     .pipe(buffer())
                     .pipe(uglify())
                     .pipe(gulp.dest('./dist/js'));
});

// Copy HTML
gulp.task('html', function () {
  return gulp.src('./static/**/*.html')
             .pipe(gulp.dest('./dist'));
});

gulp.task('images', function() {
  return gulp.src('../ui2/img/**/*')
             .pipe(gulp.dest('./dist/img/'));
});

gulp.task('static', ['html', 'images']);


/* Build for release */
gulp.task('dist', ['js-compress', 'less', 'static']);

/* Build for dev task */
gulp.task('build', function () {
  gulp.start(['js', 'static', 'less']);
});

/* Continuous build task */
gulp.task('watch', ['build'], function () {
  gulp.watch(['./js/**/*.js', './js/**/*.jsx'], ['js']);
  gulp.watch(['./static/**/*.html'], ['html']);
  gulp.watch(['../ui2/less/**/*'], ['less']);
});

/* Default to continuous build */
gulp.task('default', ['watch']);

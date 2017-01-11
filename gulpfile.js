var gulp = require('gulp');
var sourcemaps = require('gulp-sourcemaps');
var babelify = require('babelify');
var browserify = require('browserify');
var eslint = require('gulp-eslint');
var rename = require('gulp-rename');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var uglify = require('gulp-uglify');
var watch = require('gulp-watch');
var livereload = require('gulp-livereload');
var sass = require('gulp-sass');
var path = require('path');

gulp.task('lint', function () {
  return gulp.src(['./src/js/**/*.js'])
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failOnError());
});

gulp.task('browserify', function () {
  return browserify({
    entries: './src/js/app.js',
    extensions: ['.js'],
  })
    .transform(babelify, { presets: ['es2015'], })
    .bundle()
    .on('error', function (err) {
      console.error(err);
      this.emit('end');
    })
    .pipe(source('bundle.js'))
    .pipe(buffer())
    .pipe(sourcemaps.init({ loadMaps: true }))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('./dist'));
});

gulp.task('js', ['lint', 'browserify'], function () {
  // return gulp.src(['./dist/bundle.js'])
  //   .pipe(uglify())
  //   .pipe(rename({ suffix: '.min' }))
  //   .pipe(gulp.dest('./dist'));
});

gulp.task('sass', function () {
  return gulp.src('./src/sass/main.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(rename('bundle.css'))
    .pipe(gulp.dest('./dist'))
    .pipe(livereload());
});

gulp.task('build', ['js', 'sass']);

gulp.task('watch', function () {
  gulp.start('build');
  livereload.listen();
  gulp.watch('./src/js/**/*.js', ['js']);
  gulp.watch('./src/sass/**/*.scss', ['sass']);
});

"use strict";

var fs = require('fs-extra');
var path = require('path');
var gulp = require('gulp');
var gutil = require('gulp-util');
var jade = require('gulp-jade');
var stylus = require('gulp-stylus');
var sourcemaps = require('gulp-sourcemaps');
var autoprefixer = require('gulp-autoprefixer');
var plumber = require('gulp-plumber');
var rev = require('gulp-rev');
var clean = require('gulp-clean');
var gulpSequence = require('gulp-sequence');
var ghPages = require('gulp-gh-pages');
var revReplace = require("gulp-rev-replace");

gulp.task('clean', function () {
	return gulp.src('./dist', {read: false})
		.pipe(clean());
});

gulp.task('post-include-mixins', function(done) {
  fs.readdir('./templates/posts', function(err, files) {
    if (err !== null) {
      throw(err);
    }

    var mixins = files.map(function(file) {
      return "mixin " + path.basename(file, '.md') + "\n" + "  include:markdown-it ../posts/" + file;
    });

    fs.outputFile('templates/tmp/post_include_mixins.jade', mixins.join('\n\n'), function(err) {
      if (err !== null) {
        throw(err);
      }

      done();
    });
  });
});

gulp.task('templates', ['post-include-mixins'], function() {
  var manifest = gulp.src('./dist/assets/rev-manifest.json');


  return gulp.src('./templates/*.jade')
    .pipe(plumber())
    .pipe(jade({pretty: true}))
    .pipe(revReplace({manifest: manifest}))
    .pipe(gulp.dest('./dist/'));
});

gulp.task('images', function() {
  return gulp.src(['./assets/images/**/*'])
    .pipe(gulp.dest('./dist/assets/images'));
});

gulp.task('scripts', function() {
  return gulp.src(['./lib/**/*.js'])
    .pipe(gulp.dest('./dist/assets/javascripts'));
});



gulp.task('asset-revisioning', ['scripts', 'styles'], function () {
    // by default, gulp would pick `assets/css` as the base,
    // so we need to set it explicitly:
    return gulp.src(['./dist/assets/javascripts/*.js', './dist/assets/styles/*.css'], {base: 'dist/assets'})
        .pipe(rev())
        .pipe(gulp.dest('dist/assets'))  // write rev'd assets to build dir
        .pipe(rev.manifest())
        .pipe(gulp.dest('dist/assets')); // write manifest to build dir
});

gulp.task('styles', function () {
  return gulp.src('./lib/**/[^_]*.styl')
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(stylus())
    .pipe(autoprefixer({
      browsers: ['last 2 versions'],
      cascade: false
    }))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('./dist/assets/styles'));
});


gulp.task('build', gulpSequence('clean', 'asset-revisioning', 'templates', 'images'))

gulp.task('default', ['build']);

gulp.task('watch', ['build'], function() {
  gulp.watch(['./templates/**'], ['templates']);
  gulp.watch(['./assets/**'], ['images']);
  gulp.watch(['./lib/**'], ['styles', 'scripts']);
});

gulp.task('deploy', ['build'], function() {
  return gulp.src('./dist/**/*')
    .pipe(ghPages());
});

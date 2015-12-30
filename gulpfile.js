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
  gulp.src('./templates/*.jade')
    .pipe(plumber())
    .pipe(jade({pretty: true}))
    .pipe(gulp.dest('./dist/'));
});

gulp.task('images', function() {
  gulp.src(['./assets/images/**/*'])
    .pipe(gulp.dest('./dist/assets/images'));
});

gulp.task('scripts', function() {
  gulp.src(['./lib/**/*.js'])
    .pipe(gulp.dest('./dist/assets/javascripts'));
});

gulp.task('styles', function () {
  gulp.src('./lib/**/[^_]*.styl')
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

gulp.task('default', ['templates', 'assets', 'styles', 'scripts']);

gulp.task('watch', ['templates', 'images', 'styles', 'scripts'], function() {
  gulp.watch(['./templates/**'], ['templates']);
  gulp.watch(['./assets/**'], ['images']);
  gulp.watch(['./lib/**'], ['styles', 'scripts']);
});

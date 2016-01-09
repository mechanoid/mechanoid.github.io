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
var replace = require('gulp-replace');
var concat = require("gulp-concat");
var postIncludeBuilder = require('./tasks/post-include-builder.js')
var postViewBuilder = require('./tasks/post-view-builder.js')


var config = {
	env: "development",
	dist: "dist",
	remoteDist: "/blog/"
};

var templatePathsWithExcludes = ['./templates/**/*.jade'
	, '!./templates/tmp/**/*.jade'
	, '!./templates/layouts/**/*.jade'
	, '!./templates/helper/**/*.jade'];

var buildPaths = templatePathsWithExcludes.slice();
buildPaths.push('./lib/**');

var distFolder = config.dist;
var distPath = './' + distFolder;
var assetFolder = distFolder + '/assets';
var assetPath = distPath + '/assets';


gulp.task('clean', function () {
	return gulp.src(distPath, {read: false})
		.pipe(clean());
});

gulp.task('post-include-mixins', function(done) {
	return gulp.src('./posts/**/*.md')
	.pipe(postIncludeBuilder())
	.pipe(concat('post_include_mixins.jade'))
	.pipe(gulp.dest('templates/tmp/'));
});

gulp.task('article-pages', function(done) {
	return gulp.src('./posts/**/*.md')
	.pipe(postViewBuilder())
	.pipe(gulp.dest('templates/posts/'));
});

gulp.task('prepare-post-templates', function(cb) {
	gulpSequence('post-include-mixins', 'article-pages')(cb);
});

gulp.task('templates', ['prepare-post-templates'], function() {
  var manifest = gulp.src(assetPath + '/rev-manifest.json');

  var t =  gulp.src(templatePathsWithExcludes)
    .pipe(plumber())
    .pipe(jade({pretty: true}))
    .pipe(revReplace({manifest: manifest}))

	if (config.env === 'production') {
		t = t.pipe(replace(/(=["'])(\/)([^\/])/g, "$1" + config.remoteDist + "$3"));
	}

	return t
		.pipe(gulp.dest(distPath));
});

gulp.task('images', function() {
  return gulp.src(['./assets/images/**/*'])
    .pipe(gulp.dest(assetPath + '/images'));
});

gulp.task('vendor-resources', function() {
  return gulp.src([
		'./node_modules/jquery/dist/jquery.js',
		'./node_modules/hammerjs/hammer.js'
	])
    .pipe(gulp.dest(assetPath + '/vendor'));
});

gulp.task('scripts', function() {
  return gulp.src(['./lib/**/*.js'])
    .pipe(gulp.dest(assetPath + '/javascripts'));
});

gulp.task('asset-revisioning', ['styles', 'scripts'], function () {
  return gulp.src([assetPath + '/javascripts/*.js', assetPath + '/styles/*.css'], {base: assetFolder})
    .pipe(rev())
    .pipe(gulp.dest(assetPath))  // write rev'd assets to build dir
    .pipe(rev.manifest())
    .pipe(gulp.dest(assetPath)); // write manifest to build dir
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
    .pipe(gulp.dest(assetPath + '/styles'));
});

gulp.task('enable-prod-env', function(cb) {
	config.envbak = config.env;
	config.env = 'production';
	cb();
});

gulp.task('disable-prod-env', function(cb) {
	config.env = config.envbak;
	cb();
});

gulp.task('build', function(cb) {
	gulpSequence('clean', 'asset-revisioning', 'templates', 'images', 'vendor-resources')(cb);
})

gulp.task('build-release', function(cb) {
	gulpSequence('clean', 'asset-revisioning', 'enable-prod-env', 'templates', 'disable-prod-env', 'images', 'vendor-resources')(cb);
})

gulp.task('default', ['build']);

gulp.task('watch', ['build'], function() {
  gulp.watch(buildPaths, ['build']);
});

gulp.task('deploy', ['build-release'], function() {
  return gulp.src(distPath + '/**/*')
    .pipe(ghPages());
});

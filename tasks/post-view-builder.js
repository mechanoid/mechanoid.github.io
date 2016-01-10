var path = require('path');
var gutil = require('gulp-util');
var through2 = require('through2');

module.exports = function(opts) {
  'use strict';

  opts = opts || {};

  return through2.obj(function(file, enc, callback) {

    if (file.isNull()) {
      return callback(null, file);
    }

    if (file.isStream()) {
      this.emit('error', new gutil.PluginError(PLUGIN_NAME, 'Streaming not supported'));
      return callback();
    }

    var template = "extends ../../templates/layouts/post.jade\n"
      + "block content\n"
      + '  - post = ' + JSON.stringify(file.frontMatter) + '\n'
      + '  +post(post, "'+path.basename(file.path, '.md')+'", true)\n';

    file.contents = new Buffer(template);
    file.basename = path.basename(file.path, '.md') + ".jade";
    file.path = path.dirname(file.path) + '/' + file.basename;
    file.extname = '.jade';
    this.push(file);
    callback();
  });
};

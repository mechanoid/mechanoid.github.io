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

    var template = "extends ../layouts/post.jade\n" +
      "block content\n" +
      // TODO: front matter for the title
      '  +post("The realms of distributed frontend integration", "'+path.basename(file.path, '.md')+'")\n';

    file.contents = new Buffer(template);
    file.basename = path.basename(file.path, '.md') + ".jade";
    file.path = path.dirname(file.path) + '/' + file.basename;
    file.extname = '.jade';
    this.push(file);
    callback();
  });
};

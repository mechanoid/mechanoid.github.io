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

    file.contents = new Buffer("mixin " + path.basename(file.path, '.md') + "\n" + "  include:markdown-it " + path.relative('./templates/tmp', file.path));
    this.push(file);
    callback();
  });
};

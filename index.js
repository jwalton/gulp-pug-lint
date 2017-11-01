'use strict';

var gutil = require('gulp-util');
var through = require('through2');
var PugLint = require('pug-lint');
var RcLoader = require('rcloader');
var configParser = require('./config_parser');

module.exports = function(options) {
  var rc = new RcLoader('.pug-lintrc', options);

  return through.obj(function(file, enc, cb) {
    var linter, errors;
    if (file.isNull()) {
      cb(null, file);
      return;
    }

    if (file.isStream()) {
      cb(new gutil.PluginError('gulp-pug-lint', 'streaming not supported'));
      return;
    }

    rc.for(file.path, function(errRc, conf) {
      if (errRc) {
        cb(new gutil.PluginError('gulp-pug-lint', errRc));
        return;
      }

      try {
        linter = new PugLint();
        linter.configure(configParser(conf));

        errors = linter.checkFile(file.path);

        if (errors.length) {
          gutil.log(gutil.colors.cyan(errors.length) + ' issues found in ' + gutil.colors.magenta(file.path));
          errors.forEach(function(error) {
            gutil.log(error.message);
          });
        }
      } catch (errLint) {
        cb(new gutil.PluginError('gulp-pug-lint', errLint));
        return;
      }

      cb(null, file);
    });

  });

};

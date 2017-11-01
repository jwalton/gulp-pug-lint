'use strict';

var gutil = require('gulp-util');
var through = require('through2');
var PugLint = require('pug-lint');
var RcLoader = require('rcloader');
var configParser = require('./config_parser');

module.exports = function(options) {
    var rc = new RcLoader('.pug-lintrc', options);
    var totalErrors = 0;
    var failOnError;

    options = options || {};
    failOnError = "failOnError" in options ? options.failOnError : true;

    function checkFile(file, cb) {
        var linter, errors;

        rc.for(file.path, function(errRc, conf) {
            if (errRc) {
                cb(new gutil.PluginError('gulp-pug-lint', errRc));
                return;
            }

            try {
                linter = new PugLint();
                linter.configure(configParser(conf));

                errors = linter.checkString(file.contents.toString('utf-8'), file.path);

                if (errors.length) {
                    gutil.log(gutil.colors.cyan(errors.length) + ' issues found in ' + gutil.colors.magenta(file.path));
                    errors.forEach(function(error) {
                        gutil.log(error.message);
                    });
                    totalErrors += errors.length;
                }
                cb();

            } catch (errLint) {
                cb(new gutil.PluginError('gulp-pug-lint', errLint));
                return;
            }
        });
    }

    return through.obj(
        function(file, enc, cb) {
            var _this = this;

            if(file.isStream()) {
                cb(new gutil.PluginError('gulp-pug-lint', 'streaming not supported'));
            } else if(file.isBuffer()) {
                checkFile(file, function(err) {
                    _this.push(file);
                    cb(err);
                });
            } else {
                this.push(file);
                cb();
            }
        },
        function(cb) {
            if(totalErrors > 0 && failOnError) {
                cb(new gutil.PluginError('gulp-pug-lint', 'Failed with ' + totalErrors + ' errors'));
            } else {
                cb();
            }
        }
    );
};

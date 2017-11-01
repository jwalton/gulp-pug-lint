# Gulp plugin for pug-lint

[![npm version](https://badge.fury.io/js/gulp-pug-lint2.svg)](http://badge.fury.io/js/gulp-pug-lint2)
[![Dependency Status](https://david-dm.org/jwalton/gulp-pug-lint2.svg)](https://david-dm.org/jwalton/gulp-pug-lint2)
[![devDependency Status](https://david-dm.org/jwalton/gulp-pug-lint2/dev-status.svg)](https://david-dm.org/jwalton/gulp-pug-lint2#info=devDependencies)

## Install

```
npm install --save pug-lint gulp-pug-lint2
```

## Usage

```javascript
var gulp = require('gulp'),
  puglint = require('gulp-pug-lint2');

gulp.task('default', function () {
  return gulp
    .src('views/*.pug')
    .pipe(puglint({failOnError: true));
});
```

## Configuration

Plugin will read [.pug-lintrc file](https://github.com/pugjs/pug-lint#configuration-file).

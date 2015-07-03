'use strict';

var gulp = require('gulp');
var cp = require('child_process');

gulp.task('server', function (cb) {
  cp.execFile('node', [
    '--harmony',
    'index.js',
    '-db:hosts=webcc-db.fit.fraunhofer.de',
    '-db:ks=imergo_tests'
  ], null, function(error) {
    console.error(error);
  });
})

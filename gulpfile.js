'use strict';

var gulp = require('gulp');
var wrench = require('wrench');

/**
 *  Recursively load all gulp tasks defined in the gulp directory.
 */
wrench.readdirSyncRecursive('./gulp').filter(function(file) {
  return (/\.(js|coffee)$/i).test(file);
}).map(function(file) {
  require('./gulp/' + file);
});


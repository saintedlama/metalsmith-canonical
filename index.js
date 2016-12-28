const path = require('path');
const _ = require('lodash');
const multimatch  = require('multimatch');

module.exports = function canonical(options) {
  options = options || {};
  options.omitIndex = !!options.omitIndex;
  options.omitTrailingSlashes = _.isUndefined(options.omitTrailingSlashes) ? true : options.omitTrailingSlashes;
  options.pattern = options.pattern || '**/*.html';

  return function(files, metalsmith, done) {
    if (!options.hostname) { return done(new Error('metalsmith-canonical requires hostname option to be set')); }

    const matchedFiles = multimatch(Object.keys(files), options.pattern);
    matchedFiles.forEach(function(file) {
      if (files[file].canonical) {
        return;
      }

      files[file].canonical = buildUrl(file);
    });

    // Builds a url
    function buildUrl(file) {
      let url = file;

      if (options.omitIndex) {
        url = _.trimEnd(url, 'index.html')
      }

      url = joinUrl(options.hostname, replaceBackslash(url));

      if (options.omitTrailingSlashes) {
        url = omitTrailingSlashes(url);
      }

      return url;
    }

    function replaceBackslash(url) {
      if (path.sep != '/') {
        return _.replace(url, path.sep, '/');
      }

      return url;
    }

    function joinUrl(left, right) {
      if (_.endsWith(left, '/') && _.startsWith(right, '/')) {
        return left.substring(0, left.length - 2) + right;
      }

      if (!_.endsWith(left, '/') && !_.startsWith(right, '/')) {
        return left + '/' + right;
      }

      return left + right;
    }

    function omitTrailingSlashes(url) {
      return _.trimEnd(url, '/');
    }

    done();
  }
};

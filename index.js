const _ = require('lodash');
const joinUrl = require('url-join');
const multimatch  = require('multimatch');

module.exports = function canonical(options) {
  options = options || {};
  options.omitIndex = !!options.omitIndex;
  options.omitTrailingSlashes = _.isUndefined(options.omitTrailingSlashes) ? true : options.omitTrailingSlashes;
  options.pattern = options.pattern || '**/*.html';

  if (options.omitExtensions) {
    const malformedExtensions = options.omitExtensions.filter(ext => ext[0] !== '.');

    if (malformedExtensions.length > 0) {
      throw new Error(`Extensions "${malformedExtensions.join(', ')}" do not start with a dot.`);
    }
  }

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
        url = omitIndex(url);
      }
      if (options.omitExtensions) {
        url = omitExtensions(url, options.omitExtensions);
      }

      url = joinUrl(options.hostname, replaceBackslash(url));

      if (options.omitTrailingSlashes) {
        url = omitTrailingSlashes(url);
      }

      return url;
    }

    function replaceBackslash(url) {
      return _.replace(url, /\\/g, '/');
    }

    function omitTrailingSlashes(url) {
      return _.trimEnd(url, '/');
    }

    function omitIndex(url) {
      const index = 'index.html';

      if (url.lastIndexOf(index) === url.length - index.length) {
        return url.substring(0, url.lastIndexOf(index));
      }

      return url;
    }

    function omitExtensions(url, extensionsToOmit) {

      const strippedUrls = extensionsToOmit.map((ext) => {

        if (url.endsWith(ext)) {
          return url.substring(0, url.lastIndexOf(ext));
        }
        return false;
      }).filter((value) => value);

      if (strippedUrls.length) {
        return strippedUrls.sort()[0];
      }
      return url;
    }

    done();
  }
};

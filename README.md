# metalsmith-canonical
[![npm version][npm-badge]][npm-url]
[![Build Status][travis-badge]][travis-url]

A metalsmith plugin to add a canonical url property to pages

## Installation

```bash
$ npm i metalsmith-canonical --save
```

## Example

Configuration in `metalsmith.json`:

```json
{
  "plugins": {
    "metalsmith-canonical": {
      "hostname": "http://www.website.com"
    }
  }
}
```

This plugin should be run after metalsmith-permalinks or metalsmith-moveup plugins.

## Options

You can pass options to `metalsmith-canonical` with the [Javascript API](https://github.com/segmentio/metalsmith#api) or [CLI](https://github.com/segmentio/metalsmith#cli). The options are:

##### hostname

* `required`

The hostname used for generating the canonical url.

##### pattern

* `optional`
* `default: '**/*.html'`

A [multimatch](https://github.com/sindresorhus/multimatch) pattern. Only for files that match this pattern a canonical url property will be added. Can be a string or an array of strings.

##### omitIndex

* `optional`
* `default: false`

Will replace any paths ending in `index.html` with `''`. Useful when you're using [metalsmith-permalinks](https://github.com/segmentio/metalsmith-permalinks).

##### omitTrailingSlashes

* `optional`
* `default: true`

Will remove any trailing slashes.

##### omitExtensions

* `optional`
* `default: undefined`
* `example: ['.html', '.htm']`

Will remove any extensions at the ends of files.
E.g., `.../abc.html` becomes `.../abc`.

## License

ISC

[npm-badge]: https://img.shields.io/npm/v/metalsmith-canonical.svg
[npm-url]: https://www.npmjs.com/package/metalsmith-canonical

[travis-badge]: https://travis-ci.org/saintedlama/metalsmith-canonical.svg?branch=master
[travis-url]: https://travis-ci.org/saintedlama/metalsmith-canonical

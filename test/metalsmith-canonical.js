const { expect } = require('chai');
const metalsmithCanonical = require('../');

describe('metalsmith-canonical', function() {
  it('should throw if required hostname option was omitted', () => {
    const canonical = metalsmithCanonical({});

    try {
      canonical({ 'a\\b\\c.html': {} }, {}, () => {});

      throw new Error('Should throw if required "hostname" option was omitted');
    } catch (e) {
      expect(e).to.exist;
    }
  });

  it('should throw if required hostname option was omitted by passing in empty options', () => {
    const canonical = metalsmithCanonical();

    try {
      canonical({ 'a\\b\\c.html': {} }, {}, () => {});

      throw new Error('Should throw if required "hostname" option was omitted');
    } catch (e) {
      expect(e).to.exist;
    }
  });

  it('should replace all backslashes in url', () => {
    const canonical = metalsmithCanonical({
      hostname: 'http://localhost:8080',
    });

    const files = {
      'a\\b\\c.html': {}
    };
    
    canonical(files, {}, () => {});

    expect(files).to.deep.equal({
      'a\\b\\c.html': {
        canonical: 'http://localhost:8080/a/b/c.html'
      }
    });
  });

  it('should not override existing canonical url', () => {
    const canonical = metalsmithCanonical({
      hostname: 'http://localhost:8080',
    });

    const files = {
      'a\\b\\c.html': { canonical: 'something' }
    };
    
    canonical(files, {}, () => {});

    expect(files).to.deep.equal({
      'a\\b\\c.html': {
        canonical: 'something'
      }
    });
  });

  
  it('should omit trailing slashes and "index.html" if specified', () => {
    const canonical = metalsmithCanonical({
      hostname: 'http://localhost:8080',
      omitTrailingSlashes: true,
      omitIndex: true,
    });

    const files = {
      'a\\b\\c\\index.html': {}
    };
    
    canonical(files, {}, () => {});

    expect(files).to.deep.equal({
      'a\\b\\c\\index.html': {
        canonical: 'http://localhost:8080/a/b/c'
      }
    });
  });

  it('should omit only "index.html" if omitTrailingSlashes not specified', () => {
    const canonical = metalsmithCanonical({
      hostname: 'http://localhost:8080',
      omitTrailingSlashes: false,
      omitIndex: true,
    });

    const files = {
      'a\\b\\c\\index.html': {}
    };
    
    canonical(files, {}, () => {});

    expect(files).to.deep.equal({
      'a\\b\\c\\index.html': {
        canonical: 'http://localhost:8080/a/b/c/'
      }
    });
  });

  it('should omit only exact matches of "index.html"', () => {
    const canonical = metalsmithCanonical({
      hostname: 'http://localhost:8080',
      omitIndex: true,
    });

    const files = {
      'a\\b\\c\\indexhtml.html': {}
    };
    
    canonical(files, {}, () => {});

    expect(files).to.deep.equal({
      'a\\b\\c\\indexhtml.html': {
        canonical: 'http://localhost:8080/a/b/c/indexhtml.html'
      }
    });
  });

  it('should omit only exact matches of "index.html"', () => {
    const canonical = metalsmithCanonical({
      hostname: 'http://localhost:8080',
      omitTrailingSlashes: false,
      omitIndex: true,
    });

    const files = {
      'a\\index.html\\c\\index.html': {}
    };
    
    canonical(files, {}, () => {});

    expect(files).to.deep.equal({
      'a\\index.html\\c\\index.html': {
        canonical: 'http://localhost:8080/a/index.html/c/'
      }
    });
  });

  it('should omit extensions if omitExtensions option is specified', () => {

    const canonical = metalsmithCanonical({
      hostname: 'http://localhost:8080',
      pattern: '**/*',
      omitExtensions: ['.html', '.bar'],
    });

    const files = {
      'a\\index.html\\c\\foo.html': {},
      'b\\index.html\\c\\foo.htm': {},
      'c\\index.html\\c\\foo.bar.bar': {},
    };

    canonical(files, {}, () => {});

    expect(files).to.deep.equal({
      'a\\index.html\\c\\foo.html': {
        canonical: 'http://localhost:8080/a/index.html/c/foo',
      },
      'b\\index.html\\c\\foo.htm': {
        canonical: 'http://localhost:8080/b/index.html/c/foo.htm',
      },
      'c\\index.html\\c\\foo.bar.bar': {
        canonical: 'http://localhost:8080/c/index.html/c/foo.bar',
      },
    });
  });

  it('should throw if omitted extensions doesn\'t start with a dot', () => {

    expect(() => metalsmithCanonical({
      hostname: 'http://localhost:8080',
      pattern: '**/*',
      omitExtensions: ['.html', 'tml'],
    })).to.throw(TypeError);

  });


  it('should return shortest url if several omitExtensions satisfy a file', () => {

    const canonical = metalsmithCanonical({
      hostname: 'http://localhost:8080',
      pattern: '**/*',
      omitExtensions: ['.html', '.bar.html'],
    });

    const files = {
      'a\\index.html\\c\\foo.bar.html': {},
    };

    canonical(files, {}, () => {});

    expect(files).to.deep.equal({
      'a\\index.html\\c\\foo.bar.html': {
        canonical: 'http://localhost:8080/a/index.html/c/foo',
      }
    });

  });

  it('should not process non matching files', () => {
    const canonical = metalsmithCanonical({
      hostname: 'http://localhost:8080',
      omitTrailingSlashes: false,
      omitIndex: true,
    });

    const files = {
      'a\\b\\c\\index.ejs': {}
    };
    
    canonical(files, {}, () => {});

    expect(files).to.deep.equal({
      'a\\b\\c\\index.ejs': {}
    });
  });
});

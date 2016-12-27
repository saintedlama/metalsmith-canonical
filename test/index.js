const path = require('path');
const expect = require('chai').expect;
const Metalsmith = require('metalsmith');
const canonical = require('..');

describe('metalsmith-canonical', function() {
  it('should only process html by default', function(done) {
    Metalsmith('test/fixtures/html')
      .use(canonical({ hostname: 'http://www.website.com/' }))
      .use(expectFile('a.html', f => expect(f.canonical).to.equal('http://www.website.com/a.html')))
      .use(expectFile('b.txt', f => expect(f.canonical).to.not.exist))
      .build(done);
  });

  it('should omit index.html if set to true', function(done) {
    Metalsmith('test/fixtures/omit-index')
      .use(canonical({ hostname: 'http://www.website.com/', omitIndex: true }))
      .use(expectFile('index.html', f => expect(f.canonical).to.equal('http://www.website.com')))
      .build(done);
  });

  it('should omit tailing slashes if set to true', function(done) {
    Metalsmith('test/fixtures/omit-trailing-slashes')
      .use(canonical({ hostname: 'http://www.website.com/', omitTrailingSlashes: true, omitIndex: true }))
      .use(expectFile('index.html', f => expect(f.canonical).to.equal('http://www.website.com')))
      .build(done);
  });

  it('should not omit tailing slashes if set to false', function(done) {
    Metalsmith('test/fixtures/omit-trailing-slashes')
      .use(canonical({ hostname: 'http://www.website.com/', omitTrailingSlashes: false, omitIndex: true }))
      .use(expectFile('index.html', f => expect(f.canonical).to.equal('http://www.website.com/')))
      .build(done);
  });

  it('should omit tailing slashes by default', function(done) {
    Metalsmith('test/fixtures/omit-trailing-slashes')
      .use(canonical({ hostname: 'http://www.website.com/', omitIndex: true }))
      .use(expectFile('index.html', f => expect(f.canonical).to.equal('http://www.website.com')))
      .build(done);
  });

  it('should not override existing canonical property', function(done) {
    Metalsmith('test/fixtures/override')
      .use(canonical({ hostname: 'http://www.website.com/' }))
      .use(expectFile('index.html', f => expect(f.canonical).to.equal('https://anothersite')))
      .build(done);
  });

  it('should build canonical urls for nested files in directories', function(done) {
    Metalsmith('test/fixtures/directories')
      .use(canonical({ hostname: 'http://www.website.com/', omitIndex: true }))
      .use(expectFile('docs' + path.sep + 'index.html', f => expect(f.canonical).to.equal('http://www.website.com/docs')))
      .build(done);
  });

  it('should emit an error if hostname property is not set', function(done) {
    Metalsmith('test/fixtures/override')
      .use(canonical())
      .build((err) => {
        expect(err).to.exist;
        done();
      });
  });
});

function expectFile(filename, fn) {
  return function(files, metalsmith, done) {
    const expectedFile = files[filename];

    expect(fn(expectedFile)).to.be.ok;

    done();
  }
}

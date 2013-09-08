var fs     = require('fs');
var path   = require('path');
var assert = require('assert');
var wsp    = require('..');


var dirpath = path.join(__dirname, 'dir1');
var filepath = path.join(__dirname, 'dir1', 'file.txt');

describe('Create write stream', function() {
  if('Directory should not exist', function(done) {
    fs.unlink(dirpath, done);
  });

  it('On a directory that does not exist', function(done) {
    fs.exists(dirpath, function(exists) {
      assert.ok(!exists);
      var ws = wsp(filepath);
      ws.write('hello world\n');
      ws.end('hey there');
      ws.once('finish', function() {
        fs.readFile(filepath, 'utf8', function(err, data) {
          if (err) return done(err);
          assert.equal('hello world\nhey there', data);
          fs.unlink(filepath, function() {
            fs.rmdir(dirpath, done);
          });
        });
      });

    });
  });
});

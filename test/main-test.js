var fs     = require('fs');
var path   = require('path');
var assert = require('assert');
var wsp    = require('..');


var dirpath1 = path.join(__dirname, 'dir1');
var filepath1 = path.join(__dirname, 'dir1', 'file.txt');
var dirpath2 = path.join(__dirname, 'dir2');
var filepath2 = path.join(__dirname, 'dir2', 'dir22', 'file.txt');

describe('Create write stream', function() {
  describe('On a directory that does not exist', function() {
    before(function() {
      if (fs.existsSync(dirpath1)) {
        fs.readdirSync(dirpath1).forEach(function(file) {
          var filepath1 = path.resolve(dirpath1, file);
          fs.unlinkSync(filepath1);
        });
        fs.rmdirSync(dirpath1);
      }
    });

    it('Creates the directory and file', function(done) {
      fs.exists(dirpath1, function(exists) {
        assert.ok(!exists);
        var ws = wsp(filepath1);
        ws.write('hello world\n');
        ws.end('hey there');
        ws.once('finish', function() {
          fs.readFile(filepath1, 'utf8', function(err, data) {
            if (err) { return done(err); }
            assert.equal('hello world\nhey there', data);
            fs.unlink(filepath1, function() {
              fs.rmdir(dirpath1, done);
            });
          });
        });
      });
    });
  });

  describe('On a permissions denied directory', function() {
    before(function(done) {
      fs.mkdir(dirpath2, function() {
        fs.chmod(dirpath2, '000', done);
      });
    });

    it('Stream emits error', function(done) {
      var ws = wsp(filepath2);
      ws.on('error', function(err) {
        assert.ok(err);
        assert.equal(err.code, 'EACCES');
        done();
      });
    });

    after(function(done) {
      fs.chmod(dirpath2, '777', done);
    });
  });
});

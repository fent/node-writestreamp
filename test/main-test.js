const fs     = require('fs');
const path   = require('path');
const assert = require('assert');
const wsp    = require('..');


const dirpath1 = path.join(__dirname, 'dir1');
const filepath1 = path.join(__dirname, 'dir1', 'file.txt');
const dirpath2 = path.join(__dirname, 'dir2');
const filepath2 = path.join(__dirname, 'dir2', 'dir22', 'file.txt');

describe('Create write stream', () => {
  describe('On a directory that does not exist', () => {
    before((done) => {
      fs.readdir(dirpath1, (err, files) => {
        if (err) { return done(); }
        if (!files.length) { return fs.rmdir(dirpath1, done); }
        var total = 0;
        files.forEach((file) => {
          var filepath = path.resolve(dirpath1, file);
          fs.unlink(filepath, () => {
            if (++total === files.length) {
              fs.rmdir(dirpath1, done);
            }
          });
        });
      });
    });

    it('Creates the directory and file', (done) => {
      fs.stat(dirpath1, (err) => {
        assert.ok(err);
        var ws = wsp(filepath1);
        ws.write('hello world\n');
        ws.end('hey there');
        ws.once('finish', () => {
          fs.readFile(filepath1, 'utf8', (err, data) => {
            if (err) { return done(err); }
            assert.equal('hello world\nhey there', data);
            fs.unlink(filepath1, () => {
              fs.rmdir(dirpath1, done);
            });
          });
        });
      });
    });
  });

  describe('On a permissions denied directory', () => {
    before((done) => {
      fs.mkdir(dirpath2, () => {
        fs.chmod(dirpath2, '000', done);
      });
    });

    it('Stream emits error', (done) => {
      var ws = wsp(filepath2);
      ws.on('error', (err) => {
        assert.ok(err);
        assert.equal(err.code, 'EACCES');
        done();
      });
    });

    after((done) => {
      fs.chmod(dirpath2, '777', done);
    });
  });
});

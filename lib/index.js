const fs        = require('fs');
const path      = require('path');
const mkdirp    = require('mkdirp');
const streamify = require('streamify');


/**
 * Creates a `fs.WriteStream` that checks if its directory path exists.
 * If it doesn't, it creates it.
 *
 * @param {string} filepath
 * @param {Object} options
 */
module.exports = (filepath, options) => {
  const stream = streamify({
    writable: true,
    readable: false,
  });

  mkdirp(path.dirname(filepath)).then(() => {
    stream.resolve(fs.createWriteStream(filepath, options));
  }, (err) => stream.emit('error', err));

  return stream;
};

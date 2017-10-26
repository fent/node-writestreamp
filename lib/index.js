const fs        = require('fs');
const path      = require('path');
const mkdirp    = require('mkdirp');
const streamify = require('streamify');


/**
 * Creates a `fs.WriteStream` that checks if its directory path exists.
 * If it doesn't, it creates it.
 *
 * @param {String} filepath
 * @param {Object} options
 */
module.exports = (filepath, options) => {
  var stream = streamify({
    writable: true,
    readable: false,
  });

  mkdirp(path.dirname(filepath), (err) => {
    if (err) { return stream.emit('error', err); }
    stream.resolve(fs.createWriteStream(filepath, options));
  });

  return stream;
};

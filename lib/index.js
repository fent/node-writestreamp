var fs        = require('fs');
var path      = require('path');
var mkdirp    = require('mkdirp');
var streamify = require('streamify');


/**
 * Creates a `fs.WriteStream` that checks if its directory path exists.
 * If it doesn't, it creates it.
 *
 * @param {String} filepath
 * @param {Object} options
 */
module.exports = function createWriteStreamP(filepath, options) {
  var stream = streamify({
    //superCtor: fs.WriteStream,
    writable: true,
    readable: false,
  });

  mkdirp(path.dirname(filepath), function(err) {
    if (err) return stream.emit('error', err);
    stream.resolve(fs.createWriteStream(filepath, options));
  });

  return stream;
};

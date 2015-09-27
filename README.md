# node-writestreamp

Create a writable file stream without checking if a directory exists. Like mkdirp with files.

[![Build Status](https://secure.travis-ci.org/fent/node-writestreamp.png)](http://travis-ci.org/fent/node-writestreamp) [![Dependency Status](https://gemnasium.com/fent/node-writestreamp.svg)](https://gemnasium.com/fent/node-writestreamp)

# Usage

```js
var wsp = require('writestreamp');
var ws = wsp('some/dir/that/might/not/exist/file', options);
readStream.pipe(ws);
```

# Install

    npm install writestreamp


# Tests
Tests are written with [mocha](http://visionmedia.github.com/mocha/)

```bash
npm test
```

# License
MIT

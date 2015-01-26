"use strict";

var path = require('path'),
    srcDir = path.join(__dirname, '..', 'lib');

require('blanket')({
    pattern: srcDir
});

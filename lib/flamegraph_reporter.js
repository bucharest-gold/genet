'use strict';

const fs = require('fs');
const fromStream = require('flamegraph/from-stream');

function flameReport (genet) {
  let stream = fs.createReadStream(genet.outputFile);
  const svg = fs.createWriteStream(genet.outputFile + '.svg');
  fromStream(stream, {inputtype: 'cpuprofile'}).pipe(svg);
}

module.exports = exports = flameReport;

'use strict';

const fs = require('fs');
const Fidelity = require('fidelity');
const huilu = require('huilu/from-stream');

function flameReport (genet) {
  let stream = fs.createReadStream(genet.outputFile);
  const svg = fs.createWriteStream(`${genet.outputFile}.svg`);
  const promise = new Fidelity((resolve, reject) => {
    huilu.fromStream(stream, {inputtype: 'cpuprofile'})
      .pipe(svg)
      .on('end', () => resolve(genet))
      .on('error', (e) => reject(e));
  });
  return promise;
}

module.exports = exports = flameReport;

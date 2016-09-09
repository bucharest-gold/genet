'use strict';

const fs = require('fs');
const Fidelity = require('fidelity');
const Table = require('./table');

function fileReport (genet) {
  const nodes = genet.significantNodes;
  nodes.sort((a, b) => {
    if (a.depth > b.depth) {
      return 1;
    }
    if (a.depth < b.depth) {
      return -1;
    }
    return 0;
  });
  const content = Table.createTable(nodes);
  const promise = new Fidelity((resolve, reject) => {
    fs.writeFile(`${genet.outputFile}.txt`,
      content.split(/\u001b\[(?:\d*;){0,5}\d*m/g).join(''), (err) => {
        if (err) return reject(err);
        resolve(genet);
      });
  });
  return promise;
}

module.exports = exports = fileReport;

'use strict';

const Fidelity = require('fidelity');
const Table = require('./table');

function consoleReport (genet) {
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
  genet.log(Table.createTable(nodes));
  return Fidelity.resolve(genet);
}

module.exports = exports = consoleReport;

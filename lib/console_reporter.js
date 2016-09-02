'use strict';

const Table = require('./table');

function consoleReport (genet) {
  let nodes = genet.significantNodes;
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
}

module.exports = exports = consoleReport;

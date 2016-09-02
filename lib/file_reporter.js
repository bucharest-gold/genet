'use strict';

const fs = require('fs');

const Table = require('./table');

function fileReport (genet) {
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
  let content = Table.createTable(nodes);
  content = content.split(/\u001b\[(?:\d*;){0,5}\d*m/g).join('');
  fs.writeFileSync(`${genet.outputFile}.txt`, content);
}

module.exports = exports = fileReport;

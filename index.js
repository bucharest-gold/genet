'use strict';

const profiler = require('v8-profiler');
const fs = require('fs');
const processor = require('./cpuprofile-processor');
const Table = require('cli-table2');

module.exports = exports = {
  start
};

let opts = {};

function start (options) {
  opts = {
    profileName: 'genet',
    outputFile: defaultFilename,
    duration: 5000,
    verbose: false,
    report: true,
    filter: ''
  };
  Object.assign(opts, options);

  const logger = getLogger(opts.verbose);
  logger('Application profiling starting');
  profiler.startProfiling(opts, true);
  setTimeout(() => {
    const profile = profiler.stopProfiling('');
    profile.export()
      .pipe(fs.createWriteStream(nameGenerator(opts.outputFile)))
      .once('error', profiler.deleteAllProfiles)
      .once('finish', () => {
        profiler.deleteAllProfiles;
        if (opts.report) {
          consoleReport(opts.filter);
          fileReport(opts.filter);
        }
      });
    profiler.deleteAllProfiles();
    logger('Application profiling stopped');
  }, opts.duration);
}

function getLogger (shouldLog) {
  return shouldLog ? console.log : () => {
  };
}

function defaultFilename () {
  return `./prof-${Date.now()}.cpuprofile`;
}

function nameGenerator (generator) {
  if (typeof generator === 'function') {
    return generator();
  } else {
    return generator.toString();
  }
}

function processFile () {
  const profile = JSON.parse(fs.readFileSync(opts.outputFile, 'utf8'));
  return processor(profile).process();
}

function significantNodes (filter) {
  const parsed = processFile();
  const nodes = [];
  Object.keys(parsed.nodes).map((i) => {
    let node = parsed.nodes[i];
    if (node.func.toString().includes('.js')) {
      if (filter) {
        if (node.func.toString().includes(filter)) {
          node.depth = node.etime - node.stime;
          nodes.push(node);
        }
      } else {
        node.depth = node.etime - node.stime;
        nodes.push(node);
      }
    }
  });
  return nodes;
}

function consoleReport (filter) {
  let nodes = significantNodes(filter);
  nodes.sort((a, b) => {
    if (a.depth > b.depth) {
      return 1;
    }
    if (a.depth < b.depth) {
      return -1;
    }
    return 0;
  });
  console.log(createTable(nodes));
}

function createTable (nodes) {
  let table = new Table({
    head: ['Function', 'File', 'Line', 'Time']
  });

  nodes.forEach(n => {
    const row = [];
    let functionName = n.func.split(' ')[0];
    if (functionName) {
      row.push(functionName);
    } else {
      row.push('N/A');
    }
    let file = n.func.split(' ')[1];
    file = file.split(':')[0];
    row.push(file);
    let lineNumber = n.func.split(':')[1];
    row.push(lineNumber);
    row.push(n.depth);
    table.push(row);
  });
  return table.toString();
}

function fileReport (filter) {
  let nodes = significantNodes(filter);
  nodes.sort((a, b) => {
    if (a.depth > b.depth) {
      return 1;
    }
    if (a.depth < b.depth) {
      return -1;
    }
    return 0;
  });
  fs.writeFile('./report.json', JSON.stringify(nodes, null, 2), (err) => {
    if (err) return console.log(err);
  });
}

'use strict';

// Node.js builtin module
const fs = require('fs');

// some profiler dependencies
const profiler = require('v8-profiler');
const processor = require('flamegraph/lib/cpuprofile-processor');

// Builtin reporters
const flamegraphReporter = require('./lib/flamegraph_reporter');
const consoleReporter = require('./lib/console_reporter');
const fileReporter = require('./lib/file_reporter');

// const Symbols for property accessors
const OPTIONS = Symbol('options');
const LOGGER = Symbol('logger');
const SIGNIFICANT_NODES = Symbol('significant_nodes');

class Genet {
  constructor (options) {
    const opts = getOptions(options);
    opts.outputFile = typeof opts.outputFile === 'function'
                      ? opts.outputFile()
                      : opts.outputFile.toString();
    this[OPTIONS] = opts;
    this[LOGGER] = opts.verbose ? console.log : (_) => _;
  }

  start () {
    const opts = this[OPTIONS];
    const log = this[LOGGER];

    log('Application profiling starting');
    profiler.startProfiling(opts, true);
    setTimeout(() => {
      const profile = profiler.stopProfiling('');
      profile.export()
        .pipe(fs.createWriteStream(opts.outputFile))
        .once('error', profiler.deleteAllProfiles)
        .once('finish', () => {
          profiler.deleteAllProfiles;

          // we only need to do this once for all reports
          this[SIGNIFICANT_NODES] = getSignificantNodes(this);

          // generate reports
          consoleReporter(this);
          fileReporter(this);
          if (opts.flamegraph) {
            flamegraphReporter(this);
          }
        });
      profiler.deleteAllProfiles();
      log('Application profiling stopped');
    }, opts.duration);
  }

  get log () {
    return this[LOGGER];
  }

  get filter () {
    return this[OPTIONS].filter;
  }

  get outputFile () {
    return this[OPTIONS].outputFile;
  }

  get significantNodes () {
    return this[SIGNIFICANT_NODES];
  }
}

function getOptions (options) {
  const opts = {
    profileName: 'genet',
    outputFile: defaultFilename,
    duration: 5000,
    verbose: false,
    showAppOnly: false,
    flamegraph: false,
    filter: ''
  };
  Object.assign(opts, options);
  return opts;
}

function defaultFilename () {
  return `./prof-${Date.now()}.cpuprofile`;
}

function getSignificantNodes (genet) {
  const parsed = processor(
    JSON.parse(fs.readFileSync(genet.outputFile, 'utf8')))
    .process();

  const nodes = [];
  Object.keys(parsed.nodes).map((i) => {
    let node = parsed.nodes[i];
    if (node.func.toString().includes('.js')) {
      if (genet.filter) {
        if (node.func.toString().includes(genet.filter)) {
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

module.exports = exports = Genet;

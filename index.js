'use strict';

// Node.js builtin module
const fs = require('fs');

// some profiler dependencies
const profiler = require('@risingstack/v8-profiler');
const processor = require('huilu/lib/cpuprofile-processor');
const Fidelity = require('fidelity');

// Builtin reporters
const flamegraphReporter = require('./lib/flamegraph_reporter');
const consoleReporter = require('./lib/console_reporter');
const fileReporter = require('./lib/file_reporter');

// const Symbols for property accessors
const LOGGER = Symbol('logger');
const OPTIONS = Symbol('options');
const STOPPED = Symbol('stopped');
const TIMEOUT = Symbol('timeout');
const SIGNIFICANT_NODES = Symbol('significant_nodes');

class Genet {
  constructor (options) {
    const opts = getOptions(options);
    opts.outputFile = typeof opts.outputFile === 'function'
                      ? opts.outputFile()
                      : opts.outputFile.toString();
    this[OPTIONS] = opts;
    this[STOPPED] = true;
    this[LOGGER] = opts.verbose ? console.log : (_) => _;
  }

  start () {
    const opts = this[OPTIONS];

    if (this[STOPPED]) {
      this[STOPPED] = false;
      this.log('Application profiling starting');
      profiler.startProfiling(opts.profileName, true);
      this[TIMEOUT] = setTimeout(this.stop, opts.duration);
    } else {
      console.error('Profiler already running');
    }
  }

  stop () {
    const opts = this[OPTIONS];

    if (!this[STOPPED]) {
      clearTimeout(this[TIMEOUT]);
      this[STOPPED] = true;
      this[TIMEOUT] = null;

      return new Fidelity((resolve, reject) => {
        const profile = profiler.stopProfiling(opts.profileName);
        profile.export()
          .pipe(fs.createWriteStream(opts.outputFile))
          .once('error', reject)
          .once('finish', () => {
            generateReports(this, opts.flamegraph)
              .then(resolve)
              .catch(reject);
          });
        profiler.deleteAllProfiles();
      });
    } else {
      return Fidelity.resolve();
    }
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

function generateReports (genet, flamegraph) {
  // we only need to do this once for all reports
  genet[SIGNIFICANT_NODES] = getSignificantNodes(genet);

  // generate reports
  return consoleReporter(genet)
    .then(() => fileReporter(genet))
    .then(() => {
      if (flamegraph) {
        return flamegraphReporter(genet);
      }
    });
}

function getOptions (options) {
  const opts = {
    profileName: 'genet',
    outputFile: defaultFilename,
    duration: 5000,
    verbose: false,
    showAppOnly: false,
    flamegraph: false,
    filter: /./
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
      // String.prototype.search automatically converts
      // a String parameter to a RegExp using new RegExp()
      // so this search should be safe for either RegExp
      // or String options on genet.filter.
      if (~node.func.toString().search(genet.filter)) {
        node.depth = node.etime - node.stime;
        nodes.push(node);
      }
    }
  });
  return nodes;
}

module.exports = exports = Genet;

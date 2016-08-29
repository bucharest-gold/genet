const profiler = require('v8-profiler');
const fs = require('fs');

module.exports = exports = {
  start
};

function start (options) {
  const opts = {
    profileName: 'genet',
    outputFile: defaultFilename,
    duration: 5000,
    verbose: false
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
      .once('finish', profiler.deleteAllProfiles);
    profiler.deleteAllProfiles();
    logger('Application profiling stopped');
  }, opts.duration);
}

function getLogger (shouldLog) {
  return shouldLog ? console.log : () => {};
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

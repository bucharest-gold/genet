'use strict';

const Genet = require('../index');
const Fidelity = require('fidelity');

const someWork = (resolve) => {
  setImmediate(() => resolve(Math.floor(Math.random() * (10 - 0))));
};

function runBenchmarks () {
  const profile = new Genet({
    profileName: 'fidelity',
    // filter out everything but fidelity core code
    filter: /^(?!.*bench.*)(?=.*fidelity).*/,
    duration: 5000,
    showAppOnly: true,
    verbose: true,
    flamegraph: true
  });

  exports.compare = {
    'new Fidelity Promise': function (done) {
      new Fidelity(someWork).then(done);
    },
    'Fidelity.resolve()': function (done) {
      Fidelity.resolve(Math.floor(Math.random() * (10 - 0))).then(done);
    }
  };

  exports.done = function (data) {
    profile.stop().then(() => {
      console.log('Profiling stopped');
      bench.show(data);
    });
  };

  exports.countPerLap = 6;
  exports.compareCount = 8;

  profile.start();

  const bench = require('bench');
  bench.runMain();
}

runBenchmarks();

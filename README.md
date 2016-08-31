# genet

This is a simple Node.js profiling tool and at the moment doesn't
do a whole lot. Use it like this. First add it to your project.

    $ npm install --save genet

Then start profiling. Put this somewhere in your app. Probably
near the start.

    const genet = require('genet');
    genet.start({
      profileName: 'myAppProfile', // default 'genet'
      outputFile: './pathToSomeFile.cpuprofile',
      duration: 5000, // default 5000 (ms)
      verbose: true, // default false
      report: false, // default true
      filter: 'myApp' // default ''
    });

The `outputFile` option can be a name, or a function. If you
provide a function, it will be called and the return value will
be used as the output file location. By default, the value is
``./prof-${Date.now()}.cpuprofile``.

By default a `report.json` will be created.
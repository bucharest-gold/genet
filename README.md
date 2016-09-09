# genet

[![Coverage Status](https://coveralls.io/repos/github/bucharest-gold/genet/badge.svg?branch=master)](https://coveralls.io/github/bucharest-gold/genet?branch=master)
[![Build Status](https://travis-ci.org/bucharest-gold/genet.svg?branch=master)](https://travis-ci.org/bucharest-gold/genet)
[![Known Vulnerabilities](https://snyk.io/test/npm/genet/badge.svg)](https://snyk.io/test/npm/genet) [![dependencies Status](https://david-dm.org/bucharest-gold/genet/status.svg)](https://david-dm.org/bucharest-gold/genet)

[![NPM](https://nodei.co/npm/genet.png)](https://npmjs.org/package/genet)

A Node.js application profiling tool.

|                 | Project Info  |
| --------------- | ------------- |
| License:        | Apache-2.0  |
| Build:          | make  |
| Documentation:  | http://bucharest-gold.github.io/genet/  |
| Issue tracker:  | https://github.com/bucharest-gold/genet/issues  |
| Engines:        | Node.js 4.x, 5.x, 6.x


This is a simple Node.js profiling tool. Use it like this.
First add it to your project.

## Installation

    $ npm install genet -S

## Usage

Then start profiling. Put this somewhere in your app. Probably
near the start.

```javascript
const Genet = require('genet');
const profile = new Genet({
    profileName: 'myAppProfile', // default 'genet'
    outputFile: './pathToSomeFile.cpuprofile',
    duration: 5000, // default 5000 (ms)
    verbose: true, // default false
    report: false, // default true
    showAppOnly: true, // default false
    flamegraph: true, // Generates a flamegraph.svg file - default false
    filter: 'myModule' // Filter data to only include 'myModule' - default ''
});
profile.start();
```

The `outputFile` option can be a name, or a function. If you
provide a function, it will be called and the return value will
be used as the output file location. By default, the value is
``./prof-${Date.now()}.cpuprofile``.

## Reporters

By default, `genet` will generate a report to the console, and to a file. Using the
`flamegraph` option, you can also generate a flamegraph as an `.svg` file.

Console output will look something like this.

![alt example](http://new.tinygrab.com/fda4615e9c62094ff7397e78a1e9e2f5f2665cabe4.png)

The flamegraph SVG might look something like this.

![alt flamegraph](http://new.tinygrab.com/fda4615e9c5dfe16be98cd5a1eb4e528cb181a1a2f.png)

## Contributing

Please read the [contributing guide](./CONTRIBUTING.md)
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
| Engines:        | Node.js 4.x, 6.x, 7.x


This is a simple Node.js profiling tool. Use it like this.
First add it to your project.

## Installation

    $ npm install genet -S

## Usage

Then start profiling. Put this somewhere in your app. Probably
near the start.

```javascript
const Genet = require('genet');
const profile = new Genet();
profile.start();
```

## API

When requiring the `genet` module, the module exports the `Genet` object's
constructor function.

```javascript
// Genet is a constructor function
const Genet = require('genet');
var profile = new Genet();
```

### `new Genet(options)`

Creates a new profiler. Several options are allowed.

* `options.profileName` {string} - The profile name provided to `v8-profiler`.
  Defaults to `'genet'`.
* `options.outputFile` {string} - The output file name.
  Defaults to ``./prof-${Date.now()}.cpuprofile``.
* `options.duration` {Number} - The number of milliseconds to run the profiler. Defaults to 5000.
* `options.verbose` {boolean} - Determines how much log output you'll see. Defaults to `false`.
* `options.report` {boolean} - Whether or not to generate report output. Defaults to `true`.
* `options.flamegraph` {boolean} - Determines whether to generate a flamegraph .svg file.
  Defaults to `false`.
* `options.filter` {RegExp|String} - An inclusive filter which determines what functions to
  include in the reports based on comparison with the path and filename for a given function.

### profile.start()

Begins profiling the application. The profiler will run until `options.duration` milliseconds
have elapsed, and then generate reports.

### profile.stop()

Stops profiling the application. If the profiler has already been stopped, this function
does nothing. If the profiler is still running, it cancels the timeout set by `options.duration`
and then stops the profiler. This function returns a promise that resolves when the
profiler has stopped.

## Reporters

By default, `genet` will generate a report to the console, and to a file. Using the
`flamegraph` option, you can also generate a flamegraph as an `.svg` file.

Console output will look something like this.

![alt example](http://new.tinygrab.com/fda4615e9c62094ff7397e78a1e9e2f5f2665cabe4.png)

The flamegraph SVG might look something like this.

![alt flamegraph](http://new.tinygrab.com/fda4615e9c5dfe16be98cd5a1eb4e528cb181a1a2f.png)

## Contributing

Please read the [contributing guide](./CONTRIBUTING.md)
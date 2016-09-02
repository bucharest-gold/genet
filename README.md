# genet

[![Build Status](https://travis-ci.org/bucharest-gold/genet.svg?branch=master)](https://travis-ci.org/bucharest-gold/genet) [![Known Vulnerabilities](https://snyk.io/test/npm/genet/badge.svg)](https://snyk.io/test/npm/genet) [![dependencies Status](https://david-dm.org/bucharest-gold/genet/status.svg)](https://david-dm.org/bucharest-gold/genet)

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

    $ npm install --save genet

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
    filter: 'myApp' // default '',
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

![alt example](https://cloud.githubusercontent.com/assets/6443576/18143076/e99fca90-6f96-11e6-8bf2-da3ebaacdd8d.png)
/*
Copyright 2014 Thorsten Lorenz.
All rights reserved.

Permission is hereby granted, free of charge, to any person
obtaining a copy of this software and associated documentation
files (the "Software"), to deal in the Software without
restriction, including without limitation the rights to use,
copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the
Software is furnished to do so, subject to the following
conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
OTHER DEALINGS IN THE SOFTWARE.
*/

/*
  Modified according to semistandard.

  Original code:
  https://github.com/thlorenz/flamegraph/blob/gh-pages/lib/cpuprofile-processor.js
*/

'use strict';

function funcName (node) {
  var n = node.functionName;
  if (node.url) n += ' ' + node.url + ':' + node.lineNumber;
  return n;
}

function byFramesLexically (a, b) {
  let i = 0;
  let framesA = a.frames;
  let framesB = b.frames;
  while (true) {
    if (!framesA[i]) return -1;
    if (!framesB[i]) return 1;
    if (framesA[i] < framesB[i]) return -1;
    if (framesB[i] < framesA[i]) return 1;
    i++;
  }
}

function sort (functions) {
  return functions.sort(byFramesLexically);
}

function CpuProfileProcessor (cpuprofile) {
  if (!(this instanceof CpuProfileProcessor)) return new CpuProfileProcessor(cpuprofile);

  this._profile = cpuprofile;
  this._paths = [];
  this._time = 0;

  this._last = [];
  this._tmp = {};
  this._nodes = {};
}

var proto = CpuProfileProcessor.prototype;
module.exports = CpuProfileProcessor;

proto._explorePaths = function _explorePaths (node, stack) {
  stack.push(funcName(node));

  if (node.hitCount) this._paths.push({ frames: stack.slice(), hitCount: node.hitCount });

  for (var i = 0; i < node.children.length; i++) {
    this._explorePaths(node.children[i], stack);
  }

  stack.pop();
};

proto._flow = function _flow (frames) {
  let lenLast = this._last.length - 1;
  let lenFrames = frames.length - 1;
  let i;
  let lenSame;
  let k;

  for (i = 0; i <= lenLast; i++) {
    if (i > lenFrames) break;
    if (this._last[i] !== frames[i]) break;
  }
  lenSame = i;

  for (i = lenLast; i >= lenSame; i--) {
    k = this._last[i] + ';' + i;
    this._nodes[k + ';' + this._time] = { func: this._last[i], depth: i, etime: this._time, stime: this._tmp[k].stime };
    this._tmp[k] = null;
  }

  for (i = lenSame; i <= lenFrames; i++) {
    k = frames[i] + ';' + i;
    this._tmp[k] = { stime: this._time };
  }
};

proto._processPath = function _processPath (path) {
  this._flow(path.frames);
  this._time += path.hitCount;
  this._last = path.frames;
};

proto._processPaths = function _processPaths () {
  sort(this._paths);
  for (var i = 0; i < this._paths.length; i++) {
    this._processPath(this._paths[i]);
  }

  this._flow([]);
};

proto.process = function process () {
  this._explorePaths(this._profile.head, []);
  this._processPaths();
  return { nodes: this._nodes, time: this._time };
};

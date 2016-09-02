/**
 * Copyright 2016 Red Hat, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License")
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';

const test = require('tape');
const fs = require('fs');
const Genet = require('../index');

test('Genet should generate a .cpuprofile', t => {
  const genet = new Genet({duration: 1000});
  genet.start();
  genet.stop().then(() => {
    fs.readdir(`${__dirname}/../`, (e, files) => {
      if (e) {
        console.error(e);
        return;
      }
      let fileFound = false;
      files.find(file => {
        fileFound = file.endsWith('.cpuprofile');
        return fileFound;
      });
      t.ok(fileFound, true);
    });
    t.end();
  });
});

test('Genet should generate a .txt report', t => {
  const genet = new Genet({duration: 1000});
  genet.start();
  genet.stop().then(() => {
    fs.readdir(`${__dirname}/../`, (e, files) => {
      if (e) {
        console.error(e);
        return;
      }
      let fileFound = false;
      files.find(file => {
        fileFound = file.endsWith('.cpuprofile.txt');
        return fileFound;
      });
      t.ok(fileFound, true);
    });
    t.end();
  });
});

test('Output file as a function', t => {
  const genet = new Genet({
    outputFile: () => {
      return 'test-output-filename';
    }
  });
  t.equals(genet.outputFile, 'test-output-filename');
  t.end();
});

test('Output file as a string', t => {
  const genet = new Genet({
    outputFile: 'foo.txt'
  });
  t.equals(genet.outputFile, 'foo.txt');
  t.end();
});

test('Output file as somethingn else', t => {
  const date = new Date();
  const genet = new Genet({
    outputFile: date
  });
  t.equals(genet.outputFile, date.toString());
  t.end();
});

test.onFinish(() => {
  fs.readdir(`${__dirname}/../`, (e, files) => {
    if (e) {
      console.error(e);
      return;
    }
    files.forEach((file) => {
      if (file.includes('.cpuprofile')) {
        fs.unlinkSync(file);
      }
    });
  });
});

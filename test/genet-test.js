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

test('Should start.', t => {
  let genet = new Genet({duration: 500});
  genet.start();
  t.end();
});

test.onFinish(() => {
  fs.readdir('./', (e, files) => {
    if (e) {
      console.error(e);
    }
    let fileFound = false;
    files.forEach(file => {
      if (file.includes('.cpuprofile')) {
        fileFound = true;
      }
    });
    console.log(fileFound);
  });
});

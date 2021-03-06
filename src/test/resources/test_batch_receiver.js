/*
 * Copyright 2014 the original author or authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
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
var input = require('vertigo/input');
var test = require('testtools');

input.port('in').batchHandler(function(batch) {
  var messages = [];
  batch.messageHandler(function(message) {
    messages.push(message);
  });
  batch.endHandler(function() {
    test.assertTrue(messages.indexOf('foo') !== -1);
    test.assertTrue(messages.indexOf('bar') !== -1);
    test.assertTrue(messages.indexOf('baz') !== -1);
    test.testComplete();
  });
});

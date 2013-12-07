/*
 * Copyright 2013 the original author or authors.
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
var test = require('testtools');
var vertigo = require('vertigo');

var grouping_tests = {
  testRandomGrouping: function() {
    var network = vertigo.createNetwork('test');
    network.addFeeder('test_verticle1', 'test_verticle1.js', {'foo': 'bar'}, 2);
    network.addWorker('test_verticle2', 'test_verticle2.js', {'bar': 'baz'}).addInput('test_verticle1').randomGrouping();
    test.testComplete();
  },
  testRoundGrouping: function() {
    var network = vertigo.createNetwork('test');
    network.addFeeder('test_verticle1', 'test_verticle1.js', {'foo': 'bar'}, 2);
    network.addWorker('test_verticle2', 'test_verticle2.js', {'bar': 'baz'}).addInput('test_verticle1').roundGrouping();
    test.testComplete();
  },
  testFieldsGrouping: function() {
    var network = vertigo.createNetwork('test');
    network.addFeeder('test_verticle1', 'test_verticle1.js', {'foo': 'bar'}, 2);
    network.addWorker('test_verticle2', 'test_verticle2.js', {'bar': 'baz'}).addInput('test_verticle1').fieldsGrouping('bar');
    test.testComplete();
  },
  testAllGrouping: function() {
	var network = vertigo.createNetwork('test');
    network.addFeeder('test_verticle1', 'test_verticle1.js', {'foo': 'bar'}, 2);
    network.addWorker('test_verticle2', 'test_verticle2.js', {'bar': 'baz'}).addInput('test_verticle1').allGrouping();
    test.testComplete();
  }
}

test.runTests(grouping_tests);

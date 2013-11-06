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
var grouping = require('vertigo/grouping');

var grouping_tests = {
  testRandomGrouping: function() {
    var network = vertigo.createNetwork('test');
    network.addVerticle('test_verticle1', 'test_verticle1.js', {'foo': 'bar'}, 2);
    network.addVerticle('test_verticle2', 'test_verticle2.js', {'bar': 'baz'}).addInput('test_verticle1').groupBy(new grouping.RandomGrouping());
    test.testComplete();
  },
  testRoundGrouping: function() {
    var network = vertigo.createNetwork('test');
    network.addVerticle('test_verticle1', 'test_verticle1.js', {'foo': 'bar'}, 2);
    network.addVerticle('test_verticle2', 'test_verticle2.js', {'bar': 'baz'}).addInput('test_verticle1').groupBy(new grouping.RoundGrouping());
    test.testComplete();
  },
  testFieldsGrouping: function() {
    var network = vertigo.createNetwork('test');
    network.addVerticle('test_verticle1', 'test_verticle1.js', {'foo': 'bar'}, 2);
    network.addVerticle('test_verticle2', 'test_verticle2.js', {'bar': 'baz'}).addInput('test_verticle1').groupBy(new grouping.FieldsGrouping('bar'));
    test.testComplete();
  },
  testAllGrouping: function() {
	var network = vertigo.createNetwork('test');
    network.addVerticle('test_verticle1', 'test_verticle1.js', {'foo': 'bar'}, 2);
    network.addVerticle('test_verticle2', 'test_verticle2.js', {'bar': 'baz'}).addInput('test_verticle1').groupBy(new grouping.AllGrouping());
    test.testComplete();
  }
}

test.runTests(grouping_tests);

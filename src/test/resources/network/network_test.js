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

var network_tests = {
  testCreateNetwork: function() {
    var network = vertigo.createNetwork('test');
    network.enableAcking();
    test.assertTrue(network.ackingEnabled());
    network.disableAcking();
    test.assertFalse(network.ackingEnabled());
    network.numAuditors(4);
    test.assertEquals(4, network.numAuditors());
    network.ackTimeout(10000);
    test.assertEquals(10000, network.ackTimeout());
    test.testComplete();
  },
  testAddSourceFeeder: function() {
    var network = vertigo.createNetwork('test');
    var test_verticle1 = network.addFeeder('test_feeder1', 'test_feeder1.js');
    var test_verticle2 = network.addFeeder('test_feeder2', 'test_feeder2.js', {'foo': 'bar'}, 2);
    test.testComplete();
  },
  testAddSourceExecutor: function() {
    var network = vertigo.createNetwork('test');
    var test_verticle1 = network.addExecutor('test_executor1', 'test_executor1.js');
    var test_verticle2 = network.addExecutor('test_executor2', 'test_executor2.js', {'foo': 'bar'}, 2);
    test.testComplete();
  },
  testAddSourceWorker: function() {
    var network = vertigo.createNetwork('test');
    var test_verticle1 = network.addWorker('test_worker1', 'test_worker1.js');
    var test_verticle2 = network.addWorker('test_worker2', 'test_worker2.js', {'foo': 'bar'}, 2);
    test.testComplete();
  },
  testAddInputVerticle: function() {
    var network = vertigo.createNetwork('test');
    var verticle = network.addFeeder('test_feeder', 'test_feeder.js');
    network.addWorker('test_worker', 'test_worker.js').addInput('test_feeder');
    test.assertTrue(verticle.isVerticle());
    test.testComplete();
  },
  testAddInputModule: function() {
    var network = vertigo.createNetwork('test');
    var module = network.addFeeder('test_feeder', 'net.kuujo~test_feeder~1.0');
    network.addWorker('test_worker', 'net.kuujo~test_worker~1.0').addInput('test_feeder');
    test.assertTrue(module.isModule());
    test.testComplete();
  },
  testAckingFeeder: function() {
    var network = vertigo.createNetwork('test');
    network.addFeeder('test_feeder', 'test_acking_feeder.js', {'foo': 'bar'});
    network.addWorker('test_worker', 'test_acking_worker.js').addInput('test_feeder');
    vertigo.deployLocalNetwork(network, function(error) {
      test.assertNull(error);
    });
  },
  testFailingFeeder: function() {
    var network = vertigo.createNetwork('test');
    network.addFeeder('test_feeder', 'test_failing_feeder.js', {'foo': 'bar'});
    network.addWorker('test_worker', 'test_failing_worker.js').addInput('test_feeder');
    vertigo.deployLocalNetwork(network, function(error) {
      test.assertNull(error);
    });
  },
  testTimeoutFeeder: function() {
    var network = vertigo.createNetwork('test');
    network.ackTimeout(500);
    network.addFeeder('test_feeder', 'test_timeout_feeder.js', {'foo': 'bar'});
    network.addWorker('test_worker', 'test_timeout_worker.js').addInput('test_feeder');
    vertigo.deployLocalNetwork(network, function(error) {
      test.assertNull(error);
    });
  },
  testSimpleHook: function() {
    var network = vertigo.createNetwork('test');
    network.addWorker('test_worker', 'test_acking_worker.js').addHook('start', function(messageid) {
      test.testComplete()
    });
    vertigo.deployLocalNetwork(network, function(error) {
      test.assertNull(error);
    });
  }
}

test.runTests(network_tests);

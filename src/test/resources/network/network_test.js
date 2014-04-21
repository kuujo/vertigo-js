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
var test = require('testtools');
var vertigo = require('vertigo');

var network_tests = {
  testCreateNetwork: function() {
    var network = vertigo.createNetwork('test');
    test.assertEquals('test', network.name());
    var component1 = network.addVerticle('test_component1', 'test_component1.js', 2);
    test.assertEquals('test_component1', component1.name());
    test.assertEquals('test_component1.js', component1.main());
    test.assertEquals(2, component1.instances());
    var component2 = network.addVerticle('test_component2', 'test_component2.js', 4);
    test.assertEquals('test_component2', component2.name());
    test.assertEquals('test_component2.js', component2.main());
    test.assertEquals(4, component2.instances());
    test.testComplete();
  },
  testBasicNetwork: function() {
    var network = vertigo.createNetwork('test-basic');
    network.addVerticle('sender', 'test_basic_sender.js');
    network.addVerticle('receiver', 'test_basic_receiver.js');
    network.createConnection('sender', 'out', 'receiver', 'in');
    vertigo.deployNetwork(network, function(error) {
      test.assertNull(error);
    });
  },
  testGroupNetwork: function() {
    var network = vertigo.createNetwork('test-group');
    network.addVerticle('sender', 'test_group_sender.js');
    network.addVerticle('receiver', 'test_group_receiver.js');
    network.createConnection('sender', 'out', 'receiver', 'in');
    vertigo.deployNetwork(network, function(error) {
      test.assertNull(error);
    });
  }
}

test.runTests(network_tests);

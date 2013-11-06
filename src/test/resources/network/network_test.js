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
var network = require('vertigo/network');
var input = require('vertigo/input');

var network_tests = {
  testCreateNetwork: function() {
    var network = vertigo.createNetwork('test');
    network.enableAcking();
    test.assertTrue(network.ackingEnabled());
    network.disableAcking();
    test.assertFalse(network.ackingEnabled());
    network.numAuditors(4);
    test.assertEquals(4, network.numAuditors());
    network.ackExpire(10000);
    test.assertEquals(10000, network.ackExpire());
    test.testComplete();
  },
  testAddSourceVerticle: function() {
    var network = vertigo.createNetwork('test');
    var test_verticle1 = network.addVerticle('test_verticle1', 'test_verticle1.js');
    var test_verticle2 = network.addVerticle('test_verticle2', 'test_verticle2.js', {'foo': 'bar'}, 2);
    test.testComplete();
  },
  testAddSourceModule: function() {
    var network = vertigo.createNetwork('test');
    var test_module1 = network.addModule('test_module1', 'net.kuujo~test_module1~1.0');
    var test_module2 = network.addModule('test_module2', 'net.kuujo~test_module2~1.0', {'foo': 'bar'}, 2);
    test.testComplete();
  },
  testAddSource: function() {
    var network = vertigo.createNetwork('test');
    var test_verticle1 = network.addVerticle('test_verticle1', 'test_verticle1.js');
    network.addComponent(test_verticle1);
    var test_module1 = network.addModule('test_module1', 'net.kuujo~test_module1~1.0');
    network.addComponent(test_module1);
    test.testComplete();
  },
  testAddTargetVerticle: function() {
    var network = vertigo.createNetwork('test');
    network.addVerticle('test_verticle1', 'test_verticle1.js');
    network.addVerticle('test_verticle2', 'test_verticle2.js').addInput('test_verticle1');
    test.testComplete();
  },
  testAddTargetModule: function() {
    var network = vertigo.createNetwork('test');
    network.addModule('test_module1', 'net.kuujo~test_module1~1.0');
    network.addModule('test_module2', 'net.kuujo~test_module2~1.0').addInput('test_module1');
    test.testComplete();
  },
  testCreateComponent: function() {
    var network = vertigo.createNetwork('test');
    var test_verticle = network.addVerticle('test_verticle', 'test_verticle.js', {'foo': 'bar'}, 2);
    test.assertEquals('verticle', test_verticle.type);
    test.assertEquals('test_verticle.js', test_verticle.main());
    test.assertEquals('bar', test_verticle.config()['foo']);
    test.assertEquals(2, test_verticle.instances());
    test.testComplete();
  }
}

test.runTests(network_tests);

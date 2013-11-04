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

var cluster_tests = {
  testLocalDeploy: function() {
    var cluster = vertigo.createLocalCluster();
    var network = vertigo.createNetwork('test');
    network.addVerticle('test_feeder', 'test_basic_feeder.js');
    network.addVerticle('test_worker', 'test_acking_worker.js', 2).addInput('test_feeder');
    cluster.deploy(network, function(error, context) {
      test.assertNull(error);
      test.assertNotNull(context);
      test.testComplete();
    });
  },
  testLocalShutdown: function() {
    var cluster = vertigo.createLocalCluster();
    var network = vertigo.createNetwork('test');
    network.addVerticle('test_feeder', 'test_basic_feeder.js');
    network.addVerticle('test_worker', 'test_acking_worker.js', 2).addInput('test_feeder');
    cluster.deploy(network, function(error, context) {
      test.assertNull(error);
      test.assertNotNull(context);
      cluster.shutdown(context, function(error) {
        test.assertNull(error);
        test.testComplete();
      });
    });
  }
}

test.runTests(cluster_tests);

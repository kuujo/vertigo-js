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
var context = require('vertigo/context');

var network_tests = {
  checkContext: function(network) {
    test.assertNotNull(network.address());
    test.assertTrue(network.auditors() instanceof Array);
    test.assertTrue(typeof(network.ackingEnabled()) == 'boolean');
    test.assertTrue(typeof(network.components()) === 'object');

    var components = network.components();
    for (var address in components) {
      var component = network.component(address);
      test.assertTrue(component.address() == address);
      test.assertTrue(component.address() == components[address].address());
      test.assertNotNull(component.type());
      test.assertTrue(component.isModule() || component.isVerticle());
      if (component.isModule()) {
        test.assertTrue(component instanceof context.ModuleContext);
        test.assertTrue(component.module() != null)
      }
      else if (component.isVerticle()) {
        test.assertTrue(component instanceof context.VerticleContext);
        test.assertTrue(component.main() != null);
      }
      test.assertNotNull(component.config());
      test.assertTrue(component.network() instanceof context.NetworkContext);
      test.assertEquals(network.address(), component.network().address());
      test.assertTrue(component.instances() instanceof Array);
      var instances = component.instances();
      for (var i = 0; i < instances.length; i++) {
        var instance = instances[i];
        test.assertNotNull(instance.id());
        test.assertNotNull(instance.componentContext());
        test.assertEquals(component.address(), instance.component().address());
        test.assertEquals(network.address(), instance.component().network().address());
      }
    }
  },
  testCreateNetwork: function() {
    var network = vertigo.createNetwork('test');
    test.assertEquals('test', network.address());
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
  testAddFeeder: function() {
    var network = vertigo.createNetwork('test');
    var test_verticle1 = network.addFeeder('test_feeder1', 'test_feeder1.js');
    test.assertEquals('test_feeder1', test_verticle1.address());
    test.assertEquals('feeder', test_verticle1.type());
    test.assertTrue(test_verticle1.isVerticle());
    test.assertFalse(test_verticle1.isModule());
    var test_verticle2 = network.addFeeder('test_feeder2', 'test_feeder2.js', {'foo': 'bar'}, 2);
    test.assertEquals('test_feeder2', test_verticle2.address());
    test.assertEquals('feeder', test_verticle2.type());
    test.assertTrue(test_verticle2.isVerticle());
    test.assertFalse(test_verticle2.isModule());
    test.testComplete();
  },
  testAddFeederModule: function() {
    var network = vertigo.createNetwork('test');
    var test_module1 = network.addFeederModule('test_feeder1', 'com.test~foo~0.1');
    test.assertEquals('test_feeder1', test_module1.address());
    test.assertEquals('feeder', test_module1.type());
    test.assertFalse(test_module1.isVerticle());
    test.assertTrue(test_module1.isModule());
    test.assertTrue(test_module1.module() == 'com.test~foo~0.1');
    test.assertTrue(test_module1.main === undefined);
    var test_module2 = network.addFeederModule('test_feeder2', 'com.test~foo~0.1', {'foo': 'bar'}, 2);
    test.assertEquals('test_feeder2', test_module2.address());
    test.assertEquals('feeder', test_module2.type());
    test.assertFalse(test_module2.isVerticle());
    test.assertTrue(test_module2.isModule());
    test.assertTrue(test_module2.module() == 'com.test~foo~0.1');
    test.assertTrue(test_module2.main === undefined);
    test.testComplete();
  },
  testAddFeederVerticle: function() {
    var network = vertigo.createNetwork('test');
    var test_verticle1 = network.addFeederVerticle('test_feeder1', 'test_feeder1.js');
    test.assertEquals('test_feeder1', test_verticle1.address());
    test.assertEquals('feeder', test_verticle1.type());
    test.assertTrue(test_verticle1.isVerticle());
    test.assertFalse(test_verticle1.isModule());
    test.assertTrue(test_verticle1.main() == 'test_feeder1.js');
    test.assertTrue(test_verticle1.module === undefined);
    var test_verticle2 = network.addFeederVerticle('test_feeder2', 'test_feeder2.js', {'foo': 'bar'}, 2);
    test.assertEquals('test_feeder2', test_verticle2.address());
    test.assertEquals('feeder', test_verticle2.type());
    test.assertTrue(test_verticle2.isVerticle());
    test.assertFalse(test_verticle2.isModule());
    test.assertTrue(test_verticle2.main() == 'test_feeder2.js');
    test.assertTrue(test_verticle2.module === undefined);
    test.assertFalse(test_verticle2.worker());
    test_verticle2.worker(true);
    test.assertTrue(test_verticle2.worker());
    test.assertFalse(test_verticle2.multiThreaded());
    test_verticle2.multiThreaded(true);
    test.assertTrue(test_verticle2.multiThreaded());
    test.testComplete();
  },
  testAddExecutor: function() {
    var network = vertigo.createNetwork('test');
    var test_verticle1 = network.addExecutor('test_executor1', 'test_executor1.js');
    test.assertEquals('test_executor1', test_verticle1.address());
    test.assertEquals('executor', test_verticle1.type());
    test.assertTrue(test_verticle1.isVerticle());
    test.assertFalse(test_verticle1.isModule());
    var test_verticle2 = network.addExecutor('test_executor2', 'test_executor2.js', {'foo': 'bar'}, 2);
    test.assertEquals('test_executor2', test_verticle2.address());
    test.assertEquals('executor', test_verticle2.type());
    test.assertTrue(test_verticle2.isVerticle());
    test.assertFalse(test_verticle2.isModule());
    test.testComplete();
  },
  testAddExecutorModule: function() {
    var network = vertigo.createNetwork('test');
    var test_module1 = network.addExecutorModule('test_executor1', 'com.test~foo~0.1');
    test.assertEquals('test_executor1', test_module1.address());
    test.assertEquals('executor', test_module1.type());
    test.assertFalse(test_module1.isVerticle());
    test.assertTrue(test_module1.isModule());
    test.assertTrue(test_module1.module() == 'com.test~foo~0.1');
    test.assertTrue(test_module1.main === undefined);
    var test_module2 = network.addExecutorModule('test_executor2', 'com.test~foo~0.1', {'foo': 'bar'}, 2);
    test.assertEquals('test_executor2', test_module2.address());
    test.assertEquals('executor', test_module2.type());
    test.assertFalse(test_module2.isVerticle());
    test.assertTrue(test_module2.isModule());
    test.assertTrue(test_module2.module() == 'com.test~foo~0.1');
    test.assertTrue(test_module2.main === undefined);
    test.testComplete();
  },
  testAddExecutorVerticle: function() {
    var network = vertigo.createNetwork('test');
    var test_verticle1 = network.addExecutorVerticle('test_executor1', 'test_executor1.js');
    test.assertEquals('test_executor1', test_verticle1.address());
    test.assertEquals('executor', test_verticle1.type());
    test.assertTrue(test_verticle1.isVerticle());
    test.assertFalse(test_verticle1.isModule());
    test.assertTrue(test_verticle1.main() == 'test_executor1.js');
    test.assertTrue(test_verticle1.module === undefined);
    var test_verticle2 = network.addExecutorVerticle('test_executor2', 'test_executor2.js', {'foo': 'bar'}, 2);
    test.assertEquals('test_executor2', test_verticle2.address());
    test.assertEquals('executor', test_verticle2.type());
    test.assertTrue(test_verticle2.isVerticle());
    test.assertFalse(test_verticle2.isModule());
    test.assertTrue(test_verticle2.main() == 'test_executor2.js');
    test.assertTrue(test_verticle2.module === undefined);
    test.assertFalse(test_verticle2.worker());
    test_verticle2.worker(true);
    test.assertTrue(test_verticle2.worker());
    test.assertFalse(test_verticle2.multiThreaded());
    test_verticle2.multiThreaded(true);
    test.assertTrue(test_verticle2.multiThreaded());
    test.testComplete();
  },
  testAddWorker: function() {
    var network = vertigo.createNetwork('test');
    var test_verticle1 = network.addWorker('test_worker1', 'test_worker1.js');
    test.assertEquals('test_worker1', test_verticle1.address());
    test.assertEquals('worker', test_verticle1.type());
    test.assertTrue(test_verticle1.isVerticle());
    test.assertFalse(test_verticle1.isModule());
    var test_verticle2 = network.addWorker('test_worker2', 'test_worker2.js', {'foo': 'bar'}, 2);
    test.assertEquals('test_worker2', test_verticle2.address());
    test.assertEquals('worker', test_verticle2.type());
    test.assertTrue(test_verticle2.isVerticle());
    test.assertFalse(test_verticle2.isModule());
    test.testComplete();
  },
  testAddWorkerModule: function() {
    var network = vertigo.createNetwork('test');
    var test_module1 = network.addWorkerModule('test_worker1', 'com.test~foo~0.1');
    test.assertEquals('test_worker1', test_module1.address());
    test.assertEquals('worker', test_module1.type());
    test.assertFalse(test_module1.isVerticle());
    test.assertTrue(test_module1.isModule());
    test.assertTrue(test_module1.module() == 'com.test~foo~0.1');
    test.assertTrue(test_module1.main === undefined);
    var test_module2 = network.addWorkerModule('test_worker2', 'com.test~foo~0.1', {'foo': 'bar'}, 2);
    test.assertEquals('test_worker2', test_module2.address());
    test.assertEquals('worker', test_module2.type());
    test.assertFalse(test_module2.isVerticle());
    test.assertTrue(test_module2.isModule());
    test.assertTrue(test_module2.module() == 'com.test~foo~0.1');
    test.assertTrue(test_module2.main === undefined);
    test.testComplete();
  },
  testAddWorkerVerticle: function() {
    var network = vertigo.createNetwork('test');
    var test_verticle1 = network.addWorkerVerticle('test_worker1', 'test_worker1.js');
    test.assertEquals('test_worker1', test_verticle1.address());
    test.assertEquals('worker', test_verticle1.type());
    test.assertTrue(test_verticle1.isVerticle());
    test.assertFalse(test_verticle1.isModule());
    test.assertTrue(test_verticle1.main() == 'test_worker1.js');
    test.assertTrue(test_verticle1.module === undefined);
    var test_verticle2 = network.addWorkerVerticle('test_worker2', 'test_worker2.js', {'foo': 'bar'}, 2);
    test.assertEquals('test_worker2', test_verticle2.address());
    test.assertEquals('worker', test_verticle2.type());
    test.assertTrue(test_verticle2.isVerticle());
    test.assertFalse(test_verticle2.isModule());
    test.assertTrue(test_verticle2.main() == 'test_worker2.js');
    test.assertTrue(test_verticle2.module === undefined);
    test.assertFalse(test_verticle2.worker());
    test_verticle2.worker(true);
    test.assertTrue(test_verticle2.worker());
    test.assertFalse(test_verticle2.multiThreaded());
    test_verticle2.multiThreaded(true);
    test.assertTrue(test_verticle2.multiThreaded());
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
    var module = network.addFeeder('test_feeder', 'net.kuujo~test_feeder~1.0', {foo: 'bar'}, 2);
    test.assertEquals('bar', module.config()['foo']);
    test.assertEquals(2, module.instances());
    network.addWorker('test_worker', 'net.kuujo~test_worker~1.0').addInput('test_feeder');
    test.assertTrue(module.isModule());
    test.testComplete();
  },
  testAckingFeeder: function() {
    var network = vertigo.createNetwork('test');
    network.addFeeder('test_feeder', 'test_acking_feeder.js', {'foo': 'bar'});
    network.addWorker('test_worker', 'test_acking_worker.js').addInput('test_feeder', 'foo');
    var that = this;
    vertigo.deployLocalNetwork(network, function(error, context) {
      test.assertNull(error);
      that.checkContext(context);
    });
  },
  testFailingFeeder: function() {
    var network = vertigo.createNetwork('test');
    network.addFeeder('test_feeder', 'test_failing_feeder.js', {'foo': 'bar'});
    network.addWorker('test_worker', 'test_failing_worker.js').addInput('test_feeder');
    var that = this;
    vertigo.deployLocalNetwork(network, function(error, context) {
      test.assertNull(error);
      that.checkContext(context);
    });
  },
  testTimeoutFeeder: function() {
    var network = vertigo.createNetwork('test');
    network.ackTimeout(500);
    network.addFeeder('test_feeder', 'test_timeout_feeder.js', {'foo': 'bar'});
    network.addWorker('test_worker', 'test_timeout_worker.js').addInput('test_feeder');
    var that = this;
    vertigo.deployLocalNetwork(network, function(error, context) {
      test.assertNull(error);
      that.checkContext(context);
    });
  },
  testAckingExecutor: function() {
    var network = vertigo.createNetwork('test');
    network.addExecutor('test_executor', 'test_acking_executor.js').addInput('test_worker');
    network.addWorker('test_worker', 'test_acking_worker.js').addInput('test_executor');
    var that = this;
    vertigo.deployLocalNetwork(network, function(error, context) {
      test.assertNull(error);
      that.checkContext(context);
    });
  },
  testFailingExecutor: function() {
    var network = vertigo.createNetwork('test');
    network.addExecutor('test_executor', 'test_failing_executor.js').addInput('test_worker');
    network.addWorker('test_worker', 'test_failing_worker.js').addInput('test_executor');
    var that = this;
    vertigo.deployLocalNetwork(network, function(error, context) {
      test.assertNull(error);
      that.checkContext(context);
    });
  },
  testTimeoutExecutor: function() {
    var network = vertigo.createNetwork('test');
    network.ackTimeout(500);
    network.addExecutor('test_executor', 'test_timeout_executor.js').addInput('test_worker');
    network.addWorker('test_worker', 'test_timeout_worker.js').addInput('test_executor');
    var that = this;
    vertigo.deployLocalNetwork(network, function(error, context) {
      test.assertNull(error);
      that.checkContext(context);
    });
  },
  testNestedNetwork: function() {
    var network1 = vertigo.createNetwork('test1');
    network1.addFeederVerticle('test1.feeder', 'test_periodic_feeder.js');
    var that = this;
    vertigo.deployLocalNetwork(network1, function(error, context) {
      test.assertNull(error);
      that.checkContext(context);
      var network2 = vertigo.createNetwork('test2');
      network2.addWorkerVerticle('test2.worker', 'test_completing_worker.js').addInput('test1.feeder');
      vertigo.deployLocalNetwork(network2, function(error) {
        test.assertNull(error);
        that.checkContext(context);
      });
    });
  },
  testSimpleHook: function() {
    var network = vertigo.createNetwork('test');
    network.addWorkerVerticle('test_worker', 'test_acking_worker.js').addHook('start', function(messageid) {
      test.testComplete()
    });
    var that = this;
    vertigo.deployLocalNetwork(network, function(error, context) {
      test.assertNull(error);
      that.checkContext(context);
    });
  }
}

test.runTests(network_tests);

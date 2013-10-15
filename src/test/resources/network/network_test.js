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
    network.ackExpire(10000);
    test.assertEquals(10000, network.ackExpire());
    test.testComplete();
  },
  testAddSourceVerticle: function() {
    var network = vertigo.createNetwork('test');
    var test_verticle1 = network.fromVerticle('test_verticle1', 'test_verticle1.js');
    var test_verticle2 = network.fromVerticle('test_verticle2', 'test_verticle2.js', {'foo': 'bar'}, 2);
    test.testComplete();
  },
  testAddSourceModule: function() {
    var network = vertigo.createNetwork('test');
    var test_module1 = network.fromModule('test_module1', 'net.kuujo~test_module1~1.0');
    var test_module2 = network.fromModule('test_module2', 'net.kuujo~test_module2~1.0', {'foo': 'bar'}, 2);
    test.testComplete();
  },
  testAddSource: function() {
    var network = vertigo.createNetwork('test');
    var test_verticle1 = network.fromVerticle('test_verticle1', 'test_verticle1.js');
    network.from(test_verticle1);
    var test_module1 = network.fromModule('test_module1', 'net.kuujo~test_module1~1.0');
    network.from(test_module1);
    test.testComplete();
  },
  testAddTargetVerticle: function() {
    var network = vertigo.createNetwork('test');
    network.fromVerticle('test_verticle1', 'test_verticle1.js')
      .toVerticle('test_verticle2', 'test_verticle2.js');
    test.testComplete();
  },
  testAddTargetModule: function() {
    var network = vertigo.createNetwork('test');
    network.fromModule('test_module1', 'net.kuujo~test_module1~1.0')
      .toModule('test_module2', 'net.kuujo~test_module2~1.0');
    test.testComplete();
  },
  testCreateComponent: function() {
    var network = vertigo.createNetwork('test');
    var test_verticle = network.fromVerticle('test_verticle', 'test_verticle.js', {'foo': 'bar'}, 2);
    test.assertEquals('verticle', test_verticle.type());
    test.assertEquals('test_verticle.js', test_verticle.main());
    test.assertEquals('bar', test_verticle.config()['foo']);
    test.assertEquals(2, test_verticle.workers());
    test.testComplete();
  }
}

test.runTests(network_tests);

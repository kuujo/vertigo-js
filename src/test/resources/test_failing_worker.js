var vertigo = require('vertigo');
var test = require('testtools');

vertigo.createWorker().start(function(error, worker) {
  test.assertNull(error);
  worker.messageHandler(function(message) {
    var config = worker.config;
    if (config['validate'] !== undefined) {
      test.assertEquals(config['validate'], message.body);
    }
    worker.fail(message);
  });
});

var vertigo = require('vertigo');
var test = require('testtools');

vertigo.createStreamExecutor().start(function(error, executor) {
  test.assertNull(error);
  var paused = false;
  executor.fullHandler(function() {
    paused = true;
  });
  executor.drainHandler(function() {
    paused = false;
  });
  executor.execute(executor.config['input'], function(error, result) {
    test.assertNull(error);
    test.assertEquals(executor.config['output'], result.body);
  });
});

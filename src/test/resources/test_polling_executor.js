var vertigo = require('vertigo');
var test = require('testtools');

vertigo.createPollingExecutor().start(function(error, executor) {
  test.assertNull(error);
  executor.executeHandler(function(executor) {
    executor.execute(executor.config['input'], function(error, result) {
      test.assertNull(error);
      test.assertEquals(executor.config['output'], result.body);
    });
  });
});

var vertigo = require('vertigo');
var test = require('testtools');

vertigo.createBasicExecutor().start(function(error, executor) {
  test.assertNull(error);
  executor.execute(executor.config['input'], function(error, result) {
    test.assertNull(error);
    test.assertEquals(executor.config['output'], result.body);
  });
});

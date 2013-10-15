var vertigo = require('vertigo');
var test = require('testtools');

vertigo.createBasicFeeder().start(function(error, feeder) {
  test.assertNull(error);
  feeder.feed(feeder.config, function(error) {
    test.assertNull(error);
  });
});

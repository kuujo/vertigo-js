var vertigo = require('vertigo');
var test = require('testtools');

vertigo.createPollingFeeder().start(function(error, feeder) {
  test.assertNull(error);
  feeder.feedHandler(function(feeder) {
    feeder.feed(feeder.config, function(error) {
      test.assertNull(error);
    });
  });
});

var vertigo = require('vertigo');
var test = require('testtools');

vertigo.createStreamFeeder().start(function(error, feeder) {
  test.assertNull(error);
  var paused = false;
  feeder.fullHandler(function() {
    paused = true;
  });
  feeder.drainHandler(function() {
    paused = false;
  });
  feeder.feed(feeder.config, function(error) {
    test.assertNull(error);
  });
});

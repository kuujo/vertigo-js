var testtools = {};

testtools.runTests = function(tests) {
  org.vertx.testtools.VertxAssert.initialize(__jvertx);
  var method = __jcontainer.config().getString('methodName');
  tests[method]();
}

testtools.testComplete = function() {
  org.vertx.testtools.VertxAssert.testComplete();
}

function convertValue(value) {
  var type = typeof value;
  switch (type) {
    case 'string':
    case 'boolean':
    case 'undefined':
    case 'org.vertx.java.core.buffer.Buffer':
      break;
    case 'number':
      value = new java.lang.Double(value);
      break;
    case 'object':
      // If null then we just wrap it as an empty JSON message
      // We don't do this if it's a Java class (it has the getClass) method
      // since it may be a Buffer which we want to let through
      if (value == null || typeof value.getClass === "undefined") {
        // Not a Java object - assume JSON message
        value = new org.vertx.java.core.json.JsonObject(JSON.stringify(value));
      }
      break;
    default:
      throw 'Invalid type for message: ' + value;
  }
  return value;
}

testtools.assertTrue = function(expression, message) {
  if (message === undefined) {
    org.vertx.testtools.VertxAssert.assertTrue(expression);
  }
  else {
    org.vertx.testtools.VertxAssert.assertTrue(message, expression);
  }
}

testtools.assertFalse = function(expression, message) {
  if (message === undefined) {
    org.vertx.testtools.VertxAssert.assertFalse(expression);
  }
  else {
    org.vertx.testtools.VertxAssert.assertFalse(message, expression);
  }
}

testtools.assertNull = function(expression, message) {
  if (message === undefined) {
    org.vertx.testtools.VertxAssert.assertNull(expression);
  }
  else {
    org.vertx.testtools.VertxAssert.assertNull(message, expression);
  }
}

testtools.assertNotNull = function(expression, message) {
  if (message === undefined) {
    org.vertx.testtools.VertxAssert.assertNotNull(expression);
  }
  else {
    org.vertx.testtools.VertxAssert.assertNotNull(message, expression);
  }
}

testtools.assertEquals = function(expected, actual, message) {
  if (message === undefined) {
    org.vertx.testtools.VertxAssert.assertEquals(convertValue(expected), convertValue(actual));
  }
  else {
    org.vertx.testtools.VertxAssert.assertEquals(message, convertValue(expected), convertValue(actual));
  }
}

module.exports = testtools;

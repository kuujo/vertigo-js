load('vertx/helpers.js');

var feeder = {};

feeder.BasicFeeder = function() {

  var that = this;
  var jfeeder = new net.kuujo.vertigo.component.feeder.DefaultBasicFeeder(__jvertx, __jcontainer, new net.kuujo.vertigo.context.WorkerContext(__jcontainer.config()));

  this.maxQueueSize = function(size) {
    if (size === undefined) {
      return jfeeder.getMaxQueueSize();
    }
    else {
      jfeeder.setMaxQueueSize(size);
      return that;
    }
  }

  this.queueFull = function() {
    return jfeeder.queueFull();
  }

  this.autoRetry = function(retry) {
    if (retry === undefined) {
      return jfeeder.isAutoRetry();
    }
    else {
      jfeeder.setAutoRetry(retry);
      return that;
    }
  }

  this.retryAttempts = function(attempts) {
    if (attempts === undefined) {
      return jfeeder.getRetryAttempts();
    }
    else {
      jfeeder.setRetryAttempts(attempts);
      return that;
    }
  }

  this.start = function(handler) {
    if (handler) {
      handler = adaptAsyncResultHandler(handler, function(result) {
        return that;
      });
      jfeeder.start(handler);
    }
    else {
      jfeeder.start();
    }
    return that;
  }

  this.feed = function() {
    var args = Array.prototype.slice.call(arguments);
    var data = getArgValue('object', args);
    var tag = getArgValue('string', args);
    var handler = getArgValue('function', args);
    if (handler) {
      handler = adaptAsyncResultHandler(handler);
    }
    jfeeder.feed(data, tag, handler);
    return that;
  }

}

feeder.PollingFeeder = function() {

  var that = this;
  var jfeeder = new net.kuujo.vertigo.component.feeder.DefaultPollingFeeder(__jvertx, __jcontainer, new net.kuujo.vertigo.context.WorkerContext(__jcontainer.config()));

  this.maxQueueSize = function(size) {
    if (size === undefined) {
      return jfeeder.getMaxQueueSize();
    }
    else {
      jfeeder.setMaxQueueSize(size);
      return that;
    }
  }

  this.queueFull = function() {
    return jfeeder.queueFull();
  }

  this.autoRetry = function(retry) {
    if (retry === undefined) {
      return jfeeder.isAutoRetry();
    }
    else {
      jfeeder.setAutoRetry(retry);
      return that;
    }
  }

  this.retryAttempts = function(attempts) {
    if (attempts === undefined) {
      return jfeeder.getRetryAttempts();
    }
    else {
      jfeeder.setRetryAttempts(attempts);
      return that;
    }
  }

  this.feedDelay = function(delay) {
    if (delay === undefined) {
      return jfeeder.getFeedDelay();
    }
    else {
      jfeeder.setFeedDelay(delay);
      return that;
    }
  }

  this.start = function(handler) {
    if (handler) {
      handler = adaptAsyncResultHandler(handler, function(result) {
        return that;
      });
      jfeeder.start(handler);
    }
    else {
      jfeeder.start();
    }
    return that;
  }

  this.feedHandler = function(handler) {
    jfeeder.feedHandler(function(feeder) {
      handler(that);
    });
    return that;
  }

  this.feed = function() {
    var args = Array.prototype.slice.call(arguments);
    var data = getArgValue('object', args);
    var tag = getArgValue('string', args);
    var handler = getArgValue('function', args);
    if (handler) {
      handler = adaptAsyncResultHandler(handler);
    }
    jfeeder.feed(new org.vertx.java.core.json.JsonObject(JSON.stringify(data)), tag, handler);
    return that;
  }

}

feeder.StreamFeeder = function() {

  var that = this;
  var jfeeder = new net.kuujo.vertigo.component.feeder.DefaultStreamFeeder(__jvertx, __jcontainer, new net.kuujo.vertigo.context.WorkerContext(__jcontainer.config()));

  this.maxQueueSize = function(size) {
    if (size === undefined) {
      return jfeeder.getMaxQueueSize();
    }
    else {
      jfeeder.setMaxQueueSize(size);
      return that;
    }
  }

  this.queueFull = function() {
    return jfeeder.queueFull();
  }

  this.autoRetry = function(retry) {
    if (retry === undefined) {
      return jfeeder.isAutoRetry();
    }
    else {
      jfeeder.setAutoRetry(retry);
      return that;
    }
  }

  this.retryAttempts = function(attempts) {
    if (attempts === undefined) {
      return jfeeder.getRetryAttempts();
    }
    else {
      jfeeder.setRetryAttempts(attempts);
      return that;
    }
  }

  this.start = function(handler) {
    if (handler) {
      handler = adaptAsyncResultHandler(handler, function(result) {
        return that;
      });
      jfeeder.start(handler);
    }
    else {
      jfeeder.start();
    }
    return that;
  }

  this.fullHandler = function(handler) {
    jfeeder.fullHandler(handler);
    return that;
  }

  this.drainHandler = function(handler) {
    jfeeder.drainHandler(handler);
    return that;
  }

  this.feed = function() {
    var args = Array.prototype.slice.call(arguments);
    var data = getArgValue('object', args);
    var tag = getArgValue('string', args);
    var handler = getArgValue('function', args);
    if (handler) {
      handler = adaptAsyncResultHandler(handler);
    }
    jfeeder.feed(new org.vertx.java.core.json.JsonObject(JSON.stringify(data)), tag, handler);
    return that;
  }

}

module.exports = feeder;

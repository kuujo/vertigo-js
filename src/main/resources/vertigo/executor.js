load('vertx/helpers.js');

var executor = {};

/**
 * Wraps a Java JsonMessage.
 */
function wrap_message(jmessage) {
  var message = {};
  message.__jmessage = jmessage;
  message.id = jmessage.id();
  message.body = JSON.parse(jmessage.body().encode());
  message.tag = jmessage.tag();
  message.parent = jmessage.parent();
  message.ancestor = jmessage.ancestor();
  message.source = jmessage.source();
  message.auditor = jmessage.auditor();
  message.copy = function() {
    return wrap_message(jmessage.copy());
  }
  return message;
}

executor.BasicExecutor = function() {

  var that = this;
  var jexecutor = new net.kuujo.vertigo.component.executor.DefaultBasicExecutor(__jvertx, __jcontainer, new net.kuujo.vertigo.context.WorkerContext(__jcontainer.config()));

  this.maxQueueSize = function(size) {
    if (size === undefined) {
      return jexecutor.getMaxQueueSize();
    }
    else {
      jexecutor.setMaxQueueSize(size);
      return that;
    }
  }

  this.queueFull = function() {
    return jexecutor.queueFull();
  }

  this.start = function(handler) {
    if (handler) {
      handler = adaptAsyncResultHandler(handler, function(result) {
        return that;
      });
      jexecutor.start(handler);
    }
    else {
      jexecutor.start();
    }
    return that;
  }

  this.execute = function() {
    var args = Array.prototype.slice.call(arguments);
    var data = getArgValue('object', args);
    var tag = getArgValue('string', args);
    var handler = getArgValue('function', args);
    if (handler) {
      handler = adaptAsyncResultHandler(handler, function(jmessage) {
        return wrap_message(jmessage);
      });
    }
    jexecutor.execute(new org.vertx.java.core.json.JsonObject(JSON.stringify(data)), tag, handler);
    return that;
  }

}

executor.PollingExecutor = function() {

  var that = this;
  var jexecutor = new net.kuujo.vertigo.component.executor.DefaultPollingExecutor(__jvertx, __jcontainer, new net.kuujo.vertigo.context.WorkerContext(__jcontainer.config()));

  this.maxQueueSize = function(size) {
    if (size === undefined) {
      return jexecutor.getMaxQueueSize();
    }
    else {
      jexecutor.setMaxQueueSize(size);
      return that;
    }
  }

  this.queueFull = function() {
    return jexecutor.queueFull();
  }

  this.executeDelay = function(delay) {
    if (delay === undefined) {
      return jexecutor.getExecuteDelay();
    }
    else {
      jexecutor.setExecuteDelay(delay);
      return that;
    }
  }

  this.start = function(handler) {
    if (handler) {
      handler = adaptAsyncResultHandler(handler, function(result) {
        return that;
      });
      jexecutor.start(handler);
    }
    else {
      jexecutor.start();
    }
    return that;
  }

  this.executeHandler = function(handler) {
    jexecutor.executeHandler(function(executor) {
      handler(that);
    });
    return that;
  }

  this.execute = function() {
    var args = Array.prototype.slice.call(arguments);
    var data = getArgValue('object', args);
    var tag = getArgValue('string', args);
    var handler = getArgValue('function', args);
    if (handler) {
      handler = adaptAsyncResultHandler(handler, function(jmessage) {
        return wrap_message(jmessage);
      });
    }
    jexecutor.execute(new org.vertx.java.core.json.JsonObject(JSON.stringify(data)), tag, handler);
    return that;
  }

}

executor.StreamExecutor = function() {

  var that = this;
  var jexecutor = new net.kuujo.vertigo.component.executor.DefaultStreamExecutor(__jvertx, __jcontainer, new net.kuujo.vertigo.context.WorkerContext(__jcontainer.config()));

  this.maxQueueSize = function(size) {
    if (size === undefined) {
      return jexecutor.getMaxQueueSize();
    }
    else {
      jexecutor.setMaxQueueSize(size);
      return that;
    }
  }

  this.queueFull = function() {
    return jexecutor.queueFull();
  }

  this.start = function(handler) {
    if (handler) {
      handler = adaptAsyncResultHandler(handler, function(result) {
        return that;
      });
      jexecutor.start(handler);
    }
    else {
      jexecutor.start();
    }
    return that;
  }

  this.fullHandler = function(handler) {
    jexecutor.fullHandler(handler);
    return that;
  }

  this.drainHandler = function(handler) {
    jexecutor.drainHandler(handler);
    return that;
  }

  this.execute = function() {
    var args = Array.prototype.slice.call(arguments);
    var data = getArgValue('object', args);
    var tag = getArgValue('string', args);
    var handler = getArgValue('function', args);
    if (handler) {
      handler = adaptAsyncResultHandler(handler, function(jmessage) {
        return wrap_message(jmessage);
      });
    }
    jexecutor.execute(new org.vertx.java.core.json.JsonObject(JSON.stringify(data)), tag, handler);
    return that;
  }

}

module.exports = executor;

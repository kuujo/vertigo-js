/*
 * Copyright 2013 the original author or authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
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

/**
 * A basic executor.
 */
executor.BasicExecutor = function() {
  var that = this;
  var context = __jcontainer.config().getObject('__context__');
  __jcontainer.config().removeField('__context__');
  var jexecutor = new net.kuujo.vertigo.executor.DefaultBasicExecutor(__jvertx, __jcontainer, net.kuujo.vertigo.context.InstanceContext.fromJson(context));

  var config = jexecutor.config();
  if (config != null) {
    this.config = JSON.parse(config.encode());
  }
  else {
    this.config = {};
  }

  /**
   * Sets or gets the maximum execute queue size.
   */
  this.maxQueueSize = function(size) {
    if (size === undefined) {
      return jexecutor.getMaxQueueSize();
    }
    else {
      jexecutor.setMaxQueueSize(size);
      return that;
    }
  }

  /**
   * Indicates whether the execute queue is full.
   */
  this.queueFull = function() {
    return jexecutor.queueFull();
  }

  /**
   * Starts the executor.
   */
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

  /**
   * Executes a remote procedure call.
   */
  this.execute = function(data) {
    var args = Array.prototype.slice.call(arguments);
    args.shift();
    var handler = getArgValue('function', args);
    var tag = getArgValue('string', args);

    if (handler) {
      handler = adaptAsyncResultHandler(handler, function(jmessage) {
        return wrap_message(jmessage);
      });
    }
    else {
      throw 'Invalid execute() handler.';
    }

    if (typeof(data) != 'object') {
      throw 'Invalid data type for execute()';
    }
    else if (tag != null) {
      jexecutor.execute(new org.vertx.java.core.json.JsonObject(JSON.stringify(data)), tag, handler);
    }
    else {
      jexecutor.execute(new org.vertx.java.core.json.JsonObject(JSON.stringify(data)), handler);
    }
    return that;
  }

}

/**
 * A polling executor.
 */
executor.PollingExecutor = function() {
  var that = this;
  var context = __jcontainer.config().getObject('__context__');
  __jcontainer.config().removeField('__context__');
  var jexecutor = new net.kuujo.vertigo.executor.DefaultPollingExecutor(__jvertx, __jcontainer, net.kuujo.vertigo.context.InstanceContext.fromJson(context));

  var config = jexecutor.config();
  if (config != null) {
    this.config = JSON.parse(config.encode());
  }
  else {
    this.config = {};
  }

  /**
   * Sets or gets the maximum execute queue size.
   */
  this.maxQueueSize = function(size) {
    if (size === undefined) {
      return jexecutor.getMaxQueueSize();
    }
    else {
      jexecutor.setMaxQueueSize(size);
      return that;
    }
  }

  /**
   * Indicates whether the execute queue is full.
   */
  this.queueFull = function() {
    return jexecutor.queueFull();
  }

  /**
   * Sets the execution delay when no executions occur.
   */
  this.executeDelay = function(delay) {
    if (delay === undefined) {
      return jexecutor.getExecuteDelay();
    }
    else {
      jexecutor.setExecuteDelay(delay);
      return that;
    }
  }

  /**
   * Starts the executor.
   */
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

  /**
   * Sets an execute handler on the executor.
   */
  this.executeHandler = function(handler) {
    jexecutor.executeHandler(function(executor) {
      handler(that);
    });
    return that;
  }

  /**
   * Executes a remote procedure call.
   */
  this.execute = function(data) {
    var args = Array.prototype.slice.call(arguments);
    args.shift();
    var handler = getArgValue('function', args);
    var tag = getArgValue('string', args);

    if (handler) {
      handler = adaptAsyncResultHandler(handler, function(jmessage) {
        return wrap_message(jmessage);
      });
    }
    else {
      throw 'Invalid execute() handler.';
    }

    if (typeof(data) != 'object') {
      throw 'Invalid data type for execute()';
    }
    else if (tag != null) {
      jexecutor.execute(new org.vertx.java.core.json.JsonObject(JSON.stringify(data)), tag, handler);
    }
    else {
      jexecutor.execute(new org.vertx.java.core.json.JsonObject(JSON.stringify(data)), handler);
    }
    return that;
  }

}

/**
 * A ReadStream integration executor.
 */
executor.StreamExecutor = function() {
  var that = this;
  var context = __jcontainer.config().getObject('__context__');
  __jcontainer.config().removeField('__context__');
  var jexecutor = new net.kuujo.vertigo.executor.DefaultStreamExecutor(__jvertx, __jcontainer, net.kuujo.vertigo.context.InstanceContext.fromJson(context));

  var config = jexecutor.config();
  if (config != null) {
    this.config = JSON.parse(config.encode());
  }
  else {
    this.config = {};
  }

  /**
   * Sets or gets the maximum executor queue size.
   */
  this.maxQueueSize = function(size) {
    if (size === undefined) {
      return jexecutor.getMaxQueueSize();
    }
    else {
      jexecutor.setMaxQueueSize(size);
      return that;
    }
  }

  /**
   * Indicates whether the executor queue is full.
   */
  this.queueFull = function() {
    return jexecutor.queueFull();
  }

  /**
   * Starts the executor.
   */
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

  /**
   * Sets a full handler on the executor.
   */
  this.fullHandler = function(handler) {
    jexecutor.fullHandler(handler);
    return that;
  }

  /**
   * Sets a drain handler on the executor.
   */
  this.drainHandler = function(handler) {
    jexecutor.drainHandler(handler);
    return that;
  }

  /**
   * Executes a remote procedure call.
   */
  this.execute = function(data) {
    var args = Array.prototype.slice.call(arguments);
    args.shift();
    var handler = getArgValue('function', args);
    var tag = getArgValue('string', args);

    if (handler) {
      handler = adaptAsyncResultHandler(handler, function(jmessage) {
        return wrap_message(jmessage);
      });
    }
    else {
      throw 'Invalid execute() handler.';
    }

    if (typeof(data) != 'object') {
      throw 'Invalid data type for execute()';
    }
    else if (tag != null) {
      jexecutor.execute(new org.vertx.java.core.json.JsonObject(JSON.stringify(data)), tag, handler);
    }
    else {
      jexecutor.execute(new org.vertx.java.core.json.JsonObject(JSON.stringify(data)), handler);
    }
    return that;
  }

}

module.exports = executor;

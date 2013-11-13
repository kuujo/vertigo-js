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

var vertigo = require('vertigo');
var message = require('vertigo/message');

/**
 * The <code>vertigo/rpc</code> module provides Vertigo executor
 * component classes.
 * @exports vertigo/rpc
 */
var rpc = {};

/**
 * A polling executor.
 * @constructor
 */
rpc.PollingExecutor = function(context) {
  var that = this;

  if (context === undefined) {
    context = vertigo.context;
  }

  this.context = context;
  var jexecutor = new net.kuujo.vertigo.rpc.DefaultPollingExecutor(__jvertx, __jcontainer, this.context.__jcontext);

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
    jexecutor.executeHandler(new org.vertx.java.core.Handler({
      handle: function(jexecutor) {
        handler(that);
      }
    }));
    return that;
  }

  /**
   * Sets a result handler on the executor.
   */
  this.resultHandler = function(handler) {
    jexecutor.resultHandler(new org.vertx.java.core.Handler({
      handle: function(jmessage) {
        handler(new message.Message(jmessage));
      }
    }));
    return that;
  }

  /**
   * Sets a fail handler on the executor.
   */
  this.failHandler = function(handler) {
    jexecutor.failHandler(new org.vertx.java.core.Handler({handle: handler}));
    return that;
  }

  /**
   * Executes a remote procedure call.
   *
   * @param {object} data The data to emit
   * @param {string} [tag] A tag to apply to the output message
   *
   * @returns {string} a unique message identifier
   */
  this.execute = function(data) {
    var args = Array.prototype.slice.call(arguments);
    args.shift();
    var tag = getArgValue('string', args);

    if (typeof(data) != 'object') {
      throw 'Invalid data type for execute()';
    }
    else if (tag != null) {
      return jexecutor.execute(new org.vertx.java.core.json.JsonObject(JSON.stringify(data)), tag);
    }
    else {
      return jexecutor.execute(new org.vertx.java.core.json.JsonObject(JSON.stringify(data)));
    }
  }

}

/**
 * A ReadStream integration executor.
 * @constructor
 */
rpc.StreamExecutor = function(context) {
  var that = this;

  if (context === undefined) {
    context = vertigo.context;
  }

  this.context = context;
  var jexecutor = new net.kuujo.vertigo.rpc.DefaultStreamExecutor(__jvertx, __jcontainer, this.context.__jcontext);

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
   * Sets a drain handler on the executor.
   */
  this.drainHandler = function(handler) {
    jexecutor.drainHandler(new org.vertx.java.core.Handler({handle: handler}));
    return that;
  }

  /**
   * Executes a remote procedure call.
   *
   * @param {object} data The data to emit
   * @param {string} [tag] A tag to apply to the output message
   * @param {ResultHandler} handler A handler to be called with the execution result
   *
   * @returns {string} a unique message identifier
   */
  this.execute = function(data) {
    var args = Array.prototype.slice.call(arguments);
    args.shift();
    var handler = getArgValue('function', args);
    var tag = getArgValue('string', args);

    if (handler) {
      handler = adaptAsyncResultHandler(handler, function(jmessage) {
        return new message.Message(jmessage);
      });
    }
    else {
      throw 'Invalid execute() handler.';
    }

    if (typeof(data) != 'object') {
      throw 'Invalid data type for execute()';
    }
    else if (tag != null) {
      return jexecutor.execute(new org.vertx.java.core.json.JsonObject(JSON.stringify(data)), tag, handler);
    }
    else {
      return jexecutor.execute(new org.vertx.java.core.json.JsonObject(JSON.stringify(data)), handler);
    }
    return that;
  }

}

module.exports = rpc;

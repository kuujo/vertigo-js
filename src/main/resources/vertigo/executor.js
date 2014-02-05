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

var message = require('vertigo/message');
var context = require('vertigo/context');
var error = require('vertigo/error');

/**
 * The <code>vertigo/rpc</code> module provides Vertigo executor
 * component methods.
 * @exports vertigo/executor
 */
var executor = {};

/**
 * A network executor.
 * @constructor
 */
executor.Executor = function(jexecutor) {
  var that = this;

  this.__jexecutor = jexecutor;
  this.context = new context.InstanceContext(jexecutor.context());
  this.config = this.context.componentContext().config();
  this.logger = jexecutor.logger();

  var _startHandler = null;
  var _started = false;
  var _error = null;
  
  function check_start() {
    if (_started && _startHandler != null) {
      _startHandler(_error, that);
    }
  }

  /**
   * Sets or gets the execution result timeout.
   *
   * @param {Integer} [timeout] The execution result timeout.
   * @returns {module:vertigo/executor.Executor} The executor instance.
   */
  this.resultTimeout = function(timeout) {
    if (timeout === undefined) {
      return jexecutor.getResultTimeout();
    }
    else {
      jexecutor.setResultTimeout(timeout);
      return that;
    }
  }

  /**
   * Sets or gets the maximum execute queue size.
   *
   * @param {Integer} [size] The maximum execute queue size.
   * @returns {module:vertigo/executor.Executor} The executor instance.
   */
  this.executeQueueMaxSize = function(size) {
    if (size === undefined) {
      return jexecutor.getExecuteQueueMaxSize();
    }
    else {
      jexecutor.setExecuteQueueMaxSize(size);
      return that;
    }
  }
  
  /**
   * Indicates whether the execute queue is full.
   *
   * @returns {Boolean} Indicates whether the queue is full.
   */
  this.executeQueueFull = function() {
    return jexecutor.executeQueueFull();
  }
  
  /**
   * Sets or gets the auto retry option for the executor.
   *
   * @param {Boolean} [retry] Whether auto retry is enabled.
   * @returns {module:vertigo/executor.Executor} The executor instance.
   */
  this.autoRetry = function(retry) {
    if (retry === undefined) {
      return jexecutor.isAutoRetry();
    }
    else {
      jexecutor.setAutoRetry(retry);
      return that;
    }
  }
  
  /**
   * Sets or gets the number of auto retry attempts.
   *
   * @param {Integer} [attempts] The number of auto retry attempts before
   * the executor will consider a message to be timed out.
   * @returns {module:vertigo/executor.Executor} The executor instance.
   */
  this.autoRetryAttempts = function(attempts) {
    if (attempts === undefined) {
      return jexecutor.getAutoRetryAttempts();
    }
    else {
      jexecutor.setAutoRetryAttempts(attempts);
      return that;
    }
  }
  
  /**
   * Sets or gets the execute handler interval.
   *
   * @param {Integer} [attempts] The interval at which the executor will
   * poll the execute handler for new messages.
   * @returns {module:vertigo/executor.Executor} The executor instance.
   */
  this.executeInterval = function(interval) {
    if (interval === undefined) {
      return jexecutor.getExecuteInterval();
    }
    else {
      jexecutor.setExecuteInterval(interval);
      return that;
    }
  }
  
  /**
   * Sets an execute handler on the executor.
   *
   * @param {Handler} handler A handler to be called whenever the executor
   * is prepared to accept new messages. This handler will be called with
   * the executor as its only argument.
   * @returns {module:vertigo/executor.Executor} The executor instance.
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
   * Sets a drain handler on the executor.
   *
   * @param {Handler} handler A handler to be called when a full executor
   * is prepared to accept new messages.
   */
  this.drainHandler = function(handler) {
    jexecutor.drainHandler(new org.vertx.java.core.Handler({handle: handler}));
    return that;
  }
  
  /**
   * Sets a start handler on the executor.
   *
   * @param {Handler} handler A handler to be called when the executor is started.
   * @returns {module:vertigo/executor.Executor} The executor instance.
   */
  this.startHandler = function(handler) {
    _startHandler = handler;
    check_start();
    return that;
  }
  
  /**
   * Starts the executor.
   *
   * @returns {module:vertigo/executor.Executor} The executor instance.
   */
  this.start = function() {
    var handler = function(error, jexecutor) {
      _started = true;
      _error = error;
      check_start();
    };
    jexecutor.start(adaptAsyncResultHandler(handler));
    return that;
  }
  
  /**
   * Executes a remote procedure call.
   *
   * @param {object} data The data to emit.
   * @param {string} [stream] The stream to which to emit the message.
   * @param {ResultHandler} handler A handler to be called with the execution result.
   *
   * @returns {string} a unique message identifier
   */
  this.execute = function() {
    var args = Array.prototype.slice.call(arguments);
    var resultHandler = getArgValue('function', args);
    var body = getArgValue('object', args);
    var stream = getArgValue('string', args);

    var handler = function(err, result) {
      resultHandler(error.createError(err), result);
    }

    if (stream) {
      if (resultHandler) {
        return jexecutor.execute(stream, new org.vertx.java.core.json.JsonObject(JSON.stringify(body)), adaptAsyncResultHandler(handler, function(jmessage) {
          return new message.Message(jmessage);
        })).correlationId();
      }
      else {
        return jexecutor.execute(stream, new org.vertx.java.core.json.JsonObject(JSON.stringify(body))).correlationId();
      }
    }
    else {
      if (resultHandler) {
        return jexecutor.execute(new org.vertx.java.core.json.JsonObject(JSON.stringify(body)), adaptAsyncResultHandler(handler, function(jmessage) {
          return new message.Message(jmessage);
        })).correlationId();
      }
      else {
        return jexecutor.execute(new org.vertx.java.core.json.JsonObject(JSON.stringify(body))).correlationId();
      }
    }
  }

}

module.exports = executor;

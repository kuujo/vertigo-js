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

/**
 * The <code>vertigo/rpc</code> module provides Vertigo executor
 * component methods.
 * @exports vertigo/executor
 */
var executor = {};

/**
 * Sets or gets the maximum execute queue size.
 *
 * @param {Integer} [size] The maximum execute queue size.
 * @returns {module:vertigo/executor} The executor instance.
 */
executor.executeQueueMaxSize = function(size) {
  if (size === undefined) {
    return __jcomponent.getExecuteQueueMaxSize();
  }
  else {
    __jcomponent.setExecuteQueueMaxSize(size);
    return executor;
  }
}

/**
 * Indicates whether the execute queue is full.
 *
 * @returns {Boolean} Indicates whether the queue is full.
 */
executor.executeQueueFull = function() {
  return __jcomponent.executeQueueFull();
}

/**
 * Sets or gets the auto retry option for the executor.
 *
 * @param {Boolean} [retry] Whether auto retry is enabled.
 * @returns {module:vertigo/executor} The executor instance.
 */
executor.autoRetry = function(retry) {
  if (retry === undefined) {
    return __jcomponent.isAutoRetry();
  }
  else {
    __jcomponent.setAutoRetry(retry);
    return executor;
  }
}

/**
 * Sets or gets the number of auto retry attempts.
 *
 * @param {Integer} [attempts] The number of auto retry attempts before
 * the executor will consider a message to be timed out.
 * @returns {module:vertigo/executor} The executor instance.
 */
executor.autoRetryAttempts = function(attempts) {
  if (attempts === undefined) {
    return __jcomponent.getAutoRetryAttempts();
  }
  else {
    __jcomponent.setAutoRetryAttempts(attempts);
    return executor;
  }
}

/**
 * Sets or gets the execute handler interval.
 *
 * @param {Integer} [attempts] The interval at which the executor will
 * poll the execute handler for new messages.
 * @returns {module:vertigo/executor} The executor instance.
 */
executor.executeInterval = function(interval) {
  if (interval === undefined) {
    return __jcomponent.getExecuteInterval();
  }
  else {
    __jcomponent.setExecuteInterval(interval);
    return executor;
  }
}

/**
 * Sets an execute handler on the executor.
 *
 * @param {Handler} handler A handler to be called whenever the executor
 * is prepared to accept new messages. This handler will be called with
 * the executor as its only argument.
 * @returns {module:vertigo/executor} The executor instance.
 */
executor.executeHandler = function(handler) {
  __jcomponent.executeHandler(new org.vertx.java.core.Handler({
    handle: function(jexecutor) {
      handler(executor);
    }
  }));
  return executor;
}

/**
 * Sets a drain handler on the executor.
 *
 * @param {Handler} handler A handler to be called when a full executor
 * is prepared to accept new messages.
 */
executor.drainHandler = function(handler) {
  __jcomponent.drainHandler(new org.vertx.java.core.Handler({handle: handler}));
  return executor;
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
executor.execute = function() {
  var args = Array.prototype.slice.call(arguments);
  var resultHandler = getArgValue('function', args);
  var body = getArgValue('object', args);
  var stream = getArgValue('string', args);

  if (stream) {
    if (resultHandler) {
      return __jcomponent.emit(stream, new org.vertx.java.core.json.JsonObject(JSON.stringify(body)), adaptAsyncResultHandler(resultHandler, function(jmessage) {
        return new message.Message(jmessage);
      })).correlationId();
    }
    else {
      return __jcomponent.emit(stream, new org.vertx.java.core.json.JsonObject(JSON.stringify(body))).correlationId();
    }
  }
  else {
    if (resultHandler) {
      return __jcomponent.emit(new org.vertx.java.core.json.JsonObject(JSON.stringify(body)), adaptAsyncResultHandler(resultHandler, function(jmessage) {
        return new message.Message(jmessage);
      })).correlationId();
    }
    else {
      return __jcomponent.emit(new org.vertx.java.core.json.JsonObject(JSON.stringify(body))).correlationId();
    }
  }
}

module.exports = executor;

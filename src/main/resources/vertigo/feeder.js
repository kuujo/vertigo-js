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

/**
 * The <code>vertigo/feeder</code> module provides Vertigo feeder
 * component classes.
 * @exports vertigo/feeder
 */
var feeder = {};

/**
 * Sets or gets the maximum feed queue size.
 *
 * @param {Integer} [size] The maximum feed queue size.
 * @returns {module:vertigo/feeder} The feeder instance.
 */
feeder.feedQueueMaxSize = function(size) {
  if (size === undefined) {
    return __jcomponent.getFeedQueueMaxSize();
  }
  else {
    __jcomponent.setFeedQueueMaxSize(size);
    return feeder;
  }
}

/**
 * Indicates whether the feed queue is full.
 *
 * @returns {Boolean} Indicates whether the queue is full.
 */
feeder.feedQueueFull = function() {
  return __jcomponent.feedQueueFull();
}

/**
 * Sets or gets the auto retry option for the feeder.
 *
 * @param {Boolean} [retry] Whether auto retry is enabled.
 * @returns {module:vertigo/feeder} The feeder instance.
 */
feeder.autoRetry = function(retry) {
  if (retry === undefined) {
    return __jcomponent.isAutoRetry();
  }
  else {
    __jcomponent.setAutoRetry(retry);
    return feeder;
  }
}

/**
 * Sets or gets the number of auto retry attempts.
 *
 * @param {Integer} [attempts] The number of auto retry attempts before
 * the feeder will consider a message to be timed out.
 * @returns {module:vertigo/feeder} The feeder instance.
 */
feeder.autoRetryAttempts = function(attempts) {
  if (attempts === undefined) {
    return __jcomponent.getAutoRetryAttempts();
  }
  else {
    __jcomponent.setAutoRetryAttempts(attempts);
    return feeder;
  }
}

/**
 * Sets or gets the feed handler interval.
 *
 * @param {Integer} [attempts] The interval at which the feeder will
 * poll the feed handler for new messages.
 * @returns {module:vertigo/feeder} The feeder instance.
 */
feeder.feedInterval = function(interval) {
  if (interval === undefined) {
    return __jcomponent.getFeedInterval();
  }
  else {
    __jcomponent.setFeedInterval(interval);
    return feeder;
  }
}

/**
 * Sets a feed handler on the feeder.
 *
 * @param {Handler} handler A handler to be called whenever the feeder
 * is prepared to accept new messages. This handler will be called with
 * the feeder as its only argument.
 * @returns {module:vertigo/feeder} The feeder instance.
 */
feeder.feedHandler = function(handler) {
  __jcomponent.feedHandler(new org.vertx.java.core.Handler({
    handle: function(jfeeder) {
      handler(feeder);
    }
  }));
  return feeder;
}

/**
 * Sets a drain handler on the feeder.
 *
 * @param {Handler} handler A handler to be called when a full feeder
 * is prepared to accept new messages.
 */
feeder.drainHandler = function(handler) {
  __jcomponent.drainHandler(new org.vertx.java.core.Handler({handle: handler}));
  return feeder;
}

/**
 * Emits data from the feeder.
 *
 * @param {object} data The data to emit.
 * @param {string} [stream] The stream to which to emit the message.
 * @param {AckHandler} handler A handler to be called once the message is acked.
 *
 * @returns {string} a unique message identifier.
 */
feeder.emit = function() {
  var args = Array.prototype.slice.call(arguments);
  var ackHandler = getArgValue('function', args);
  var body = getArgValue('object', args);
  var stream = getArgValue('string', args);

  if (stream) {
    if (ackHandler) {
      return __jcomponent.emit(stream, new org.vertx.java.core.json.JsonObject(JSON.stringify(body)), adaptAsyncResultHandler(ackHandler, function(result) {
        return result.correlationId();
      })).correlationId();
    }
    else {
      return __jcomponent.emit(stream, new org.vertx.java.core.json.JsonObject(JSON.stringify(body))).correlationId();
    }
  }
  else {
    if (ackHandler) {
      return __jcomponent.emit(new org.vertx.java.core.json.JsonObject(JSON.stringify(body)), adaptAsyncResultHandler(ackHandler, function(result) {
        return result.correlationId();
      })).correlationId();
    }
    else {
      return __jcomponent.emit(new org.vertx.java.core.json.JsonObject(JSON.stringify(body))).correlationId();
    }
  }
}

module.exports = feeder;

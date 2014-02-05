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

var context = require('vertigo/context');
var error = require('vertigo/error');

/**
 * The <code>vertigo/feeder</code> module provides Vertigo feeder
 * component classes.
 * @exports vertigo/feeder
 */
var feeder = {};

/**
 * A feeder instance.
 * @constructor
 */
feeder.Feeder = function(jfeeder) {
  var that = this;

  this.__jfeeder = jfeeder;
  this.context = new context.InstanceContext(jfeeder.context());
  this.config = this.context.componentContext().config();
  this.logger = jfeeder.logger();

  var _startHandler = null;
  var _started = false;
  var _error = null;
  var _ackHandler = null;

  //The feed handler *always* receives a MessageId instance whether the message
  //was successfully processed or not. Thus, we need to implement a custom wrapper.
  var adaptFeedResultHandler = function(handler) {
   return function(result) {
     if (result.failed()) {
       handler(error.createError(result.cause()), result.result().correlationId());
     }
     else {
       handler(null, result.result().correlationId());
     }
   }
  }

  function check_start() {
    if (_started && _startHandler != null) {
      _startHandler(_error, that);
    }
  }

  /**
   * Sets or gets the maximum feed queue size.
   *
   * @param {Integer} [size] The maximum feed queue size.
   * @returns {module:vertigo/feeder.Feeder} The feeder instance.
   */
  this.feedQueueMaxSize = function(size) {
    if (size === undefined) {
      return jfeeder.getFeedQueueMaxSize();
    }
    else {
      jfeeder.setFeedQueueMaxSize(size);
      return that;
    }
  }
  
  /**
   * Indicates whether the feed queue is full.
   *
   * @returns {Boolean} Indicates whether the queue is full.
   */
  this.feedQueueFull = function() {
    return jfeeder.feedQueueFull();
  }
  
  /**
   * Sets or gets the auto retry option for the feeder.
   *
   * @param {Boolean} [retry] Whether auto retry is enabled.
   * @returns {module:vertigo/feeder.Feeder} The feeder instance.
   */
  this.autoRetry = function(retry) {
    if (retry === undefined) {
      return jfeeder.isAutoRetry();
    }
    else {
      jfeeder.setAutoRetry(retry);
      return that;
    }
  }
  
  /**
   * Sets or gets the number of auto retry attempts.
   *
   * @param {Integer} [attempts] The number of auto retry attempts before
   * the feeder will consider a message to be timed out.
   * @returns {module:vertigo/feeder.Feeder} The feeder instance.
   */
  this.autoRetryAttempts = function(attempts) {
    if (attempts === undefined) {
      return jfeeder.getAutoRetryAttempts();
    }
    else {
      jfeeder.setAutoRetryAttempts(attempts);
      return that;
    }
  }
  
  /**
   * Sets or gets the feed handler interval.
   *
   * @param {Integer} [attempts] The interval at which the feeder will
   * poll the feed handler for new messages.
   * @returns {module:vertigo/feeder.Feeder} The feeder instance.
   */
  this.feedInterval = function(interval) {
    if (interval === undefined) {
      return jfeeder.getFeedInterval();
    }
    else {
      jfeeder.setFeedInterval(interval);
      return that;
    }
  }
  
  /**
   * Sets a start handler on the feeder.
   *
   * @param {Handler} handler A handler to be called when the feeder is started.
   * @returns {module:vertigo/feeder.Feeder} The feeder instance.
   */
  this.startHandler = function(handler) {
    _startHandler = handler;
    check_start();
    return that;
  }
  
  /**
   * Starts the feeder.
   *
   * @returns {module:vertigo/feeder.Feeder} The feeder instance.
   */
  this.start = function() {
    var handler = adaptAsyncResultHandler(function(error, jfeeder) {
      _started = true;
      _error = error;
      check_start();
    });
    jfeeder.start(handler);
    return that;
  }
  
  /**
   * Sets a feed handler on the feeder.
   *
   * @param {Handler} handler A handler to be called whenever the feeder
   * is prepared to accept new messages. This handler will be called with
   * the feeder as its only argument.
   * @returns {module:vertigo/feeder.Feeder} The feeder instance.
   */
  this.feedHandler = function(handler) {
    jfeeder.feedHandler(new org.vertx.java.core.Handler({
      handle: function(jfeeder) {
        handler(that);
      }
    }));
    return that;
  }
  
  /**
   * Sets a drain handler on the feeder.
   *
   * @param {Handler} handler A handler to be called when a full feeder
   * is prepared to accept new messages.
   * @returns {module:vertigo/feeder.Feeder} The feeder instance.
   */
  this.drainHandler = function(handler) {
    jfeeder.drainHandler(new org.vertx.java.core.Handler({handle: handler}));
    return that;
  }
  
  /**
   * Sets a default ack handler on the feeder.
   */
  this.ackHandler = function(handler) {
    _ackHandler = handler;
    return that;
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
  this.emit = function() {
    var args = Array.prototype.slice.call(arguments);
    var ackHandler = getArgValue('function', args);
    var body = getArgValue('object', args);
    var stream = getArgValue('string', args);
  
    if (ackHandler == null && _ackHandler != null) {
      ackHandler = _ackHandler;
    }
  
    if (stream) {
      if (ackHandler) {
        return jfeeder.emit(stream, new org.vertx.java.core.json.JsonObject(JSON.stringify(body)), adaptFeedResultHandler(ackHandler)).correlationId();
      }
      else {
        return jfeeder.emit(stream, new org.vertx.java.core.json.JsonObject(JSON.stringify(body))).correlationId();
      }
    }
    else {
      if (ackHandler) {
        return jfeeder.emit(new org.vertx.java.core.json.JsonObject(JSON.stringify(body)), adaptFeedResultHandler(ackHandler)).correlationId();
      }
      else {
        return jfeeder.emit(new org.vertx.java.core.json.JsonObject(JSON.stringify(body))).correlationId();
      }
    }
  }

}

module.exports = feeder;

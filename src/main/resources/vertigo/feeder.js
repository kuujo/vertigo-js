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

/**
 * The <code>vertigo/feeder</code> module provides Vertigo feeder
 * component classes.
 * @exports vertigo/feeder
 */
var feeder = {};

/**
 * A basic feeder.
 * @constructor
 */
feeder.BasicFeeder = function(context) {
  var that = this;

  if (context === undefined) {
    context = vertigo.context;
  }

  this.context = context;
  var jfeeder = new net.kuujo.vertigo.feeder.DefaultBasicFeeder(__jvertx, __jcontainer, this.context.__jcontext);

  /**
   * Sets the maximum feed queue size.
   */
  this.maxQueueSize = function(size) {
    if (size === undefined) {
      return jfeeder.getMaxQueueSize();
    }
    else {
      jfeeder.setMaxQueueSize(size);
      return that;
    }
  }

  /**
   * Indicates whether the feed queue is full.
   */
  this.queueFull = function() {
    return jfeeder.queueFull();
  }

  /**
   * Indicates whether to automatically retry failed feeds.
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
   * Sets the number of automatic retry attempts.
   */
  this.retryAttempts = function(attempts) {
    if (attempts === undefined) {
      return jfeeder.getRetryAttempts();
    }
    else {
      jfeeder.setRetryAttempts(attempts);
      return that;
    }
  }

  /**
   * Starts the feeder.
   */
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

  /**
   * Emits data from the feeder.
   */
  this.emit = function(data) {
    var args = Array.prototype.slice.call(arguments);
    args.shift();
    var handler = getArgValue('function', args);
    var tag = getArgValue('string', args);
    if (handler) {
      handler = adaptAsyncResultHandler(handler);
    }
    if (typeof(data) != 'object') {
      throw 'Invalid data type for emit()';
    }
    else {
      jfeeder.emit(new org.vertx.java.core.json.JsonObject(JSON.stringify(data)), tag, handler);
    }
    return that;
  }

}

/**
 * A polling feeder.
 * @constructor
 */
feeder.PollingFeeder = function(context) {
  var that = this;

  if (context === undefined) {
    context = vertigo.context;
  }

  this.context = context;
  var jfeeder = new net.kuujo.vertigo.feeder.DefaultPollingFeeder(__jvertx, __jcontainer, this.context.__jcontext);

  /**
   * Sets the maximum feed queue size.
   */
  this.maxQueueSize = function(size) {
    if (size === undefined) {
      return jfeeder.getMaxQueueSize();
    }
    else {
      jfeeder.setMaxQueueSize(size);
      return that;
    }
  }

  /**
   * Indicates whether the feed queue is full.
   */
  this.queueFull = function() {
    return jfeeder.queueFull();
  }

  /**
   * Indicates whether to automatically retry failed feeds.
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
   * Sets the number of automatic retry attempts.
   */
  this.retryAttempts = function(attempts) {
    if (attempts === undefined) {
      return jfeeder.getRetryAttempts();
    }
    else {
      jfeeder.setRetryAttempts(attempts);
      return that;
    }
  }

  /**
   * Sets the feed delay.
   */
  this.feedDelay = function(delay) {
    if (delay === undefined) {
      return jfeeder.getFeedDelay();
    }
    else {
      jfeeder.setFeedDelay(delay);
      return that;
    }
  }

  /**
   * Starts the feeder.
   */
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

  /**
   * Sets a feed handler.
   */
  this.feedHandler = function(handler) {
    jfeeder.feedHandler(function(feeder) {
      handler(that);
    });
    return that;
  }

  /**
   * Emits data from the feeder.
   */
  this.emit = function() {
    var args = Array.prototype.slice.call(arguments);
    args.shift();
    var handler = getArgValue('function', args);
    var tag = getArgValue('string', args);
    var data = getArgValue('object', args);
    if (handler) {
      handler = adaptAsyncResultHandler(handler);
    }
    if (typeof(data) != 'object') {
      throw 'Invalid data type for emit()';
    }
    else {
      jfeeder.emit(new org.vertx.java.core.json.JsonObject(JSON.stringify(data)), tag, handler);
    }
    return that;
  }

}

/**
 * A ReadStream integration feeder.
 * @constructor
 */
feeder.StreamFeeder = function(context) {
  var that = this;

  if (context === undefined) {
    context = vertigo.context;
  }

  this.context = context;
  var jfeeder = new net.kuujo.vertigo.feeder.DefaultStreamFeeder(__jvertx, __jcontainer, this.context.__jcontext);

  /**
   * Sets the maximum feed queue size.
   */
  this.maxQueueSize = function(size) {
    if (size === undefined) {
      return jfeeder.getMaxQueueSize();
    }
    else {
      jfeeder.setMaxQueueSize(size);
      return that;
    }
  }

  /**
   * Indicates whether the feed queue is full.
   */
  this.queueFull = function() {
    return jfeeder.queueFull();
  }

  /**
   * Indicates whether to automatically retry failed feeds.
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
   * Sets the number of automatic retry attempts.
   */
  this.retryAttempts = function(attempts) {
    if (attempts === undefined) {
      return jfeeder.getRetryAttempts();
    }
    else {
      jfeeder.setRetryAttempts(attempts);
      return that;
    }
  }

  /**
   * Starts the feeder.
   */
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

  /**
   * Sets a full handler on the feeder.
   */
  this.fullHandler = function(handler) {
    jfeeder.fullHandler(handler);
    return that;
  }

  /**
   * Sets a drain handler on the feeder.
   */
  this.drainHandler = function(handler) {
    jfeeder.drainHandler(handler);
    return that;
  }

  /**
   * Emits data from the feeder.
   */
  this.emit = function(data) {
    var args = Array.prototype.slice.call(arguments);
    args.shift();
    var handler = getArgValue('function', args);
    var tag = getArgValue('string', args);
    if (handler) {
      handler = adaptAsyncResultHandler(handler);
    }
    if (typeof(data) != 'object') {
      throw 'Invalid data type for emit()';
    }
    else {
      jfeeder.emit(new org.vertx.java.core.json.JsonObject(JSON.stringify(data)), tag, handler);
    }
    return that;
  }

}

module.exports = feeder;

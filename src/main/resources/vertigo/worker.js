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

/**
 * The <code>vertigo/worker</code> module provides Vertigo worker
 * component classes.
 * @exports vertigo/worker
 */
var worker = {};

/**
 * A worker object.
 * @constructor
 */
worker.Worker = function(jworker) {
  var that = this;

  this.__jworker = jworker;
  this.context = new context.InstanceContext(jworker.getContext());
  this.config = this.context.component().config();

  var _startHandler = null;
  var _started = false;
  var _error = null;
  
  function check_start() {
    if (_started && _startHandler != null) {
      _startHandler(_error, that);
    }
  }
  
  /**
   * Sets a start handler on the worker.
   *
   * @param {Handler} handler A handler to be called when the worker is started.
   * @returns {module:vertigo/worker.Worker} The worker instance.
   */
  this.startHandler = function(handler) {
    _startHandler = handler;
    check_start();
    return that;
  }
  
  /**
   * Starts the worker.
   *
   * @returns {module:vertigo/worker.Worker} The worker instance.
   */
  this.start = function() {
    handler = adaptAsyncResultHandler(function(error, jworker) {
      _started = true;
      _error = error;
      check_start();
    });
    jworker.start(handler);
    return that;
  }
  
  /**
   * Sets a message handler on the worker.
   *
   * @param {Handler} handler The message handler.
   * @returns {module:vertigo/worker.Worker} The worker instance.
   */
  this.messageHandler = function(handler) {
    jworker.messageHandler(new org.vertx.java.core.Handler({
      handle: function(jmessage) {
        handler(new message.Message(jmessage));
      }
    }));
    return that;
  }
  
  /**
   * Emits data from the worker.
   *
   * @param {object} data The data to emit.
   * @param {string} [stream] The stream to which to emit the message.
   * @param {module:vertigo/message.Message} The parent message.
   *
   * @returns {string} a unique message identifier.
   */
  this.emit = function() {
    var args = Array.prototype.slice.call(arguments);
  
    var obj2 = getArgValue('object', args);
    var obj1 = getArgValue('object', args);
    var stream = getArgValue('string', args);
  
    if (obj1 != null && obj2 != null) {
      if (stream != null) {
        return jworker.emit(stream, new org.vertx.java.core.json.JsonObject(JSON.stringify(obj1)), obj2.__jmessage).correlationId();
      }
      else {
        return jworker.emit(new org.vertx.java.core.json.JsonObject(JSON.stringify(obj1)), obj2.__jmessage).correlationId();
      }
    }
    else if (obj2 != null) {
      if (stream != null) {
        return jworker.emit(stream, new org.vertx.java.core.json.JsonObject(JSON.stringify(obj2))).correlationId();
      }
      else {
        return jworker.emit(new org.vertx.java.core.json.JsonObject(JSON.stringify(obj2))).correlationId();
      }
    }
  }

  /**
   * Acks a message.
   *
   * @param {module:vertigo/message.Message} The message to ack.
   * @returns {module:vertigo/worker.Worker} The worker instance.
   */
  this.ack = function(message) {
    jworker.ack(message.__jmessage);
    return that;
  }

  /**
   * Fails a message.
   *
   * @param {module:vertigo/message.Message} The message to fail.
   * @returns {module:vertigo/worker.Worker} The worker instance.
   */
  this.fail = function(message) {
    jworker.fail(message.__jmessage);
    return that;
  }

}

module.exports = worker;

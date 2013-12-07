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
load('vertigo/helpers.js');
validate_component_type('worker');

var message = require('vertigo/message');

/**
 * The <code>vertigo/worker</code> module provides Vertigo worker
 * component classes.
 * @exports vertigo/worker
 */
var worker = {};

var _startHandler = null;
var _started = false;
var _error = null;

function check_start() {
  if (_started && _startHandler != null) {
    _startHandler(_error, worker);
  }
}

/**
 * Sets a start handler on the worker.
 *
 * @param {Handler} handler A handler to be called when the worker is started.
 * @returns {module:vertigo/worker} The worker instance.
 */
worker.startHandler = function(handler) {
  _startHandler = handler;
  check_start();
  return worker;
}

/**
 * Starts the worker.
 *
 * @returns {module:vertigo/worker} The worker instance.
 */
worker.start = function() {
  handler = adaptAsyncResultHandler(function(error, jworker) {
    _started = true;
    _error = error;
    check_start();
  });
  __jcomponent.start(handler);
  return worker;
}

/**
 * Sets a message handler on the worker.
 *
 * @param {Handler} handler The message handler.
 * @returns {module:vertigo/worker} The worker instance.
 */
worker.messageHandler = function(handler) {
  __jcomponent.messageHandler(new org.vertx.java.core.Handler({
    handle: function(jmessage) {
      handler(new message.Message(jmessage));
    }
  }));
  return worker;
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
worker.emit = function() {
  var args = Array.prototype.slice.call(arguments);

  var obj2 = getArgValue('object', args);
  var obj1 = getArgValue('object', args);
  var stream = getArgValue('string', args);

  if (obj1 != null && obj2 != null) {
    if (stream != null) {
      return __jcomponent.emit(stream, new org.vertx.java.core.json.JsonObject(JSON.stringify(obj1)), obj2.__jmessage).correlationId();
    }
    else {
      return __jcomponent.emit(new org.vertx.java.core.json.JsonObject(JSON.stringify(obj1)), obj2.__jmessage).correlationId();
    }
  }
  else if (obj2 != null) {
    if (stream != null) {
      return __jcomponent.emit(stream, new org.vertx.java.core.json.JsonObject(JSON.stringify(obj2))).correlationId();
    }
    else {
      return __jcomponent.emit(new org.vertx.java.core.json.JsonObject(JSON.stringify(obj2))).correlationId();
    }
  }
}

module.exports = worker;

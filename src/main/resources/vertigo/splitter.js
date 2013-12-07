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
validate_component_type('splitter');

var message = require('vertigo/message');

/**
 * The <code>vertigo/splitter</code> module provides Vertigo splitter
 * component classes.
 * @exports vertigo/splitter
 */
var splitter = {};

var _startHandler = null;
var _started = false;
var _error = null;

function check_start() {
  if (_started && _startHandler != null) {
    _startHandler(_error, splitter);
  }
}

/**
 * Sets a start handler on the splitter.
 *
 * @param {Handler} handler A handler to be called when the splitter is started.
 * @returns {module:vertigo/splitter} The splitter instance.
 */
splitter.startHandler = function(handler) {
  _startHandler = handler;
  check_start();
  return splitter;
}

/**
 * Starts the splitter.
 *
 * @returns {module:vertigo/splitter} The splitter instance.
 */
splitter.start = function() {
  handler = adaptAsyncResultHandler(function(error, jsplitter) {
    _started = true;
    _error = error;
    check_start();
  });
  __jcomponent.start(handler);
  return splitter;
}

/**
 * Sets a split function on the splitter.
 *
 * @param {function} splitFunc The split function. This function accepts
 * a {module:vertigo/message.Message} instance as its only argument and
 * must return a list of objects, the split form of the message body.
 * @return {module:vertigo/splitter} The splitter instance.
 */
splitter.split = function(splitFunc) {
  __jcomponent.splitFunction(new net.kuujo.vertigo.function.Function({
    call: function(jmessage) {
      return splitFunc(new message.Message(jmessage));
    }
  }));
  return splitter;
}

module.exports = splitter;

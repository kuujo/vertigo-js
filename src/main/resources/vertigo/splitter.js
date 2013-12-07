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
 * The <code>vertigo/splitter</code> module provides Vertigo splitter
 * component classes.
 * @exports vertigo/splitter
 */
var splitter = {};

/**
 * A message splitter.
 * @constructor
 */
splitter.Splitter = function(jsplitter) {
  var that = this;

  this.__jsplitter = jsplitter;
  this.context = new context.InstanceContext(jsplitter.getContext());
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
   * Sets a start handler on the splitter.
   *
   * @param {Handler} handler A handler to be called when the splitter is started.
   * @returns {module:vertigo/splitter.Splitter} The splitter instance.
   */
  this.startHandler = function(handler) {
    _startHandler = handler;
    check_start();
    return that;
  }
  
  /**
   * Starts the splitter.
   *
   * @returns {module:vertigo/splitter.Splitter} The splitter instance.
   */
  this.start = function() {
    handler = adaptAsyncResultHandler(function(error, jsplitter) {
      _started = true;
      _error = error;
      check_start();
    });
    jsplitter.start(handler);
    return that;
  }
  
  /**
   * Sets a split function on the splitter.
   *
   * @param {function} splitFunc The split function. This function accepts
   * a {module:vertigo/message.Message} instance as its only argument and
   * must return a list of objects, the split form of the message body.
   * @return {module:vertigo/splitter.Splitter} The splitter instance.
   */
  this.split = function(splitFunc) {
    jsplitter.splitFunction(new net.kuujo.vertigo.function.Function({
      call: function(jmessage) {
        return splitFunc(new message.Message(jmessage));
      }
    }));
    return that;
  }

}

module.exports = splitter;

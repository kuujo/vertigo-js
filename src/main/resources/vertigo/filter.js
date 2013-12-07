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
 * The <code>vertigo/filter</code> module provides Vertigo filter
 * component classes.
 * @exports vertigo/filter
 */
var filter = {};

filter.Filter = function(jfilter) {
  var that = this;

  this.__jfilter = jfilter;
  this.context = new context.InstanceContext(jfilter.getContext());
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
   * Sets a start handler on the filter.
   *
   * @param {Handler} handler A handler to be called when the filter is started.
   * @returns {module:vertigo/filter.Filter} The filter instance.
   */
  this.startHandler = function(handler) {
    _startHandler = handler;
    check_start();
    return that;
  }
  
  /**
   * Starts the filter.
   *
   * @returns {module:vertigo/filter.Filter} The filter instance.
   */
  this.start = function() {
    handler = adaptAsyncResultHandler(function(error, jfilter) {
      _started = true;
      _error = error;
      check_start();
    });
    jfilter.start(handler);
    return that;
  }
  
  /**
   * Sets a filter function on the filter.
   *
   * @param {function} filterFunc The filter function. This function accepts
   * a {module:vertigo/message.Message} instance as its only argument and
   * must return a boolean value indicating whether to keep the message.
   * @return {module:vertigo/filter.Filter} The filter instance.
   */
  this.filter = function(filterFunc) {
    jfilter.filterFunction(new net.kuujo.vertigo.function.Function({
      call: function(jmessage) {
        return filterFunc(new message.Message(jmessage));
      }
    }));
    return that;
  }

}

module.exports = filter;

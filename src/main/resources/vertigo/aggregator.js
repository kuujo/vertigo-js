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
 * The <code>vertigo/aggregator</code> module provides Vertigo aggregator
 * component classes.
 * @exports vertigo/aggregator
 */
var aggregator = {};

/**
 * A message aggregator.
 * @constructor
 */
aggregator.Aggregator = function(jaggregator) {
  var that = this;

  this.__jaggregator = jaggregator;
  this.context = new context.InstanceContext(jaggregator.getContext());
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
   * Sets a start handler on the aggregator.
   *
   * @param {Handler} handler A handler to be called when the aggregator is started.
   * @returns {module:vertigo/aggregator.Aggregator} The aggregator instance.
   */
  this.startHandler = function(handler) {
    _startHandler = handler;
    check_start();
    return that;
  }
  
  /**
   * Starts the aggregator.
   *
   * @returns {module:vertigo/aggregator.Aggregator} The aggregator instance.
   */
  this.start = function() {
    handler = adaptAsyncResultHandler(function(error, jaggregator) {
      _started = true;
      _error = error;
      check_start();
    });
    __jcomponent.start(handler);
    return that;
  }
  
  /**
   * Sets an initializer function on the aggregator.
   *
   * @param initFunc The init function or value.
   * @return {module:vertigo/aggregator.Aggregator} The aggregator instance.
   */
  this.init = function(initFunc) {
    if (typeof(initFunc) != 'function') {
      var val = initFunc;
      initFunc = function(message) {
        return val;
      }
    }
    jaggregator.initFunction(new net.kuujo.vertigo.function.Function({
      call: function(jmessage) {
        return initFunc(new message.Message(jmessage));
      }
    }));
    return that;
  }
  
  /**
   * Sets an aggregator function on the aggregator.
   *
   * @param {function} aggregateFunc The aggregate function.
   * @return {module:vertigo/aggregator.Aggregator} The aggregator instance.
   */
  this.aggregate = function(aggregateFunc) {
    jaggregator.aggregateFunction(new net.kuujo.vertigo.function.Function2({
      call: function(current, jmessage) {
        return aggregateFunc(current, new message.Message(jmessage));
      }
    }));
    return that;
  }
  
  /**
   * Sets a complete function on the aggregator.
   *
   * @param {function} completeFunc The complete function.
   * @return {module:vertigo/aggregator.Aggregator} The aggregator instance.
   */
  this.complete = function(completeFunc) {
    jaggregator.completeFunction(new net.kuujo.vertigo.function.Function({call: completeFunc}));
    return that;
  }

}

module.exports = aggregator;

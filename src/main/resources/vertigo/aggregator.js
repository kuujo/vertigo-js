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

var message = require('vertigo/message');

/**
 * The <code>vertigo/aggregator</code> module provides Vertigo aggregator
 * component classes.
 * @exports vertigo/aggregator
 */
var aggregator = {};

/**
 * Sets an initializer function on the aggregator.
 *
 * @param initFunc The init function or value.
 * @return {module:vertigo/aggregator} The aggregator instance.
 */
aggregator.init = function(initFunc) {
  if (typeof(initFunc) != 'function') {
    var val = initFunc;
    initFunc = function(message) {
      return val;
    }
  }
  __jcomponent.initFunction(new net.kuujo.vertigo.function.Function({
    call: function(jmessage) {
      return initFunc(new message.Message(jmessage));
    }
  }));
  return aggregator;
}

/**
 * Sets an aggregator function on the aggregator.
 *
 * @param {function} aggregateFunc The aggregate function.
 * @return {module:vertigo/aggregator} The aggregator instance.
 */
aggregator.aggregate = function(aggregateFunc) {
  __jcomponent.aggregateFunction(new net.kuujo.vertigo.function.Function2({
    call: function(current, jmessage) {
      return aggregateFunc(current, new message.Message(jmessage));
    }
  }));
  return aggregator;
}

/**
 * Sets a complete function on the aggregator.
 *
 * @param {function} completeFunc The complete function.
 * @return {module:vertigo/aggregator} The aggregator instance.
 */
aggregator.complete = function(completeFunc) {
  __jcomponent.completeFunction(new net.kuujo.vertigo.function.Function({call: completeFunc}));
  return aggregator;
}

module.exports = aggregator;

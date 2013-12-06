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
 * The <code>vertigo/filter</code> module provides Vertigo filter
 * component classes.
 * @exports vertigo/filter
 */
var filter = {};

/**
 * Sets a filter function on the filter.
 *
 * @param {function} filterFunc The filter function. This function accepts
 * a {module:vertigo/message.Message} instance as its only argument and
 * must return a boolean value indicating whether to keep the message.
 * @return {module:vertigo/filter} The filter instance.
 */
filter.filter = function(filterFunc) {
  __jcomponent.filterFunction(new net.kuujo.vertigo.function.Function({
    call: function(jmessage) {
      return filterFunc(new message.Message(jmessage));
    }
  }));
  return filter;
}

module.exports = filter;

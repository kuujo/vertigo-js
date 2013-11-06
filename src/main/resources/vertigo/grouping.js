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

/**
 * The <code>vertigo/grouping</code> module provides classes for creating
 * Vertigo input groupings.
 * @exports vertigo/grouping
 */
var grouping = {}

/**
 * A random grouping.
 * @constructor
 */
grouping.RandomGrouping = function() {
  this.__jgrouping = new net.kuujo.vertigo.input.grouping.RandomGrouping();
}

/**
 * A round-robin based grouping.
 * @constructor
 */
grouping.RoundGrouping = function() {
  this.__jgrouping = new net.kuujo.vertigo.input.grouping.RoundGrouping();
}

/**
 * A fields-based (consistent hashing) grouping.
 * @constructor
 */
grouping.FieldsGrouping = function(fields) {
  this.__jgrouping = new net.kuujo.vertigo.input.grouping.FieldsGrouping(fields);
}

/**
 * A "fanout" grouping.
 * @constructor
 */
grouping.AllGrouping = function() {
  this.__jgrouping = new net.kuujo.vertigo.input.grouping.AllGrouping();
}

module.exports = grouping;

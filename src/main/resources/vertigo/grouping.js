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
var grouping = {}

/**
 * A random grouping.
 */
grouping.RandomGrouping = function() {
  this.__jgrouping = new net.kuujo.vertigo.grouping.RandomGrouping();
}

/**
 * A round-robin based grouping.
 */
grouping.RoundGrouping = function() {
  this.__jgrouping = new net.kuujo.vertigo.grouping.RoundGrouping();
}

/**
 * A fields-based (consistent hashing) grouping.
 */
grouping.FieldsGrouping = function(field) {
  this.__jgrouping = new net.kuujo.vertigo.grouping.FieldsGrouping(field);
}

/**
 * A "fanout" grouping.
 */
grouping.AllGrouping = function() {
  this.__jgrouping = new net.kuujo.vertigo.grouping.AllGrouping();
}

module.exports = grouping;

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

/**
 * The <code>vertigo/filter</code> module provides classes for creating
 * Vertigo input filters.
 * @exports vertigo/filter
 */
var filter = {}

/**
 * A field/value based filter.
 * @constructor
 */
filter.FieldFilter = function(fieldName, value) {
  this.__jfilter = new net.kuujo.vertigo.input.filter.FieldFilter(fieldName, convert_value(value));
}

/**
 * A source-based filter.
 * @constructor
 */
filter.SourceFilter = function(source) {
  this.__jfilter = new net.kuujo.vertigo.input.filter.SourceFilter(source);
}

/**
 * A tags-based filter.
 * @constructor
 */
filter.TagsFilter = function(tags) {
  this.__jfilter = new net.kuujo.vertigo.input.filter.TagsFilter(tags);
}

module.exports = filter;

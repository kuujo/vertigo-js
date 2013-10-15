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
var filter = {}

function convertValue(value) {
  var type = typeof value;
  switch (type) {
    case 'string':
    case 'boolean':
    case 'undefined':
    case 'org.vertx.java.core.buffer.Buffer':
      break;
    case 'number':
      value = new java.lang.Double(value);
      break;
    case 'object':
      // If null then we just wrap it as an empty JSON message
      // We don't do this if it's a Java class (it has the getClass) method
      // since it may be a Buffer which we want to let through
      if (value == null || typeof value.getClass === "undefined") {
        // Not a Java object - assume JSON message
        value = new org.vertx.java.core.json.JsonObject(JSON.stringify(value));
      }
      break;
    default:
      throw 'Invalid type for filter: ' + type;
  }
  return value;
}

/**
 * A field/value based filter.
 */
filter.FieldFilter = function(fieldName, value) {
  this.__jfilter = new net.kuujo.vertigo.filter.FieldFilter(fieldName, convertValue(value));
}

/**
 * A source-based filter.
 */
filter.SourceFilter = function(source) {
  this.__jfilter = new net.kuujo.vertigo.filter.SourceFilter(source);
}

/**
 * A tags-based filter.
 */
filter.TagsFilter = function(tags) {
  this.__jfilter = new net.kuujo.vertigo.filter.TagsFilter(tags);
}

module.exports = filter;

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
 * The <code>vertigo/message</code> module provides classes for
 * wrapping Vertigo messages.
 * @exports vertigo/message
 */
var message = {}

/**
 * A component message.
 * @constructor
 */
message.Message = function(jmessage) {
  var that = this;

  this.__jmessage = jmessage;

  /**
   * The message correlation ID.
   */
  this.id = jmessage.id().correlationId();

  /**
   * The message body.
   */
  this.body = JSON.parse(jmessage.body().encode());

  /**
   * The stream on which the message arrived.
   */
  this.stream = jmessage.stream();

  /**
   * Indicates whether the message has a parent.
   */
  this.hasParent = function() { return jmessage.id().hasParent(); }

  /**
   * The parent message correlation ID.
   */
  this.parent = jmessage.id().parent();

  /**
   * Indicates whether the message has a root.
   */
  this.hasRoot = function() { return jmessage.id().hasRoot(); }

  /**
   * The root message correlation ID.
   */
  this.root = jmessage.id().root();

  /**
   * The message source address.
   */
  this.source = jmessage.source();

}

module.exports = message;

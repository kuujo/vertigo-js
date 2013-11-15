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
  this.__jmessage = jmessage;
  this.id = jmessage.id();
  this.body = JSON.parse(jmessage.body().encode());
  this.tag = jmessage.tag();
  this.parent = jmessage.parent();
  this.root = jmessage.root();
  this.source = jmessage.source();
  this.auditor = jmessage.auditor();

  /**
   * Copies the message.
   *
   * @returns {module:vertigo/message.Message} A copy of the message
   */
  this.copy = function() {
    return new message.Message(jmessage.copy());
  }
}

module.exports = message;

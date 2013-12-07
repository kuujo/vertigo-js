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

/**
 * The <code>vertigo/input</code> module provides classes for operating
 * on component inputs.
 * @exports vertigo/input
 */
var input = {}

/**
 * A component input.
 * @constructor
 */
input.Input = function(obj) {
  var that = this;

  if (typeof(obj) == 'string') {
    var jinput = new net.kuujo.vertigo.input.Input(obj);
  }
  else {
    var jinput = obj;
  }

  this.__jinput = jinput;

  /**
   * Get the input address.
   *
   * @returns {string} The input address.
   */
  this.address = function() {
    return jinput.getAddress();
  }

  /**
   * Gets or sets the input stream.
   *
   * @param {string} stream The input stream name.
   * @returns {string} The input stream name.
   */
  this.stream = function(stream) {
    if (stream === undefined) {
      return jinput.getStream();
    }
    else {
      jinput.setStream(stream);
      return that;
    }
  }

  /**
   * Adds an input grouping.
   *
   * @param {module:vertigo/grouping.Grouping} An input grouping.
   * @returns {module:vertigo/input.Input} this
   */
  this.groupBy = function(grouping) {
    if (typeof(grouping) == 'string') {
      jinput.groupBy(grouping);
    }
    else {
      jinput.groupBy(grouping.__jgrouping);
    }
    return that;
  }

  /**
   * Sets a random grouping on the input.
   */
  this.randomGrouping = function() {
    jinput.randomGrouping();
    return that;
  }

  /**
   * Sets a round-robin grouping on the input.
   */
  this.roundGrouping = function() {
    jinput.roundGrouping();
    return that;
  }

  /**
   * Sets a fields grouping on the input.
   */
  this.fieldsGrouping = function(fields) {
    jinput.fieldsGrouping(fields);
    return that;
  }

  /**
   * Sets an all grouping on the input.
   */
  this.allGrouping = function() {
    jinput.allGrouping();
    return that;
  }

}

/**
 * An input listener.
 * @constructor
 */
input.Listener = function(obj) {
  var that = this;

  if (typeof(obj) == 'string' || obj.__jinput !== undefined) {
    var jlistener = new net.kuujo.vertigo.input.DefaultListener(obj, __jvertx, __jcontainer.logger());
  }
  else {
    var jlistener = obj;
  }

  this.__jlistener = jlistener;

  /**
   * Sets or gets auto acking setting for the listener.
   *
   * @param {boolean} [autoAck] Indicates whether to auto-ack received messages
   * @returns {module:vertigo/input.Listener} this
   */
  this.autoAck = function(autoAck) {
    if (autoAck === undefined) {
      return jlistener.isAutoAck();
    }
    else {
      jlistener.setAutoAck(autoAck);
      return that;
    }
  }

  /**
   * Starts the listener.
   *
   * @param {Handler} [handler] An optional asynchronous handler to be called once the
   * listener has been started.
   * @returns {module:vertigo/input.Listener} this
   */
  this.start = function(handler) {
    if (handler) {
      handler = adaptAsyncResultHandler(handler);
      jlistener.start(handler);
    }
    else {
      jlistener.start();
    }
    return that;
  }

  /**
   * Sets a message handler on the listener.
   *
   * @param {Handler} handler A handler to be called when each message is received.
   * @returns {module:vertigo/input.Listener} this
   */
  this.messageHandler = function(handler) {
    jlistener.messageHandler(function(jmessage) {
      handler(new message.Message(jmessage));
    });
    return that;
  }

  /**
   * Acks a message.
   *
   * @param {module:vertigo/message.Message} The message to ack.
   * @returns {module:vertigo/input.Listener} this
   */
  this.ack = function(message) {
    jlistener.ack(message.__jmessage);
    return that;
  }

  /**
   * Fails a message.
   *
   * @param {module:vertigo/message.Message} The message to fail.
   * @returns {module:vertigo/input.Listener} this
   */
  this.fail = function(message) {
    jlistener.fail(message.__jmessage);
    return that;
  }

  /**
   * Stops the listener.
   *
   * @param {Handler} [handler] An optional asynchronous handler to be called once the
   * listener has been started.
   */
  this.stop = function(handler) {
    if (handler) {
      handler = adaptAsyncResultHandler(handler);
      jlistener.stop(handler);
    }
    else {
      jlistener.stop();
    }
  }

}

module.exports = input;

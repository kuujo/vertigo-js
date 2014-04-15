/*
 * Copyright 2014 the original author or authors.
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
 * The 'output' module provides an interface for handling component output
 * messages.
 * @exports output
 */
var output = {};

/**
 * The output collector wraps a set of output ports.
 * @constructor
 */
output.OutputCollector = function(jcollector) {
  this.__jcollector = jcollector;
  var that = this;
  var ports = {};

  /**
   * Loads an output port.
   *
   * @param {string} name The output port name.
   * @returns {module:vertigo/output.OutputPort} An output port instance.
   */
  this.port = function(name) {
    if (ports[name] === undefined) {
      ports[name] = new output.OutputPort(jcollector.port(name));
    }
    return ports[name];
  }

}

/**
 * A named input port.
 * @constructor
 */
output.OutputPort = function(jport) {
  this.__jport = jport;
  var that = this;

  /**
   * The output port name.
   */
  this.name = jport.name();

  /**
   * Sets or gets the maximum send queue size for the port.
   *
   * @param {number} [maxSize] The maximum size for the port.
   */
  this.sendQueueMaxSize = function(maxSize) {
    if (maxSize === undefined) {
      return jport.getSendQueueMaxSize();
    } else {
      jport.setSendQueueMaxSize(maxSize);
      return that;
    }
  }

  /**
   * Checks whether the send queue is full.
   *
   * @return {boolean} Indicates whether the send queue is full.
   */
  this.sendQueueFull = function() {
    return jport.sendQueueFull();
  }

  /**
   * Sets a drain handler on the port.
   *
   * @param {function} handler A handler to be called when the output is ready to
   *                           accept new messages.
   * @returns {module:vertigo/output.OutputPort} this
   */
  this.drainHandler = function(handler) {
    jport.drainHandler(new org.vertx.java.core.Handler({handle: handler}));
    return that;
  }

  /**
   * Sends a message.
   *
   * @param message The message to send.
   * @returns {module:vertigo/output.OutputPort} this
   */
  this.send = function(message) {
    jport.send(convertMessage(message));
    return that;
  }

  /**
   * Creates a new output group.
   *
   * @param {string} group The name of the group to create.
   * @param {function} handler A handler to be called once the group has been created.
   * @returns {module:vertigo/output.Outputport} this
   */
  this.group = function(group, handler) {
    jport.group(group, new org.vertx.java.core.Handler({
      handle: function(jgroup) {
        handler(new output.OutputGroup(jgroup));
      }
    }));
    return that;
  }

}

output.OutputGroup = function(jgroup) {
  this.__jgroup = jgroup;
  var that = this;

  this.name = jgroup.name();

  /**
   * Sets or gets the maximum send queue size for the group.
   *
   * @param {number} [maxSize] The maximum size for the group.
   */
  this.sendQueueMaxSize = function(maxSize) {
    if (maxSize === undefined) {
      return jgroup.getSendQueueMaxSize();
    } else {
      jgroup.setSendQueueMaxSize(maxSize);
      return that;
    }
  }

  /**
   * Checks whether the send queue is full.
   *
   * @return {boolean} Indicates whether the send queue is full.
   */
  this.sendQueueFull = function() {
    return jgroup.sendQueueFull();
  }

  /**
   * Sets a drain handler on the group.
   *
   * @param {function} handler A handler to be called when the output is ready to
   *                           accept new messages.
   * @returns {module:vertigo/output.OutputGroup} this
   */
  this.drainHandler = function(handler) {
    jgroup.drainHandler(new org.vertx.java.core.Handler({handle: handler}));
    return that;
  }

  /**
   * Sends a message.
   *
   * @param message The message to send.
   * @returns {module:vertigo/output.OutputGroup} this
   */
  this.send = function(message) {
    jgroup.send(convertMessage(message));
    return that;
  }

  /**
   * Creates a new output group.
   *
   * @param {string} group The name of the group to create.
   * @param {function} handler A handler to be called once the group has been created.
   * @returns {module:vertigo/output.OutputGroup} this
   */
  this.group = function(group, handler) {
    jgroup.group(group, new org.vertx.java.core.Handler({
      handle: function(jgroup) {
        handler(new output.OutputGroup(jgroup));
      }
    }));
    return that;
  }

  /**
   * Ends the output group.
   *
   * This method must be called after all messages for the group have been
   * sent. Output groups are asynchronous, so Vertigo must be notified once
   * a group has completed.
   *
   * @returns {module:vertigo/output.OutputGroup} this
   */
  this.end = function() {
    jgroup.end();
    return that;
  }

}

function convertMessage(message) {
  if (message === null || message === undefined) return '';
  var msgType = typeof message;
  switch (msgType) {
    case 'string':
    case 'boolean':
    case 'org.vertx.java.core.json.JsonArray':
    case 'org.vertx.java.core.buffer.Buffer':
      break;
    case 'number':
      message = new java.lang.Double(message);
      break;
    case 'object':
      if (message instanceof Array) {
        message = new org.vertx.java.core.json.JsonArray(message);
      } else if (typeof message.getClass === "undefined") {
        message = new org.vertx.java.core.json.JsonObject(JSON.stringify(message));
      }
      break;
    default:
      throw 'Invalid type for message: ' + msgType;
  }
  return message;
}

module.exports = output;

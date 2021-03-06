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
 * The 'input' module provides an interface for handling component input
 * messages.
 * @exports input
 */
var input = {};
var component = require('vertigo/component');

if (component.__jcomponent === undefined) {
  throw "Not a valid Vertigo component.";
}

/**
 * The input collector wraps a set of input ports.
 * @constructor
 */
input.InputCollector = function(jcollector) {
  this.__jcollector = jcollector;
  var that = this;
  var ports = {};

  /**
   * Loads an input port.
   *
   * @param {string} name The input port name.
   * @returns {module:vertigo/input.InputPort} An input port instance.
   */
  this.port = function(name) {
    if (ports[name] === undefined) {
      ports[name] = new input.InputPort(jcollector.port(name));
    }
    return ports[name];
  }

}

/**
 * A named input port.
 * @constructor
 */
input.InputPort = function(jport) {
  this.__jport = jport;
  var that = this;

  /**
   * The input port name.
   */
  this.name = jport.name();

  /**
   * Pauses receiving messages on the input.
   *
   * @returns {module:vertigo/input.InputPort} this
   */
  this.pause = function() {
    jport.pause();
    return that;
  }

  /**
   * Resumes receiving messages on the input.
   *
   * @returns {module:vertigo/input.InputPort} this
   */
  this.resume = function() {
    jport.resume();
    return that;
  }

  /**
   * Sets a message handler on the input.
   *
   * @param {function} handler A handler to be called when a message is received.
   * @returns {module:vertigo/input.InputPort} this
   */
  this.messageHandler = function(handler) {
    jport.messageHandler(new org.vertx.java.core.Handler({
      handle: function(jmessage) {
        handler(convertMessage(jmessage));
      }
    }));
    return that;
  }

  /**
   * Sets a batch handler on the input.
   *
   * @param {function} handler A handler to be called when a new batch is received.
   * @returns {module:vertigo/input.InputBatch} this
   */
  this.batchHandler = function(handler) {
    jport.batchHandler(new org.vertx.java.core.Handler({
      handle: function(jbatch) {
        handler(new input.InputBatch(jbatch));
      }
    }));
    return that;
  }

  /**
   * Sets a named group handler on the input.
   *
   * @param {string} group The name of the group.
   * @param {function} handler A handler to be called when a new group of the given name is received.
   * @returns {module:vertigo/input.InputPort} this
   */
  this.groupHandler = function(group, handler) {
    jport.groupHandler(group, new org.vertx.java.core.Handler({
      handle: function(jgroup) {
        handler(new input.InputGroup(jgroup));
      }
    }));
    return that;
  }
}

/**
 * Input batch.
 * @constructor
 */
input.InputBatch = function(jbatch) {
  this.__jbatch = jbatch;
  var that = this;

  /**
   * The unique input batch identifier.
   */
  this.id = jbatch.id();

  /**
   * Pauses receiving messages on the input.
   *
   * @returns {module:vertigo/input.InputBatch} this
   */
  this.pause = function() {
    jbatch.pause();
    return that;
  }

  /**
   * Resumes receiving messages on the input.
   *
   * @returns {module:vertigo/input.InputBatch} this
   */
  this.resume = function() {
    jbatch.resume();
    return that;
  }

  /**
   * Sets a start handler on the batch.
   *
   * @param {function} handler A handler to be called when the batch is started.
   * @returns {module:vertigo/input.InputBatch} this
   */
  this.startHandler = function(handler) {
    jbatch.startHandler(new org.vertx.java.core.Handler({
      handle: handler
    }));
    return that;
  }

  /**
   * Sets a message handler on the batch.
   *
   * @param {function} handler A handler to be called when a message is received within the batch.
   * @returns {module:vertigo/input.InputBatch} this
   */
  this.messageHandler = function(handler) {
    jbatch.messageHandler(new org.vertx.java.core.Handler({
      handle: function(jmessage) {
        handler(convertMessage(jmessage));
      }
    }));
    return that;
  }

  /**
   * Sets a named group handler on the input.
   *
   * @param {string} group The name of the group.
   * @param {function} handler A handler to be called when a new group of the given name is received.
   * @returns {module:vertigo/input.InputBatch} this
   */
  this.groupHandler = function(group, handler) {
    jbatch.groupHandler(group, new org.vertx.java.core.Handler({
      handle: function(jgroup) {
        handler(new input.InputGroup(jgroup));
      }
    }));
    return that;
  }

  /**
   * Sets an end handler on the batch.
   *
   * @param {function} handler A handler to be called once the batch is complete.
   * @returns {module:vertigo/input.InputBatch} this
   */
  this.endHandler = function(handler) {
    jbatch.endHandler(new org.vertx.java.core.Handler({
      handle: handler
    }));
    return that;
  }
}

/**
 * Named input group.
 * @constructor
 */
input.InputGroup = function(jgroup) {
  this.__jgroup = jgroup;
  var that = this;

  /**
   * The unique input group identifier.
   */
  this.id = jgroup.id();

  /**
   * The input group name.
   */
  this.name = jgroup.name();

  /**
   * Pauses receiving messages on the input.
   *
   * @returns {module:vertigo/input.InputGroup} this
   */
  this.pause = function() {
    jgroup.pause();
    return that;
  }

  /**
   * Resumes receiving messages on the input.
   *
   * @returns {module:vertigo/input.InputGroup} this
   */
  this.resume = function() {
    jgroup.resume();
    return that;
  }

  /**
   * Sets a start handler on the group.
   *
   * @param {function} handler A handler to be called when the group is started.
   * @returns {module:vertigo/input.InputGroup} this
   */
  this.startHandler = function(handler) {
    jgroup.startHandler(new org.vertx.java.core.Handler({
      handle: handler
    }));
    return that;
  }

  /**
   * Sets a message handler on the group.
   *
   * @param {function} handler A handler to be called when a message is received within the group.
   * @returns {module:vertigo/input.InputGroup} this
   */
  this.messageHandler = function(handler) {
    jgroup.messageHandler(new org.vertx.java.core.Handler({
      handle: function(jmessage) {
        handler(convertMessage(jmessage));
      }
    }));
    return that;
  }

  /**
   * Sets a named group handler on the input.
   *
   * @param {string} group The name of the group.
   * @param {function} handler A handler to be called when a new group of the given name is received.
   * @returns {module:vertigo/input.InputGroup} this
   */
  this.groupHandler = function(group, handler) {
    jgroup.groupHandler(group, new org.vertx.java.core.Handler({
      handle: function(jgroup) {
        handler(new input.InputGroup(jgroup));
      }
    }));
    return that;
  }

  /**
   * Sets an end handler on the group.
   *
   * @param {function} handler A handler to be called once the group is complete.
   * @returns {module:vertigo/input.InputGroup} this
   */
  this.endHandler = function(handler) {
    jgroup.endHandler(new org.vertx.java.core.Handler({
      handle: handler
    }));
    return that;
  }
}

var jsonObjectClass = new org.vertx.java.core.json.JsonObject().getClass();
var jsonArrayClass  = new org.vertx.java.core.json.JsonArray().getClass();

function convertMessage(jmessage) {
  if (typeof jmessage === 'object') {
    var clazz = jmessage.getClass();
    if (clazz === jsonObjectClass || clazz === jsonArrayClass) {
      // Convert to JS JSON
      if (jmessage) {
        jmessage = JSON.parse(jmessage.encode());
      } else {
        jmessage = undefined;
      }
    }
  } else if (jmessage && typeof jmessage === 'org.vertx.java.core.json.JsonObject') {
    // DynJS returns a fully qualified class name for `typeof` on most
    // java objects, so we need to check for this too.
    jmessage = JSON.parse(jmessage.encode());
  }
  return jmessage;
};

module.exports = new input.InputCollector(component.__jcomponent.input());

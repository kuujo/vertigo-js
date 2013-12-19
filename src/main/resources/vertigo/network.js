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

load("vertx/helpers.js");

var input = require('vertigo/input');
var context = require('vertigo/context');

/**
 * The <code>vertigo/network</code> module provides classes for creating
 * Vertigo networks and components.
 * @exports vertigo/network
 */
var network = {}

/**
 * A Vertigo network.
 * @constructor
 */
network.Network = function(obj) {
  var that = this;

  if (typeof obj == 'string') {
    var jnetwork = new net.kuujo.vertigo.network.Network(obj);
  }
  else {
    var jnetwork = obj;
  }

  this.__jnetwork = jnetwork;

  /**
   * Gets the network address.
   *
   * @returns {string} The network address.
   */
  this.address = function() {
    return jnetwork.getAddress();
  }

  /**
   * Enables acking on the network.
   *
   * @returns {module:vertigo/network.Network} this
   */
  this.enableAcking = function() {
    jnetwork.enableAcking();
    return that;
  }

  /**
   * Disables acking on the network.
   *
   * @returns {module:vertigo/network.Network} this
   */
  this.disableAcking = function() {
    jnetwork.disableAcking();
    return that;
  }

  /**
   * Indicates whether acking is enabled on the network.
   *
   * @returns {Boolean} indicates whether acking is enabled.
   */
  this.ackingEnabled = function() {
    return jnetwork.isAckingEnabled();
  }

  /**
   * Sets or gets the number of network auditors.
   *
   * @param {Integer} [num] The number of network auditors.
   */
  this.numAuditors = function(num) {
    if (num === undefined) {
      return jnetwork.getNumAuditors();
    }
    else {
      jnetwork.setNumAuditors(num);
      return that;
    }
  }

  /**
   * Sets or gets the network ack timeout.
   *
   * @param {Integer} [timeout] The network ack timeout.
   */
  this.ackTimeout = function(timeout) {
    if (timeout === undefined) {
      return jnetwork.getAckTimeout();
    }
    else {
      jnetwork.setAckTimeout(timeout);
      return that;
    }
  }

  /**
   * Adds a component to the network.
   *
   * @param {module:vertigo/network.Verticle|module:vertigo/network.Module} the component to add
   * @returns {module:vertigo/network.Network} this
   */
  this.addComponent = function(component) {
    jnetwork.addComponent(component.__jcomponent);
    return component;
  }

  /**
   * Adds a feeder component to the network.
   *
   * @param {string} address The feeder address
   * @param {string} main The feeder main or module name
   * @param {object} [config] The feeder configuration
   * @param {number} [instances] The number of feeder component instances
   */
  this.addFeeder = function(address, main) {
    var args = Array.prototype.slice.call(arguments);
    args.shift();
    args.shift();
    var instances = getArgValue('number', args);
    var config = getArgValue('object', args);
    if (config != null) {
      config = new org.vertx.java.core.json.JsonObject(JSON.stringify(config));
    }
    if (config != null && instances != null) {
      return new network.Component(jnetwork.addFeeder(address, main, config, instances));
    }
    else if (config != null) {
      return new network.Component(jnetwork.addFeeder(address, main, config));
    }
    else if (instances != null) {
      return new network.Component(jnetwork.addFeeder(address, main, instances));
    }
    else {
      return new network.Component(jnetwork.addFeeder(address, main));
    }
  }

  /**
   * Adds an executor component to the network.
   *
   * @param {string} address The executor address
   * @param {string} main The executor main or module name
   * @param {object} [config] The executor configuration
   * @param {number} [instances] The number of executor component instances
   */
  this.addExecutor = function(address, main) {
    var args = Array.prototype.slice.call(arguments);
    args.shift();
    args.shift();
    var instances = getArgValue('number', args);
    var config = getArgValue('object', args);
    if (config != null) {
      config = new org.vertx.java.core.json.JsonObject(JSON.stringify(config));
    }
    if (config != null && instances != null) {
      return new network.Component(jnetwork.addExecutor(address, main, config, instances));
    }
    else if (config != null) {
      return new network.Component(jnetwork.addExecutor(address, main, config));
    }
    else if (instances != null) {
      return new network.Component(jnetwork.addExecutor(address, main, instances));
    }
    else {
      return new network.Component(jnetwork.addExecutor(address, main));
    }
  }

  /**
   * Adds a worker component to the network.
   *
   * @param {string} address The worker address
   * @param {string} main The worker main or module name
   * @param {object} [config] The worker configuration
   * @param {number} [instances] The number of worker component instances
   */
  this.addWorker = function(address, main) {
    var args = Array.prototype.slice.call(arguments);
    args.shift();
    args.shift();
    var instances = getArgValue('number', args);
    var config = getArgValue('object', args);
    if (config != null) {
      config = new org.vertx.java.core.json.JsonObject(JSON.stringify(config));
    }
    if (config != null && instances != null) {
      return new network.Component(jnetwork.addWorker(address, main, config, instances));
    }
    else if (config != null) {
      return new network.Component(jnetwork.addWorker(address, main, config));
    }
    else if (instances != null) {
      return new network.Component(jnetwork.addWorker(address, main, instances));
    }
    else {
      return new network.Component(jnetwork.addWorker(address, main));
    }
  }

}

/**
 * A network component.
 * @constructor
 */
network.Component = function(obj) {
  var that = this;
  var hook = null;
  var jcomponent = obj;

  this.__jcomponent = jcomponent;

  /**
   * Gets the component address.
   *
   * @returns {string} The component address.
   */
  this.address = function() {
    return jcomponent.getAddress();
  }

  /**
   * Gets the component type.
   *
   * @returns {string} The component type.
   */
  this.type = function() {
    return net.kuujo.vertigo.util.Component.serializeType(jcomponent.getType());
  }

  /**
   * Returns a boolean indicating whether this component is a module.
   */
  this.isModule = function() {
    return jcomponent.isModule();
  }

  /**
   * Returns a boolean indicating whether this component is a verticle.
   */
  this.isVerticle = function() {
    return jcomponent.isVerticle();
  }

  /**
   * Sets or gets the component main.
   *
   * @param {String} [main] The component main.
   */
  this.main = function(main) {
    if (main === undefined) {
      return jcomponent.getMain();
    }
    else {
      jcomponent.setMain(main);
      return that;
    }
  }

  /**
   * Sets or gets the component module name.
   *
   * @param {String} [main] The component module name.
   */
  this.module = function(moduleName) {
    if (moduleName === undefined) {
      return jcomponent.getModule();
    }
    else {
      jcomponent.setModule(moduleName);
      return that;
    }
  }

  /**
   * Sets or gets the component configuration.
   *
   * @param {Object} [config] The JSON component configuration.
   */
  this.config = function(config) {
    if (config === undefined) {
      return JSON.parse(jcomponent.getConfig().encode());
    }
    else {
      jcomponent.setConfig(new org.vertx.java.core.json.JsonObject(JSON.stringify(config)));
      return that;
    }
  }

  /**
   * Sets or gets the number of component instances.
   *
   * @param {Integer} [instances] The number of component instances.
   */
  this.instances = function(instances) {
    if (instances === undefined) {
      return jcomponent.getInstances();
    }
    else {
      jcomponent.setInstances(instances);
      return that;
    }
  }

  /**
   * Adds a hook handler for a specific component event.
   *
   * @param {String} event The hook event.
   * @param {Handler} handler A hook handler.
   * @returns {module:vertigo/network.Component} this
   */
  this.addHook = function(event, handler) {
    if (hook == null) {
      hook = new net.kuujo.vertigo.hooks.EventBusHookListener(jcomponent.getAddress(), __jvertx.eventBus());
      jcomponent.addHook(new net.kuujo.vertigo.hooks.EventBusHook());
    }

    switch (event) {
      case 'start':
        hook.startHandler(new org.vertx.java.core.Handler({
          handle: function(jcontext) {
            handler(new context.InstanceContext(jcontext));
          }
        }));
        break;
      case 'receive':
        hook.receiveHandler(new org.vertx.java.core.Handler({
          handle: function(messageId) {
            handler(messageId.correlationId());
          }
        }));
        break;
      case 'ack':
        hook.ackHandler(new org.vertx.java.core.Handler({
          handle: function(messageId) {
            handler(messageId.correlationId());
          }
        }));
        break;
      case 'fail':
        hook.failHandler(new org.vertx.java.core.Handler({
          handle: function(messageId) {
            handler(messageId.correlationId());
          }
        }));
        break;
      case 'emit':
        hook.emitHandler(new org.vertx.java.core.Handler({
          handle: function(messageId) {
            handler(messageId.correlationId());
          }
        }));
        break;
      case 'acked':
        hook.ackedHandler(new org.vertx.java.core.Handler({
          handle: function(messageId) {
            handler(messageId.correlationId());
          }
        }));
        break;
      case 'failed':
        hook.failedHandler(new org.vertx.java.core.Handler({
          handle: function(messageId) {
            handler(messageId.correlationId());
          }
        }));
        break;
      case 'timeout':
        hook.timeoutHandler(new org.vertx.java.core.Handler({
          handle: function(messageId) {
            handler(messageId.correlationId());
          }
        }));
        break;
      case 'stop':
        hook.stopHandler(new org.vertx.java.core.Handler({
          handle: function(jcontext) {
            handler(new context.InstanceContext(jcontext));
          }
        }));
        break;
    }
    return that;
  }

  /**
   * Adds an input to the component.
   *
   * @param {string} address The input address.
   * @param {string} stream The stream to which to subscribe.
   * @returns {module:vertigo/input.Input} The added input instance
   */
  this.addInput = function(address, stream) {
    if (stream !== undefined) {
      return new input.Input(jcomponent.addInput(address).setStream(stream));
    }
    else {
      return new input.Input(jcomponent.addInput(address));
    }
  }

}

module.exports = network;

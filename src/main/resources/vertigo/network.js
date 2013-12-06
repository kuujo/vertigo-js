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

  this.address = jnetwork.getAddress();

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
   * @param {object} config The feeder configuration
   * @param {number} instances The number of feeder component instances
   */
  this.addFeeder = function(address) {
    var args = Array.prototype.slice.call(arguments);
    args.shift();
    var instances = getArgValue('number', args);
    var config = getArgValue('object', args);
    var main = getArgValue('string', args);
    if (config != null) {
      config = new org.vertx.java.core.json.JsonObject(JSON.stringify(config));
    }
    if (main != null && config != null && instances != null) {
      return new network.Component(jnetwork.addFeeder(address, main, config, instances));
    }
    else if (main != null && config != null) {
      return new network.Component(jnetwork.addFeeder(address, main, config));
    }
    else if (main != null && config != null) {
      return new network.Component(jnetwork.addFeeder(address, main, instances));
    }
    else if (main != null) {
      return new network.Component(jnetwork.addFeeder(address, main));
    }
    else {
      return new network.Component(jnetwork.addFeeder(address));
    }
  }

  /**
   * Adds an executor component to the network.
   *
   * @param {string} address The executor address
   * @param {string} main The executor main or module name
   * @param {object} config The executor configuration
   * @param {number} instances The number of executor component instances
   */
  this.addExecutor = function(address) {
    var args = Array.prototype.slice.call(arguments);
    args.shift();
    var instances = getArgValue('number', args);
    var config = getArgValue('object', args);
    var main = getArgValue('string', args);
    if (config != null) {
      config = new org.vertx.java.core.json.JsonObject(JSON.stringify(config));
    }
    if (main != null && config != null && instances != null) {
      return new network.Component(jnetwork.addExecutor(address, main, config, instances));
    }
    else if (main != null && config != null) {
      return new network.Component(jnetwork.addExecutor(address, main, config));
    }
    else if (main != null && config != null) {
      return new network.Component(jnetwork.addExecutor(address, main, instances));
    }
    else if (main != null) {
      return new network.Component(jnetwork.addExecutor(address, main));
    }
    else {
      return new network.Component(jnetwork.addExecutor(address));
    }
  }

  /**
   * Adds a worker component to the network.
   *
   * @param {string} address The worker address
   * @param {string} main The worker main or module name
   * @param {object} config The worker configuration
   * @param {number} instances The number of worker component instances
   */
  this.addWorker = function(address) {
    var args = Array.prototype.slice.call(arguments);
    args.shift();
    var instances = getArgValue('number', args);
    var config = getArgValue('object', args);
    var main = getArgValue('string', args);
    if (config != null) {
      config = new org.vertx.java.core.json.JsonObject(JSON.stringify(config));
    }
    if (main != null && config != null && instances != null) {
      return new network.Component(jnetwork.addWorker(address, main, config, instances));
    }
    else if (main != null && config != null) {
      return new network.Component(jnetwork.addWorker(address, main, config));
    }
    else if (main != null && config != null) {
      return new network.Component(jnetwork.addWorker(address, main, instances));
    }
    else if (main != null) {
      return new network.Component(jnetwork.addWorker(address, main));
    }
    else {
      return new network.Component(jnetwork.addWorker(address));
    }
  }

  /**
   * Adds a filter component to the network.
   *
   * @param {string} address The filter address
   * @param {string} main The filter main or module name
   * @param {object} config The filter configuration
   * @param {number} instances The number of filter component instances
   */
  this.addFilter = function(address) {
    var args = Array.prototype.slice.call(arguments);
    args.shift();
    var instances = getArgValue('number', args);
    var config = getArgValue('object', args);
    var main = getArgValue('string', args);
    if (config != null) {
      config = new org.vertx.java.core.json.JsonObject(JSON.stringify(config));
    }
    if (main != null && config != null && instances != null) {
      return new network.Component(jnetwork.addFilter(address, main, config, instances));
    }
    else if (main != null && config != null) {
      return new network.Component(jnetwork.addFilter(address, main, config));
    }
    else if (main != null && config != null) {
      return new network.Component(jnetwork.addFilter(address, main, instances));
    }
    else if (main != null) {
      return new network.Component(jnetwork.addFilter(address, main));
    }
    else {
      return new network.Component(jnetwork.addFilter(address));
    }
  }

  /**
   * Adds a splitter component to the network.
   *
   * @param {string} address The splitter address
   * @param {string} main The splitter main or module name
   * @param {object} config The splitter configuration
   * @param {number} instances The number of splitter component instances
   */
  this.addSplitter = function(address) {
    var args = Array.prototype.slice.call(arguments);
    args.shift();
    var instances = getArgValue('number', args);
    var config = getArgValue('object', args);
    var main = getArgValue('string', args);
    if (config != null) {
      config = new org.vertx.java.core.json.JsonObject(JSON.stringify(config));
    }
    if (main != null && config != null && instances != null) {
      return new network.Component(jnetwork.addSplitter(address, main, config, instances));
    }
    else if (main != null && config != null) {
      return new network.Component(jnetwork.addSplitter(address, main, config));
    }
    else if (main != null && config != null) {
      return new network.Component(jnetwork.addSplitter(address, main, instances));
    }
    else if (main != null) {
      return new network.Component(jnetwork.addSplitter(address, main));
    }
    else {
      return new network.Component(jnetwork.addSplitter(address));
    }
  }

  /**
   * Adds an aggregator component to the network.
   *
   * @param {string} address The aggregator address
   * @param {string} main The aggregator main or module name
   * @param {object} config The aggregator configuration
   * @param {number} instances The number of aggregator component instances
   */
  this.addAggregator = function(address) {
    var args = Array.prototype.slice.call(arguments);
    args.shift();
    var instances = getArgValue('number', args);
    var config = getArgValue('object', args);
    var main = getArgValue('string', args);
    if (config != null) {
      config = new org.vertx.java.core.json.JsonObject(JSON.stringify(config));
    }
    if (main != null && config != null && instances != null) {
      return new network.Component(jnetwork.addAggregator(address, main, config, instances));
    }
    else if (main != null && config != null) {
      return new network.Component(jnetwork.addAggregator(address, main, config));
    }
    else if (main != null && config != null) {
      return new network.Component(jnetwork.addAggregator(address, main, instances));
    }
    else if (main != null) {
      return new network.Component(jnetwork.addAggregator(address, main));
    }
    else {
      return new network.Component(jnetwork.addAggregator(address));
    }
  }

}

/**
 * Adds an event handler to an event bus hook listener.
 */
var add_hook = function(listener, event, handler) {
  switch (event) {
    case 'start':
      listener.startHandler(new org.vertx.java.core.Handler({
        handle: function(jcontext) {
          handler(new context.InstanceContext(jcontext));
        }
      }));
      break;
    case 'receive':
      listener.receiveHandler(new org.vertx.java.core.Handler({handle: handler}));
      break;
    case 'ack':
      listener.ackHandler(new org.vertx.java.core.Handler({handle: handler}));
      break;
    case 'fail':
      listener.failHandler(new org.vertx.java.core.Handler({handle: handler}));
      break;
    case 'emit':
      listener.emitHandler(new org.vertx.java.core.Handler({handle: handler}));
      break;
    case 'acked':
      listener.ackedHandler(new org.vertx.java.core.Handler({handle: handler}));
      break;
    case 'failed':
      listener.failedHandler(new org.vertx.java.core.Handler({handle: handler}));
      break;
    case 'timeout':
      listener.timeoutHandler(new org.vertx.java.core.Handler({handle: handler}));
      break;
    case 'stop':
      listener.stopHandler(new org.vertx.java.core.Handler({
        handle: function(jcontext) {
          handler(new context.InstanceContext(jcontext));
        }
      }));
      break;
  }
}

/**
 * A network component.
 * @constructor
 */
network.Component = function(obj) {
  var that = this;
  var hook = null;

  if (typeof(obj) == 'string') {
    var jcomponent = new net.kuujo.vertigo.network.Verticle(obj);
  }
  else {
    var jcomponent = obj;
  }

  this.__jcomponent = jcomponent;
  this.type = net.kuujo.vertigo.util.Component.deserializeType(jcomponent.getType());
  this.address = jcomponent.getAddress();

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
    jcomponent.addHook(new net.kuujo.vertigo.hooks.EventBusHook());
    if (hook == null) {
      hook = new net.kuujo.vertigo.hooks.EventBusHookListener(jcomponent.getAddress(), __jvertx.eventBus());
    }
    add_hook(hook, event, handler);
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
    return new input.Input(jcomponent.addInput(address, stream));
  }

}

module.exports = network;

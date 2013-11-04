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
var network = {}

load("vertx/helpers.js");

var input = require('vertigo/input');

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
   * Gets or sets the network broadcast address.
   */
  this.broadcastAddress = function(address) {
    if (address === undefined) {
      return jnetwork.getBroadcastAddress();
    }
    else {
      jnetwork.setBroadcastAddress(address);
      return that;
    }
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
   * @returns {boolean} indicates whether acking is enabled.
   */
  this.ackingEnabled = function() {
    return jnetwork.isAckingEnabled();
  }

  /**
   * Sets or gets the number of network auditors.
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
   * Sets or gets the network ack expiration.
   */
  this.ackExpire = function(expire) {
    if (expire === undefined) {
      return jnetwork.getAckExpire();
    }
    else {
      jnetwork.setAckExpire(expire);
      return that;
    }
  }

  /**
   * Sets or gets the network ack delay.
   */
  this.ackDelay = function(delay) {
    if (delay === undefined) {
      return jnetwork.getAckExpire();
    }
    else {
      jnetwork.setAckExpire(delay);
      return that;
    }
  }

  /**
   * Adds a component to the network.
   */
  this.addComponent = function(component) {
    jnetwork.addComponent(component.__jcomponent);
    return component;
  }

  /**
   * Adds a verticle component to the network.
   *
   * @param {string} address The network address
   * @param {string} main The verticle main
   * @param {object} config The verticle configuration
   * @param {number} instances The number of component instances
   */
  this.addVerticle = function(address) {
    var args = Array.prototype.slice.call(arguments);
    args.shift();
    var instances = getArgValue('number', args);
    var config = getArgValue('object', args);
    var main = getArgValue('string', args);
    if (config != null) {
      config = new org.vertx.java.core.json.JsonObject(JSON.stringify(config));
    }
    if (main != null && config != null && instances != null) {
      return new network.Verticle(jnetwork.addVerticle(address, main, config, instances));
    }
    else if (main != null && config != null) {
      return new network.Verticle(jnetwork.addVerticle(address, main, config));
    }
    else if (main != null && config != null) {
      return new network.Verticle(jnetwork.addVerticle(address, main, instances));
    }
    else if (main != null) {
      return new network.Verticle(jnetwork.addVerticle(address, main));
    }
    else {
      return new network.Verticle(jnetwork.addVerticle(address));
    }
  }

  /**
   * Adds a module component to the network.
   *
   * @param {string} address The network address
   * @param {string} moduleName The module name
   * @param {object} config The module configuration
   * @param {number} instances The number of component instances
   */
  this.addModule = function(address) {
    var args = Array.prototype.slice.call(arguments);
    args.shift();
    var instances = getArgValue('number', args);
    var config = getArgValue('object', args);
    var moduleName = getArgValue('string', args);
    if (config != null) {
      config = new org.vertx.java.core.json.JsonObject(JSON.stringify(config));
    }
    if (moduleName != null && config != null && instances != null) {
      return new network.Module(jnetwork.addModule(address, moduleName, config, instances));
    }
    else if (moduleName != null && config != null) {
      return new network.Module(jnetwork.addModule(address, moduleName, config));
    }
    else if (moduleName != null && config != null) {
      return new network.Module(jnetwork.addModule(address, moduleName, instances));
    }
    else if (moduleName != null) {
      return new network.Module(jnetwork.addModule(address, moduleName));
    }
    else {
      return new network.Module(jnetwork.addModule(address));
    }
  }

}

/**
 * A verticle component.
 * @constructor
 */
network.Verticle = function(obj) {
  var that = this;

  if (typeof(obj) == 'string') {
    var jcomponent = new net.kuujo.vertigo.network.Verticle(obj);
  }
  else {
    var jcomponent = obj;
  }

  this.__jcomponent = jcomponent;

  this.type = 'verticle';
  this.address = jcomponent.getAddress();

  /**
   * Sets or gets the verticle main.
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
   * Sets or gets the verticle configuration.
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
   */
  this.instances = function(instances) {
    if (instances === undefined) {
      return jcomponent.getNumInstances();
    }
    else {
      jcomponent.setNumInstances(instances);
      return that;
    }
  }

  /**
   * Adds an input to the component.
   *
   * @param {string} address The input address
   * @returns {module:vertigo/input.Input} The added input instance
   */
  this.addInput = function(address) {
    return new input.Input(jcomponent.addInput(address));
  }

}

/**
 * A module component.
 * @constructor
 */
network.Module = function(obj) {
  var that = this;

  if (typeof(obj) == 'string') {
    var jcomponent = new net.kuujo.vertigo.network.Module(obj);
  }
  else {
    var jcomponent = obj;
  }

  this.__jcomponent = jcomponent;

  this.type = 'module';
  this.address = jcomponent.getAddress();

  /**
   * Sets or gets the module name.
   */
  this.module = function(module) {
    if (module === undefined) {
      return jcomponent.getModule();
    }
    else {
      jcomponent.setModule(module);
      return that;
    }
  }

  /**
   * Sets or gets the module configuration.
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
   */
  this.instances = function(instances) {
    if (instances === undefined) {
      return jcomponent.getNumInstances();
    }
    else {
      jcomponent.setNumInstances(instances);
      return that;
    }
  }

  /**
   * Adds an input to the component.
   *
   * @param {string} address The input address
   * @returns {module:vertigo/input.Input} The added input instance
   */
  this.addInput = function(address) {
    return new input.Input(jcomponent.addInput(address));
  }

}

module.exports = network;

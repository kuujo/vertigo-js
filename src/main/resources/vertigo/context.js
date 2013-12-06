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
 * The <code>vertigo/context</code> module provides classes for creating
 * Vertigo networks and components.
 * @exports vertigo/context
 */
var context = {};

/**
 * An instance context.
 * @constructor
 */
context.InstanceContext = function(jcontext) {
  var that = this;
  this.__jcontext = jcontext;

  this.id = jcontext.id();

  /**
   * Returns the instance type.
   */
  this.type = function() {
    return that.component().type();
  }

  /**
   * Returns the parent component context.
   *
   * @returns {module:vertigo/context.ComponentContext} The parent context
   */
  this.component = function() {
    return new context.ComponentContext(jcontext.getComponent());
  }

}

/**
 * A component context.
 * @constructor
 */
context.ComponentContext = function(jcontext) {
  this.__jcontext = jcontext;

  var address = jcontext.getAddress();

  /**
   * Returns the component type.
   */
  this.type = function() {
    return net.kuujo.vertigo.util.Component.serializeType(jcontext.getType());
  }

  /**
   * Indicates whether the component is a verticle.
   */
  this.isVerticle = function() {
    return jcontext.isVerticle();
  }

  /**
   * Indicates whether the component is a module.
   */
  this.isModule = function() {
    return jcontext.isModule();
  }

  /**
   * Returns the component main. If the component is not a verticle
   * then null will be returned.
   */
  this.main = function() {
    if (that.isVerticle()) {
      return jcontext.getMain();
    }
    return null;
  }

  /**
   * Returns the component module name. If the component is not a module
   * then null will be returned.
   */
  this.module = function() {
    if (that.isModule()) {
      return jcontext.getModule();
    }
    return null;
  }

  /**
   * Returns the component configuration.
   *
   * @returns {object} The component configuration
   */
  this.config = function() {
    var config = jcontext.getConfig();
    if (config != null) {
      return JSON.parse(config.encode());
    }
    else {
      return {};
    }
  }

  /**
   * Returns an array of instance contexts.
   *
   * @returns {array} An array of instance contexts
   */
  this.instances = function() {
    var contexts = jcontext.getInstances().toArray();
    var arr = new Array(contexts.length);
    for (var i = 0; i < contexts.length; i++) {
      arr[i] = new context.InstanceContext(contexts[i]);
    }
    return arr;
  }

  /**
   * Returns the parent network context.
   *
   * @returns {module:vertigo/context.NetworkContext} The parent context
   */
  var network = function() {
    return new context.NetworkContext(jcontext.getNetwork());
  }

}

/**
 * A network context.
 * @constructor
 */
context.NetworkContext = function(jcontext) {
  this.__jcontext = jcontext;

  this.address = jcontext.getAddress();

  /**
   * Returns an array of network auditor addresses.
   */
  this.auditors = function() {
    return jcontext.getAuditors().toArray();
  }

  /**
   * Indicates whether acking is enabled on the network.
   */
  this.ackingEnabled = function() {
    return jcontext.isAckingEnabled();
  }

  /**
   * Returns an array of network component contexts.
   *
   * @returns {array} An array of component contexts
   */
  this.components = function() {
    var contexts = jcontext.getComponents().toArray();
    var arr = new Array(contexts.length);
    for (var i = 0; i < contexts.length; i++) {
      arr[i] = new context.ComponentContext(contexts[i]);
    }
    return arr;
  }

  /**
   * Gets a component context at a specific address.
   *
   * @param {string} address The component address
   * @returns {module:vertigo/context.ComponentContext} The component context
   */
  this.component = function(address) {
    var component = jcontext.getComponent(address);
    if (component != null) {
      return new context.ComponentContext(component);
    }
    return null;
  }

}

module.exports = context;

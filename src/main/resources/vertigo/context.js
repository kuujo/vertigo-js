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

  /**
   * Gets the instance ID.
   *
   * @returns {string} The unique instance ID.
   */
  this.id = function() {
    return jcontext.id();
  }

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
    var component = jcontext.component();
    if (component instanceof net.kuujo.vertigo.context.ModuleContext) {
      return new context.ModuleContext(component);
    }
    else if (component instanceof net.kuujo.vertigo.context.VerticleContext) {
      return new context.VerticleContext(component);
    }
  }

}

/**
 * A component context.
 * @constructor
 */
context.ComponentContext = function(jcontext) {
  var that = this;
  this.__jcontext = jcontext;

  /**
   * Gets the component address.
   *
   * @returns {string} The component address.
   */
  this.address = function() {
    return jcontext.address();
  }

  /**
   * Returns the component type.
   */
  this.type = function() {
    return net.kuujo.vertigo.util.Component.serializeType(jcontext.type());
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
   * Returns the component configuration.
   *
   * @returns {object} The component configuration
   */
  this.config = function() {
    var config = jcontext.config();
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
    var contexts = jcontext.instances().toArray();
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
  this.network = function() {
    return new context.NetworkContext(jcontext.network());
  }

}

/**
 * A module context.
 * @constructor
 */
context.ModuleContext = function(jcontext) {
  var that = this;
  var component = new context.ComponentContext(jcontext);
  this.__jcontext = jcontext;

  /**
   * Gets the component address.
   *
   * @returns {string} The component address.
   */
  this.address = function() {
    return component.address();
  }

  /**
   * Returns the component type.
   */
  this.type = function() {
    return component.type();
  }

  /**
   * Indicates whether the component is a verticle.
   */
  this.isVerticle = function() {
    return component.isVerticle();
  }

  /**
   * Indicates whether the component is a module.
   */
  this.isModule = function() {
    return component.isModule();
  }

  /**
   * Returns the component module name. If the component is not a module
   * then null will be returned.
   */
  this.module = function() {
    if (that.isModule()) {
      return jcontext.module();
    }
    return null;
  }

  /**
   * Returns the component configuration.
   *
   * @returns {object} The component configuration
   */
  this.config = function() {
    return component.config();
  }

  /**
   * Returns an array of instance contexts.
   *
   * @returns {array} An array of instance contexts
   */
  this.instances = function() {
    return component.instances();
  }

  /**
   * Returns the parent network context.
   *
   * @returns {module:vertigo/context.NetworkContext} The parent context
   */
  this.network = function() {
    return new context.NetworkContext(jcontext.network());
  }
  
}

/**
 * A verticle context.
 * @constructor
 */
context.VerticleContext = function(jcontext) {
  var that = this;
  var component = new context.ComponentContext(jcontext);
  this.__jcontext = jcontext;

  /**
   * Gets the component address.
   *
   * @returns {string} The component address.
   */
  this.address = function() {
    return component.address();
  }

  /**
   * Returns the component type.
   */
  this.type = function() {
    return component.type();
  }

  /**
   * Indicates whether the component is a verticle.
   */
  this.isVerticle = function() {
    return component.isVerticle();
  }

  /**
   * Indicates whether the component is a module.
   */
  this.isModule = function() {
    return component.isModule();
  }

  /**
   * Returns the component main. If the component is not a verticle
   * then null will be returned.
   */
  this.main = function() {
    if (that.isVerticle()) {
      return jcontext.main();
    }
    return null;
  }

  /**
   * Returns the component configuration.
   *
   * @returns {object} The component configuration
   */
  this.config = function() {
    return component.config();
  }

  /**
   * Returns an array of instance contexts.
   *
   * @returns {array} An array of instance contexts
   */
  this.instances = function() {
    return component.instances();
  }

  /**
   * Returns the parent network context.
   *
   * @returns {module:vertigo/context.NetworkContext} The parent context
   */
  this.network = function() {
    return new context.NetworkContext(jcontext.network());
  }
  
}

/**
 * A network context.
 * @constructor
 */
context.NetworkContext = function(jcontext) {
  var that = this;
  this.__jcontext = jcontext;

  /**
   * Gets the network address.
   *
   * @returns {string} The network address.
   */
  this.address = function() {
    return jcontext.address();
  }

  /**
   * Returns an array of network auditor addresses.
   */
  this.auditors = function() {
    return jcontext.auditors().toArray();
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
    var contexts = jcontext.components().toArray();
    var components = {};
    for (var i = 0; i < contexts.length; i++) {
      var component = contexts[i];
      if (component instanceof net.kuujo.vertigo.context.ModuleContext) {
        components[component.address()] = new context.ModuleContext(component);
      }
      else if (component instanceof net.kuujo.vertigo.context.VerticleContext) {
        components[component.address()] = new context.VerticleContext(component);
      }
    }
    return components;
  }

  /**
   * Gets a component context at a specific address.
   *
   * @param {string} address The component address
   * @returns {module:vertigo/context.ComponentContext} The component context
   */
  this.component = function(address) {
    var component = jcontext.component(address);
    if (component != null) {
      if (component instanceof net.kuujo.vertigo.context.ModuleContext) {
        return new context.ModuleContext(component);
      }
      else if (component instanceof net.kuujo.vertigo.context.VerticleContext) {
        return new context.VerticleContext(component);
      }
    }
    return null;
  }

}

module.exports = context;

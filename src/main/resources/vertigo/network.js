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
load('vertx/helpers.js');

/**
 * The 'network' module provides the primary interface for defining
 * and operating on Vertigo networks.
 * @exports network
 */
var network = {};

/**
 * Network configuration.
 * @constructor
 */
network.NetworkConfig = function(jnetwork) {
  this.__jnetwork = jnetwork;
  var that = this;

  /**
   * Returns the network name.
   *
   * @returns {string} The network name.
   */
  this.name = function() {
    return jnetwork.getName();
  }

  /**
   * Sets or gets the network scope.
   *
   * @param {string} [scope] The network scope. Either "local" or "cluster"
   */
  this.scope = function(scope) {
    if (scope === undefined) {
      return jnetwork.getScope().toString();
    } else {
      jnetwork.setScope(net.kuujo.vertigo.cluster.ClusterScope.parse(scope));
      return that;
    }
  }

  /**
   * Adds a component to the network.
   *
   * @param {string} name The component name.
   * @param {string} main The component module name or verticle main.
   * @param {object} [config] The component configuration.
   * @param {number} [instances] The number of component instances to add.
   *
   * @returns {module:vertigo/network.VerticleConfig|module:vertigo/network.ModuleConfig} The added component configuration.
   */
  this.addComponent = function(name, main) {
    var args = Array.prototype.slice.call(arguments);
    args.shift();
    args.shift();
    var instances = getArgValue('number', args);
    if (instances === null) {
      instances = 1;
    }
    var config = getArgValue('object', args);
    if (config != null) {
      config = new org.vertx.java.core.json.JsonObject(JSON.stringify(config));
    } else {
      config = new org.vertx.java.core.json.JsonObject();
    }

    var component = jnetwork.addComponent(name, main, config, instances);

    if (component instanceof net.kuujo.vertigo.network.ModuleConfig) {
      return new network.ModuleConfig(component);
    }
    else if (component instanceof net.kuujo.vertigo.network.VerticleConfig) {
      return new network.VerticleConfig(component);
    }
  }

  /**
   * Removes a component from the network.
   *
   * @param {string} name The name of the component to remove.
   *
   * @returns {module:vertigo/network.NetworkConfig} The network configuraiton.
   */
  this.removeComponent = function(name) {
    jnetwork.removeComponent(name);
    return that;
  }

  /**
   * Adds a module component to the network.
   *
   * @param {string} name The component name.
   * @param {string} module The module name.
   * @param {object} [config] The module configuration.
   * @param {number} [instances] The number of component instances to add.
   *
   * @returns {module:vertigo/network.ModuleConfig} The added module configuration.
   */
  this.addModule = function(name, module) {
    var args = Array.prototype.slice.call(arguments);
    args.shift();
    args.shift();
    var instances = getArgValue('number', args);
    if (instances === null) {
      instances = 1;
    }
    var config = getArgValue('object', args);
    if (config != null) {
      config = new org.vertx.java.core.json.JsonObject(JSON.stringify(config));
    } else {
      config = new org.vertx.java.core.json.JsonObject();
    }
    return new network.ModuleConfig(jnetwork.addModule(name, module, config, instances));
  }

  /**
   * Removes a module component from the network.
   *
   * @param {string} name The name of the module component to remove.
   *
   * @returns {module:vertigo/network.NetworkConfig} The network configuraiton.
   */
  this.removeModule = function(name) {
    jnetwork.removeModule(name);
    return that;
  }

  /**
   * Adds a verticle component to the network.
   *
   * @param {string} name The component name.
   * @param {string} main The verticle main.
   * @param {object} [config] The verticle configuration.
   * @param {number} [instances] The number of component instances to add.
   *
   * @returns {module:vertigo/network.VerticleConfig} The added verticle configuration.
   */
  this.addVerticle = function(name, main) {
    var args = Array.prototype.slice.call(arguments);
    args.shift();
    args.shift();
    var instances = getArgValue('number', args);
    if (instances === null) {
      instances = 1;
    }
    var config = getArgValue('object', args);
    if (config != null) {
      config = new org.vertx.java.core.json.JsonObject(JSON.stringify(config));
    } else {
      config = new org.vertx.java.core.json.JsonObject();
    }
    return new network.VerticleConfig(jnetwork.addVerticle(name, main, config, instances));
  }

  /**
   * Removes a verticle component from the network.
   *
   * @param {string} name The name of the verticle component to remove.
   *
   * @returns {module:vertigo/network.NetworkConfig} The network configuraiton.
   */
  this.removeVerticle = function(name) {
    jnetwork.removeVerticle(name);
    return that;
  }

  /**
   * Creates a connection between two components in the network.
   *
   * @param {string} source The source component name.
   * @param {string} outPort The source component's output port to connect.
   * @param {string} target The target component name.
   * @param {string} inPort The target component's input port to which to connect.
   *
   * @returns {module:vertigo/network.ConnectionConfig} The added connection configuration.
   */
  this.createConnection = function(source, outPort, target, inPort) {
    return new network.ConnectionConfig(jnetwork.createConnection(source, outPort, target, inPort));
  }

  /**
   * Destroys a connection between two components.
   *
   * @param {string} source The source component name.
   * @param {string} outPort The source component's output port.
   * @param {string} target The target component name.
   * @param {string} inPort The target component's input port.
   *
   * @returns {module:vertigo/network.NetworkConfig} this
   */
  this.destroyConnection = function(source, outPort, target, inPort) {
    jnetwork.destroyConnection(source, outPort, target, inPort);
    return that;
  }

}

/**
 * A network component.
 * @constructor
 */
network.ComponentConfig = function(jcomponent) {
  var that = this;

  this.__jcomponent = jcomponent;

  /**
   * Gets the component name.
   *
   * @returns {string} The component name.
   */
  this.name = function() {
    return jcomponent.getName();
  }

  /**
   * Gets the component type.
   *
   * @returns {string} The component type.
   */
  this.type = function() {
    return jcomponent.getType().toString();
  }

  /**
   * Sets or gets the component configuration.
   *
   * @param {object} [config] The JSON component configuration.
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
   * @param {number} [instances] The number of component instances.
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
   * Sets or gets the component deployment group.
   *
   * @param {string} [group] The component deployment group.
   */
  this.group = function(group) {
    if (group === undefined) {
      return jcomponent.getGroup();
    }
    else {
      jcomponent.setGroup(group);
      return that;
    }
  }

}

/**
 * A network module component.
 * @constructor
 */
network.ModuleConfig = function(jcomponent) {
  var that = this;
  var component = new network.ComponentConfig(jcomponent);

  this.__jcomponent = jcomponent;

  /**
   * Gets the component name.
   *
   * @returns {string} The component name.
   */
  this.name = function() {
    return component.name();
  }

  /**
   * Gets the component type.
   *
   * @returns {string} The component type.
   */
  this.type = function() {
    return component.type();
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
   * @param {object} [config] The JSON component configuration.
   */
  this.config = function(config) {
    return component.config(config);
  }

  /**
   * Sets or gets the number of component instances.
   *
   * @param {number} [instances] The number of component instances.
   */
  this.instances = function(instances) {
    return component.instances(instances);
  }

  /**
   * Sets or gets the component deployment group.
   *
   * @param {string} [group] The component deployment group.
   */
  this.group = function(group) {
    return component.group(group);
  }

}

/**
 * A network verticle component.
 * @constructor
 */
network.VerticleConfig = function(jcomponent) {
  var that = this;
  var component = new network.ComponentConfig(jcomponent);

  this.__jcomponent = jcomponent;

  /**
   * Gets the component name.
   *
   * @returns {string} The component name.
   */
  this.name = function() {
    return component.name();
  }

  /**
   * Gets the component type.
   *
   * @returns {string} The component type.
   */
  this.type = function() {
    return component.type();
  }

  /**
   * Sets or gets the component main.
   *
   * @param {string} [main] The component main.
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
   * Sets or gets the component configuration.
   *
   * @param {object} [config] The JSON component configuration.
   */
  this.config = function(config) {
    return component.config();
  }

  /**
   * Sets or gets the number of component instances.
   *
   * @param {number} [instances] The number of component instances.
   */
  this.instances = function(instances) {
    return component.instances();
  }

  /**
   * Sets or gets whether the verticle is a worker.
   *
   * @param {boolean} [worker] Indicates whether the verticle is a worker.
   */
  this.worker = function(worker) {
    if (worker === undefined) {
      return jcomponent.isWorker();
    }
    else {
      jcomponent.setWorker(worker);
      return that;
    }
  }

  /**
   * Sets or gets whether the verticle is multi-threaded.
   *
   * @param {boolean} [multiThreaded] Indicates whether the verticle is multi-threaded.
   */
  this.multiThreaded = function(multiThreaded) {
    if (multiThreaded === undefined) {
      return jcomponent.isMultiThreaded();
    }
    else {
      jcomponent.setMultiThreaded(multiThreaded);
      return that;
    }
  }

  /**
   * Sets or gets the component deployment group.
   *
   * @param {string} [group] The component deployment group.
   */
  this.group = function(group) {
    return component.group(group);
  }

}

/**
 * Connection configuration.
 * @constructor
 */
network.ConnectionConfig = function(jconnection) {
  var that = this;
  this.__jconnection = jconnection;

  /**
   * Returns the connection source.
   */
  this.source = function() {
    return new Endpoint(jconnection.getSource());
  }

  /**
   * Returns the connection target.
   */
  this.target = function() {
    return new Endpoint(jconnection.getTarget());
  }

  /**
   * Sets a round selector on the connection.
   */
  this.roundSelect = function() {
    jconnection.roundSelect();
    return that;
  }

  /**
   * Sets a random selector on the connection.
   */
  this.randomSelect = function() {
    jconnection.randomSelect();
    return that;
  }

  /**
   * Sets a hash selector on the connection.
   */
  this.hashSelect = function() {
    jconnection.hashSelect();
    return that;
  }

  /**
   * Sets a fair selector on the connection.
   */
  this.fairSelect = function() {
    jconnection.fairSelect();
    return that;
  }

  /**
   * Sets an all selector on the connection.
   */
  this.allSelect = function() {
    jconnection.allSelect();
    return that;
  }

  var Endpoint = function(jendpoint) {
    var that = this;
    this.__jendpoint = jendpoint;

    /**
     * Sets or gets the endpoint component.
     */
    this.component = function(component) {
      if (component === undefined) {
        return jendpoint.getComponent();
      } else {
        jendpoint.setComponent(component);
        return that;
      }
    }

    /**
     * Sets or gets the endpoint port.
     */
    this.port = function(port) {
      if (port === undefined) {
        return jendpoint.getPort();
      } else {
        jendpoint.setPort(port);
        return that;
      }
    }

  }

}

/**
 * Active network configuration.
 * @constructor
 */
network.ActiveNetwork = function(jnetwork) {
  this.__jnetwork = jnetwork;
  var that = this;

  /**
   * Returns the network name.
   */
  this.name = function() {
    return jnetwork.getConfig().getName();
  }

  /**
   * Adds a component to the network.
   *
   * @param {string} name The component name.
   * @param {string} main The component module name or verticle main.
   * @param {object} [config] The component configuration.
   * @param {number} [instances] The number of component instances to add.
   * @param {function} [handler] A handler to be called once the network has been updated.
   *
   * @returns {module:vertigo/network.VerticleConfig|module:vertigo/network.ModuleConfig} The added component configuration.
   */
  this.addComponent = function(name, main) {
    var args = Array.prototype.slice.call(arguments);
    args.shift();
    args.shift();
    var handler = getArgValue('function', args);
    if (handler !== null) {
      handler = adaptAsyncResultHandler(handler, function(result) {
        return new network.ActiveNetwork(result);
      });
    }
    var instances = getArgValue('number', args);
    if (instances === null) {
      instances = 1;
    }
    var config = getArgValue('object', args);
    if (config != null) {
      config = new org.vertx.java.core.json.JsonObject(JSON.stringify(config));
    } else {
      config = new org.vertx.java.core.json.JsonObject();
    }

    var component = null;
    if (handler !== null) {
      component = jnetwork.addComponent(name, main, config, instances, handler);
    } else {
      component = jnetwork.addComponent(name, main, config, instances);
    }

    if (component instanceof net.kuujo.vertigo.network.ModuleConfig) {
      return new network.ModuleConfig(component);
    }
    else if (component instanceof net.kuujo.vertigo.network.VerticleConfig) {
      return new network.VerticleConfig(component);
    }
  }

  /**
   * Removes a component from the network.
   *
   * @param {string} name The name of the component to remove.
   * @param {function} [handler] A handler to be called once the network has been updated.
   *
   * @returns {module:vertigo/network.NetworkConfig} The network configuraiton.
   */
  this.removeComponent = function(name, handler) {
    if (handler !== undefined) {
      jnetwork.removeComponent(adaptAsyncResultHandler(handler));
    } else {
      jnetwork.removeComponent(name);
    }
    return that;
  }

  /**
   * Adds a module component to the network.
   *
   * @param {string} name The component name.
   * @param {string} module The module name.
   * @param {object} [config] The module configuration.
   * @param {number} [instances] The number of component instances to add.
   * @param {function} [handler] A handler to be called once the network has been updated.
   *
   * @returns {module:vertigo/network.ModuleConfig} The added module configuration.
   */
  this.addModule = function(name, module) {
    var args = Array.prototype.slice.call(arguments);
    args.shift();
    args.shift();
    var handler = getArgValue('function', args);
    if (handler !== null) {
      handler = adaptAsyncResultHandler(handler, function(result) {
        return new network.ActiveNetwork(result);
      });
    }
    var instances = getArgValue('number', args);
    if (instances === null) {
      instances = 1;
    }
    var config = getArgValue('object', args);
    if (config != null) {
      config = new org.vertx.java.core.json.JsonObject(JSON.stringify(config));
    } else {
      config = new org.vertx.java.core.json.JsonObject();
    }

    if (handler !== null) {
      return new network.ModuleConfig(jnetwork.addModule(name, module, config, instances, handler));
    } else {
      return new network.ModuleConfig(jnetwork.addModule(name, module, config, instances));
    }
  }

  /**
   * Removes a module component from the network.
   *
   * @param {string} name The name of the module component to remove.
   * @param {function} [handler] A handler to be called once the network has been updated.
   *
   * @returns {module:vertigo/network.NetworkConfig} The network configuraiton.
   */
  this.removeModule = function(name, handler) {
    if (handler !== undefined) {
      jnetwork.removeModule(adaptAsyncResultHandler(handler));
    } else {
      jnetwork.removeModule(name);
    }
    return that;
  }

  /**
   * Adds a verticle component to the network.
   *
   * @param {string} name The component name.
   * @param {string} main The verticle main.
   * @param {object} [config] The verticle configuration.
   * @param {number} [instances] The number of component instances to add.
   * @param {function} [handler] A handler to be called once the network has been updated.
   *
   * @returns {module:vertigo/network.VerticleConfig} The added verticle configuration.
   */
  this.addVerticle = function(name, main) {
    var args = Array.prototype.slice.call(arguments);
    args.shift();
    args.shift();
    var handler = getArgValue('function', args);
    if (handler !== null) {
      handler = adaptAsyncResultHandler(handler, function(result) {
        return new network.ActiveNetwork(result);
      });
    }
    var instances = getArgValue('number', args);
    if (instances === null) {
      instances = 1;
    }
    var config = getArgValue('object', args);
    if (config != null) {
      config = new org.vertx.java.core.json.JsonObject(JSON.stringify(config));
    } else {
      config = new org.vertx.java.core.json.JsonObject();
    }

    if (handler !== null) {
      return new network.VerticleConfig(jnetwork.addVerticle(name, main, config, instances, handler));
    } else {
      return new network.VerticleConfig(jnetwork.addVerticle(name, main, config, instances));
    }
  }

  /**
   * Removes a verticle component from the network.
   *
   * @param {string} name The name of the verticle component to remove.
   * @param {function} [handler] A handler to be called once the network has been updated.
   *
   * @returns {module:vertigo/network.NetworkConfig} The network configuraiton.
   */
  this.removeVerticle = function(name, handler) {
    if (handler !== undefined) {
      jnetwork.removeVerticle(adaptAsyncResultHandler(handler));
    } else {
      jnetwork.removeVerticle(name);
    }
    return that;
  }

  /**
   * Creates a connection between two components in the network.
   *
   * @param {string} source The source component name.
   * @param {string} outPort The source component's output port to connect.
   * @param {string} target The target component name.
   * @param {string} inPort The target component's input port to which to connect.
   *
   * @returns {module:vertigo/network.ConnectionConfig} The added connection configuration.
   */
  this.createConnection = function(source, outPort, target, inPort, handler) {
    if (handler !== undefined) {
      handler = adaptAsyncResultHandler(handler, function(result) {
        return new network.ActiveNetwork(result);
      });
      return new network.ConnectionConfig(jnetwork.createConnection(source, outPort, target, inPort, handler));
    }
    return new network.ConnectionConfig(jnetwork.createConnection(source, outPort, target, inPort));
  }

  /**
   * Destroys a connection between two components.
   *
   * @param {string} source The source component name.
   * @param {string} outPort The source component's output port.
   * @param {string} target The target component name.
   * @param {string} inPort The target component's input port.
   *
   * @returns {module:vertigo/network.NetworkConfig} this
   */
  this.destroyConnection = function(source, outPort, target, inPort, handler) {
    if (handler !== undefined) {
      handler = adaptAsyncResultHandler(handler, function(result) {
        return new network.ActiveNetwork(result);
      });
      jnetwork.destroyConnection(source, outPort, target, inPort, handler);
    } else {
      jnetwork.destroyConnection(source, outPort, target, inPort);
    }
    return that;
  }

}

module.exports = network;

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
var network = require('vertigo/network');

/**
 * The 'vertigo' module provides the primary Vertigo API for creating
 * and deploying networks and working with Vertigo components.
 * @exports vertigo
 */
var vertigo = {};

this.__jvertigo = new net.kuujo.vertigo.Vertigo(__jvertx, __jcontainer);

/**
 * The Vertigo component instance.
 *
 * While the Vertigo component module is always available, it will not
 * be useful unless the current Vert.x verticle is a Vertigo component
 * deployed by a Vertigo network.
 *
 * @see module:vertigo/component.Component
 */
vertigo.component = require('vertigo/component');

/**
 * Creates a new network.
 *
 * @param {string|object} config The network name or json configuration.
 *
 * @returns {module:vertigo/network.NetworkConfig} A network configuration.
 */
vertigo.createNetwork = function(config) {
  if (typeof(config) === 'string') {
    return new network.NetworkConfig(__jvertigo.createNetwork(config));
  }
  return new network.NetworkConfig(__jvertigo.createNetwork(new org.vertx.java.core.json.JsonObject(JSON.stringify(config))));
}

/**
 * Cluster manager.
 * @constructor
 */
vertigo.ClusterManager = function(jmanager) {
  var that = this;
  this.__jmanager = jmanager;

  /**
   * The cluster address.
   */
  this.address = jmanager.address();

  /**
   * Loads a network from the cluster.
   *
   * @param {string} network The network to load.
   * @param {function} handler A handler to be called once the network is loaded.
   *
   * @returns {module:vertigo.ClusterManager} The cluster manager.
   */
  this.getNetwork = function(network, handler) {
    handler = adaptAsyncResultHandler(handler, function(result) {
      return new network.ActiveNetwork(result);
    });
    jmanager.getNetwork(network, handler);
    return that;
  }

  /**
   * Loads a list of networks from the cluster.
   *
   * @param {function} handler A handler to be called once the networks are loaded.
   *
   * @returns {module:vertigo.ClusterManager} The cluster manager.
   */
  this.getNetworks = function(handler) {
    jmanager.getNetworks(adaptAsyncResultHandler(handler, function(result) {
      var iterator = result.iterator();
      var results = [];
      while (iterator.hasNext()) {
        results.push(new network.ActiveNetwork(iterator.next()));
      }
      return results;
    }));
    return that;
  }

  /**
   * Deploys a network.
   *
   * @param {string|module:vertigo/network.NetworkConfig} config A network name or configuration.
   * @param {function} [handler] A handler to be called once deployment is complete.
   *
   * @returns {module:vertigo.ClusterManager} The cluster manager.
   */
  this.deployNetwork = function(config, handler) {
    if (handler !== undefined) {
      handler = adaptAsyncResultHandler(handler, function(result) {
        return new network.ActiveNetwork(result);
      });
    }

    if (typeof(config) === 'string') {
      jmanager['deployNetwork(java.lang.String,org.vertx.java.core.Handler)'](config, handler);
    } else if (config.__jnetwork !== undefined) {
      jmanager['deployNetwork(net.kuujo.vertigo.network.NetworkConfig,org.vertx.java.core.Handler)'](config.__jnetwork, handler);
    } else {
      jmanager['deployNetwork(org.vertx.java.core.json.JsonObject,org.vertx.java.core.Handler)'](new org.vertx.java.core.json.JsonObject(JSON.stringify(config)), handler);
    }
    return that;
  }

  /**
   * Undeploys a network.
   *
   * @param {string|module:vertigo/network.NetworkConfig} config A network name or configuration.
   * @param {function} handler A handler to be called once undeployment is complete.
   *
   * @returns {module:vertigo.ClusterManager} The cluster manager.
   */
  this.undeployNetwork = function(config, handler) {
    if (handler !== undefined) {
      handler = adaptAsyncResultHandler(handler);
    }

    if (typeof(config) === 'string') {
      jmanager['undeployNetwork(java.lang.String,org.vertx.java.core.Handler)'](config, handler);
    } else if (config.__jnetwork !== undefined) {
      jmanager['undeployNetwork(net.kuujo.vertigo.network.NetworkConfig,org.vertx.java.core.Handler)'](config.__jnetwork, handler);
    } else {
      jmanager['undeployNetwork(org.vertx.java.core.json.JsonObject,org.vertx.java.core.Handler)'](new org.vertx.java.core.json.JsonObject(JSON.stringify(config)), handler);
    }
    return that;
  }

}

/**
 * Deploys a cluster.
 *
 * @param {string} address The cluster address.
 * @param {number} [nodes] The number of nodes to deploy.
 * @param {function} [handler] A handler to be called once complete.
 *
 * @returns {module:vertigo} The vertigo module.
 */
vertigo.deployCluster = function(address) {
  var args = Array.prototype.slice.call(arguments);
  args.shift();
  var handler = getArgValue('function', args);
  if (handler !== null) {
    handler = adaptAsyncResultHandler(handler, function(result) {
      return new vertigo.ClusterManager(result);
    });
  }
  var nodes = getArgValue('number', args);
  if (nodes === null) {
    nodes = 1;
  }
  __jvertigo.deployCluster(address, nodes, handler);
  return vertigo;
}

/**
 * Gets a cluster.
 *
 * @param {string} cluster The cluster address.
 *
 * @returns {module:vertigo/cluster.ClusterManager} A cluster manager.
 */
vertigo.getCluster = function(cluster) {
  return new vertigo.ClusterManager(__jvertigo.getCluster(cluster));
}

/**
 * Deploys a network to a specific cluster.
 *
 * @param {string} cluster The cluster to which to deploy the network.
 * @param {string|module:vertigo/network.NetworkConfig|object} The network to deploy.
 * @param {function} [handler] A handler to be called once complete.
 *
 * @returns {module:vertigo/cluster.ClusterManager} A cluster manager.
 */
vertigo.deployNetwork = function(cluster, config, handler) {
  vertigo.getCluster(cluster).deployNetwork(config, handler);
  return vertigo;
}

/**
 * Undeploys a network from a specific cluster.
 * @param {string} cluster The cluster from which to undeploy the network.
 * @param {string|module:vertigo/network.NetworkConfig|object} The network to undeploy.
 * @param {function} [handler] A handler to be called once complete.
 *
 * @returns {module:vertigo/cluster.ClusterManager} A cluster manager.
 */
vertigo.undeployNetwork = function(cluster, config, handler) {
  vertigo.getCluster(cluster).undeployNetwork(config, handler);
  return vertigo;
}

module.exports = vertigo;

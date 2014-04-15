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
 * The 'cluster' module provides an interface for distributed deployments
 * within a Vertigo cluster.
 * @exports cluster
 */
var cluster = {};

/**
 * Vertigo cluster. Vertigo supports two types of clusters - local
 * and remote - and the cluster that is made available depends on the method
 * by which a given network was deployed. For example, if a network was deployed
 * as a local network then the cluster will perform deployments using the Vert.x
 * container. Alternatively, if the network was deployed as a remote network then
 * the cluster will perform deployments across multiple Vert.x instances over
 * the event bus.
 * @constructor
 */
cluster.VertigoCluster = function(jcluster) {
  var that = this;
  this.__jcluster = jcluster;

  /**
   * Checks whether a deployment is deployed in the cluster.
   *
   * @param {string} deploymentID The deployment ID to check.
   * @param {function} handler A handler to be called with the result.
   * @returns {module:vertigo/cluster.VertigoCluster} this
   */
  this.isDeployed = function(deploymentID, handler) {
    jcluster.isDeployed(deploymentID, adaptAsyncResultHandler(handler));
    return that;
  }

  /**
   * Deploys a module to the cluster.
   *
   * @param {string} deploymentID The unique module deployment ID.
   * @param {string} module The module name.
   * @param {object} [config] The module configuration.
   * @param {number} [instances] The number of instances to deploy.
   * @param {function} [handler] A handler to be called once complete.
   * @returns {module:vertigo/cluster.VertigoCluster} this
   */
  this.deployModule = function(deploymentID, module) {
    var args = Array.prototype.slice.call(arguments);
    args.shift();
    args.shift();
    var handler = getArgValue('function', args);
    if (handler != null) {
      handler = adaptAsyncResultHandler(handler);
    }
    var instances = getArgValue('number', args);
    if (instances == null) {
      instances = 1;
    }
    var config = getArgValue('object', args);
    if (config != null) {
      config = new org.vertx.java.core.json.JsonObject(JSON.stringify(config));
    } else {
      config = new org.vertx.java.core.json.JsonObject();
    }
    if (handler != null) {
      jcluster.deployModule(deploymentID, module, config, instances, handler);
    } else {
      jcluster.deployModule(deploymentID, module, config, instances);
    }
    return that;
  }

  /**
   * Deploys a module to a specific HA group in the cluster.
   *
   * @param {string} deploymentID The unique module deployment ID.
   * @param {string} group The HA group to which to deploy the module.
   * @param {string} module The module name.
   * @param {object} [config] The module configuration.
   * @param {number} [instances] The number of instances to deploy.
   * @param {function} [handler] A handler to be called once complete.
   * @returns {module:vertigo/cluster.VertigoCluster} this
   */
  this.deployModuleTo = function(deploymentID, group, module) {
    var args = Array.prototype.slice.call(arguments);
    args.shift();
    args.shift();
    args.shift();
    var handler = getArgValue('function', args);
    if (handler != null) {
      handler = adaptAsyncResultHandler(handler);
    }
    var instances = getArgValue('number', args);
    if (instances == null) {
      instances = 1;
    }
    var config = getArgValue('object', args);
    if (config != null) {
      config = new org.vertx.java.core.json.JsonObject(JSON.stringify(config));
    } else {
      config = new org.vertx.java.core.json.JsonObject();
    }
    if (handler != null) {
      jcluster.deployModuleTo(deploymentID, group, module, config, instances, handler);
    } else {
      jcluster.deployModuleTo(deploymentID, group, module, config, instances);
    }
    return that;
  }

  /**
   * Deploys a verticle to the cluster.
   *
   * @param {string} deploymentID The unique verticle deployment ID.
   * @param {string} main The verticle main.
   * @param {object} [config] The verticle configuration.
   * @param {number} [instances] The number of instances to deploy.
   * @param {function} [handler] A handler to be called once complete.
   * @returns {module:vertigo/cluster.VertigoCluster} this
   */
  this.deployVerticle = function(deploymentID, main) {
    var args = Array.prototype.slice.call(arguments);
    args.shift();
    args.shift();
    var handler = getArgValue('function', args);
    if (handler != null) {
      handler = adaptAsyncResultHandler(handler);
    }
    var instances = getArgValue('number', args);
    if (instances == null) {
      instances = 1;
    }
    var config = getArgValue('object', args);
    if (config != null) {
      config = new org.vertx.java.core.json.JsonObject(JSON.stringify(config));
    } else {
      config = new org.vertx.java.core.json.JsonObject();
    }
    if (handler != null) {
      jcluster.deployVerticle(deploymentID, main, config, instances, handler);
    } else {
      jcluster.deployVerticle(deploymentID, main, config, instances);
    }
    return that;
  }

  /**
   * Deploys a verticle to a specific HA group in the cluster.
   *
   * @param {string} deploymentID The unique verticle deployment ID.
   * @param {string} group The HA group to which to deploy the verticle.
   * @param {string} main The verticle main.
   * @param {object} [config] The verticle configuration.
   * @param {number} [instances] The number of instances to deploy.
   * @param {function} [handler] A handler to be called once complete.
   * @returns {module:vertigo/cluster.VertigoCluster} this
   */
  this.deployVerticleTo = function(deploymentID, group, main) {
    var args = Array.prototype.slice.call(arguments);
    args.shift();
    args.shift();
    args.shift();
    var handler = getArgValue('function', args);
    if (handler != null) {
      handler = adaptAsyncResultHandler(handler);
    }
    var instances = getArgValue('number', args);
    if (instances == null) {
      instances = 1;
    }
    var config = getArgValue('object', args);
    if (config != null) {
      config = new org.vertx.java.core.json.JsonObject(JSON.stringify(config));
    } else {
      config = new org.vertx.java.core.json.JsonObject();
    }
    if (handler != null) {
      jcluster.deployVerticleTo(deploymentID, group, main, config, instances, handler);
    } else {
      jcluster.deployVerticleTo(deploymentID, group, main, config, instances);
    }
    return that;
  }

  /**
   * Deploys a worker verticle to the cluster.
   *
   * @param {string} deploymentID The unique verticle deployment ID.
   * @param {string} main The verticle main.
   * @param {object} [config] The verticle configuration.
   * @param {number} [instances] The number of instances to deploy.
   * @param {boolean} [multiThreaded] Whether to deploy the worker multi-threaded.
   * @param {function} [handler] A handler to be called once complete.
   * @returns {module:vertigo/cluster.VertigoCluster} this
   */
  this.deployWorkerVerticle = function(deploymentID, main) {
    var args = Array.prototype.slice.call(arguments);
    args.shift();
    args.shift();
    var handler = getArgValue('function', args);
    if (handler != null) {
      handler = adaptAsyncResultHandler(handler);
    }
    var multiThreaded = getArgValue('boolean', args);
    if (multiThreaded === null) {
      multiThreaded = false;
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
    if (handler != null) {
      jcluster.deployWorkerVerticle(deploymentID, main, config, instances, multiThreaded, handler);
    } else {
      jcluster.deployWorkerVerticle(deploymentID, main, config, instances, multiThreaded);
    }
    return that;
  }

  /**
   * Deploys a worker verticle to a specific HA group in the cluster.
   *
   * @param {string} deploymentID The unique verticle deployment ID.
   * @param {string} group The HA group to which to deploy the verticle.
   * @param {string} main The verticle main.
   * @param {object} [config] The verticle configuration.
   * @param {number} [instances] The number of instances to deploy.
   * @param {boolean} [multiThreaded] Whether to deploy the worker multi-threaded.
   * @param {function} [handler] A handler to be called once complete.
   * @returns {module:vertigo/cluster.VertigoCluster} this
   */
  this.deployWorkerVerticleTo = function(deploymentID, group, main) {
    var args = Array.prototype.slice.call(arguments);
    args.shift();
    args.shift();
    args.shift();
    var handler = getArgValue('function', args);
    if (handler != null) {
      handler = adaptAsyncResultHandler(handler);
    }
    var multiThreaded = getArgValue('boolean', args);
    if (multiThreaded === null) {
      multiThreaded = false;
    }
    var instances = getArgValue('number', args);
    if (instances == null) {
      instances = 1;
    }
    var config = getArgValue('object', args);
    if (config != null) {
      config = new org.vertx.java.core.json.JsonObject(JSON.stringify(config));
    } else {
      config = new org.vertx.java.core.json.JsonObject();
    }
    if (handler != null) {
      jcluster.deployWorkerVerticleTo(deploymentID, group, main, config, instances, multiThreaded, handler);
    } else {
      jcluster.deployWorkerVerticleTo(deploymentID, group, main, config, instances, multiThreaded);
    }
    return that;
  }

  /**
   * Undeploys a module from the cluster.
   *
   * @param {string} deploymentID The unique module deployment ID.
   * @param {function} [handler] A handler to be called once complete.
   * @returns {module:vertigo/cluster.VertigoCluster} this
   */
  this.undeployModule = function(deploymentID, handler) {
    if (handler !== undefined) {
      jcluster.undeployModule(deploymentID, adaptAsyncResultHandler(handler));
    } else {
      jcluster.undeployModule(deploymentID);
    }
    return that;
  }

  /**
   * Undeploys a verticle from the cluster.
   *
   * @param {string} deploymentID The unique verticle deployment ID.
   * @param {function} [handler] A handler to be called once complete.
   * @returns {module:vertigo/cluster.VertigoCluster} this
   */
  this.undeployVerticle = function(deploymentID, handler) {
    if (handler !== undefined) {
      jcluster.undeployVerticle(deploymentID, adaptAsyncResultHandler(handler));
    } else {
      jcluster.undeployVerticle(deploymentID);
    }
    return that;
  }

}

module.exports = cluster;

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
 * Deploys a network.
 *
 * @param {string|module:vertigo/network.NetworkConfig} config A network name or configuration.
 * @param {function} [handler] A handler to be called once deployment is complete.
 *
 * @returns {module:vertigo}
 */
vertigo.deployNetwork = function(config, handler) {
  if (handler !== undefined) {
    handler = adaptAsyncResultHandler(handler, function(result) {
      return new network.ActiveNetwork(result);
    });
  }

  if (typeof(config) === 'string') {
    __jvertigo['deployNetwork(java.lang.String,org.vertx.java.core.Handler)'](config, handler);
  } else if (config.__jnetwork !== undefined) {
    __jvertigo['deployNetwork(net.kuujo.vertigo.network.NetworkConfig,org.vertx.java.core.Handler)'](config.__jnetwork, handler);
  } else {
    __jvertigo['deployNetwork(org.vertx.java.core.json.JsonObject,org.vertx.java.core.Handler)'](new org.vertx.java.core.json.JsonObject(JSON.stringify(config)), handler);
  }
  return vertigo;
}

/**
 * Undeploys a network.
 *
 * @param {string|module:vertigo/network.NetworkConfig} config A network name or configuration.
 * @param {function} handler A handler to be called once undeployment is complete.
 *
 * @returns {module:vertigo}
 */
vertigo.undeployNetwork = function(config, handler) {
  if (handler !== undefined) {
    handler = adaptAsyncResultHandler(handler);
  }

  if (typeof(config) === 'string') {
    __jvertigo['undeployNetwork(java.lang.String,org.vertx.java.core.Handler)'](config, handler);
  } else if (config.__jnetwork !== undefined) {
    __jvertigo['undeployNetwork(net.kuujo.vertigo.network.NetworkConfig,org.vertx.java.core.Handler)'](config.__jnetwork, handler);
  } else {
    __jvertigo['undeployNetwork(org.vertx.java.core.json.JsonObject,org.vertx.java.core.Handler)'](new org.vertx.java.core.json.JsonObject(JSON.stringify(config)), handler);
  }
  return vertigo;
}

module.exports = vertigo;

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
load('vertx/helpers.js');

/**
 * The 'vertigo' module provides all of the Vertigo API namespaced
 * under 'vertigo'.
 *
 * @example
 * var vertigo = require('vertigo');
 * vertigo.createPollingFeeder().start(function(error, feeder) {
 *   if (!error) {
 *     feeder.feedHandler(function() {
 *       feeder.feed({foo: 'bar'});
 *     });
 *   }
 * });
 *
 * @exports vertigo
 */
var vertigo = {};

this.__jvertigo = undefined;
this.__jcontext = undefined;
this.__jcomponent = undefined;
this.__componentType = undefined;

vertigo.logger = __jcontainer.logger();

// Attempt to create a component context from the verticle configuration.
this.__jcontext = net.kuujo.vertigo.util.Context.parseContext(__jcontainer.config());

// Create a Vertigo factory.
var vertigoFactory = new net.kuujo.vertigo.DefaultVertigoFactory(__jvertx, __jcontainer);

// If the context was successfully created then this is a component instance.
// For component instances, create the component and then instantiate a Vertigo instance.
if (__jcontext !== null) {
  var componentFactory = new net.kuujo.vertigo.component.DefaultComponentFactory(__jvertx, __jcontainer);
  this.__jcomponent = componentFactory.createComponent(__jcontext);
  this.__jvertigo = vertigoFactory.createVertigo(__jcomponent);
}
// For non-component verticles, instantiate an empty Vertigo instance.
else {
  this.__jvertigo = vertigoFactory.createVertigo();
}

var context = require('vertigo/context');

/**
 * The component instance context.
 *
 * @see module:vertigo/context.InstanceContext
 */
vertigo.context = undefined;

/**
 * The vertigo feeder module.
 *
 * @see module:vertigo/feeder
 */
vertigo.feeder = undefined;

/**
 * The vertigo executor module.
 *
 * @see module:vertigo/executor
 */
vertigo.executor = undefined;

/**
 * The vertigo worker module.
 *
 * @see module:vertigo/worker
 */
vertigo.worker = undefined;

/**
 * A Vertigo context.
 *
 * @see module:vertigo/context.InstanceContext
 */
if (__jcomponent !== undefined) {
  vertigo.context = new context.InstanceContext(__jcomponent.getContext());

  var componentType = net.kuujo.vertigo.util.Component.serializeType(__jcomponent.getContext().getComponent().getType());
  switch (componentType) {
    case "feeder":
      var feeder = require('vertigo/feeder');
      vertigo.feeder = new feeder.Feeder(__jcomponent).start();
      break;
    case "executor":
      var executor = require('vertigo/executor');
      vertigo.executor = new executor.Executor(__jcomponent).start();
      break;
    case "worker":
      var worker = require('vertigo/worker');
      vertigo.worker = new worker.Worker(__jcomponent).start();
      break;
    default:
      throw "Unknown Vertigo component type " + componentType;
  }
}

/**
 * Indicates whether the current verticle is a Vertigo component.
 *
 * @returns {Boolean} Indicates whether this verticle is a Vertigo component.
 */
vertigo.isComponent = function() {
  return __jvertigo.isComponent();
}

/**
 * The vertigo network module.
 *
 * @see module:vertigo/network
 */
vertigo.network = require('vertigo/network');

/**
 * The vertigo input module.
 *
 * @see module:vertigo/input
 */
vertigo.input = require('vertigo/input');

/**
 * The vertigo grouping module.
 *
 * @see module:vertigo/grouping
 */
vertigo.grouping = require('vertigo/grouping');

/**
 * Creates a new Vertigo network.
 *
 * @param {string} address The network address
 * @returns {module:vertigo/network.Network} A new network definition
 */
vertigo.createNetwork = function(address) {
  return new vertigo.network.Network(address);
}

/**
 * Deploys a local network.
 */
vertigo.deployLocalNetwork = function(network, doneHandler) {
  if (doneHandler !== undefined) {
    doneHandler = adaptAsyncResultHandler(doneHandler, function(result) {
      return new context.NetworkContext(result);
    });
  }
  __jvertigo.deployLocalNetwork(network.__jnetwork, doneHandler);
  return vertigo;
}

/**
 * Shuts down a local network.
 */
vertigo.shutdownLocalNetwork = function(context, doneHandler) {
  if (doneHandler !== undefined) {
    doneHandler = adaptAsyncResultHandler(doneHandler);
  }
  __jvertigo.shutdownLocalNetwork(context.__jcontext, doneHandler);
  return vertigo;
}

/**
 * Deploys a remote network.
 */
vertigo.deployRemoteNetwork = function(address, network, doneHandler) {
  if (doneHandler) {
    doneHandler = adaptAsyncResultHandler(doneHandler, function(result) {
      return new context.NetworkContext(result);
    });
  }
  __jvertigo.deployRemoteNetwork(address, network, doneHandler);
  return vertigo;
}

/**
 * Shuts down a remote network.
 */
vertigo.shutdownRemoteNetwork = function(address, context, doneHandler) {
  if (doneHandler !== undefined) {
    doneHandler = adaptAsyncResultHandler(doneHandler);
  }
  __jvertigo.shutdownRemoteNetwork(address, context.__jcontext, doneHandler);
  return vertigo;
}

/**
 * The vertigo cluster module.
 *
 * @see module:vertigo/cluster
 */
vertigo.cluster = require('vertigo/cluster');

/**
 * Creates a local cluster.
 *
 * @returns {module:vertigo/cluster.LocalCluster} A new local cluster instance
 */
vertigo.createLocalCluster = function() {
  return new vertigo.cluster.LocalCluster();
}

/**
 * Creates a Via cluster.
 *
 * @param {string} address The Via cluster address
 * @returns {module:vertigo/cluster.ViaCluster} A new Via cluster instance
 */
vertigo.createViaCluster = function(address) {
  return new vertigo.cluster.ViaCluster(address);
}

module.exports = vertigo;

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
 * The 'vertigo' module provides the primary Vertigo API for creating
 * and deploying networks and using component instances.
 * @exports vertigo
 */
var vertigo = {};

vertigo.logger = __jcontainer.logger();

// Create a Java Vertigo instance. This instance is the basis of all Vertigo API
// calls. If the current verticle instance is a Vertigo component instance, the
// Java Vertigo instance will contain the Java component instance and its context.
this.__jvertigo = net.kuujo.vertigo.util.Factory.createVertigo(__jvertx, __jcontainer);

var network = require('vertigo/network');
var context = require('vertigo/context');
var cluster = require('vertigo/cluster');

/**
 * The component instance context.
 *
 * This context is only available within component instances. If the
 * current verticle or module instance is not a Vertigo component instance,
 * this variable will be undefined.
 *
 * @see module:vertigo/context.InstanceContext
 */
vertigo.context = undefined;

/**
 * The vertigo feeder module.
 *
 * The feeder module is only available within feeder instances. If the
 * current verticle or module instance is not a Vertigo feeder instance,
 * this variable will be undefined.
 *
 * @example
 * var vertigo = require('vertigo');
 * vertigo.feeder.startHandler(function(error, feeder) {
 *   feeder.emit({foo: 'bar'}, function(error) {
 *     if (error) {
 *       if (error.type == 'failure') {
 *         console.log('The message was failed.');
 *       }
 *       else if (error.type == 'timeout') {
 *         console.log('The message timed out.');
 *       }
 *     }
 *   });
 * });
 *
 * @see module:vertigo/feeder
 */
vertigo.feeder = undefined;

/**
 * The vertigo executor module.
 *
 * The executor module is only available within executor instances. If the
 * current verticle or module instance is not a Vertigo feeder instance,
 * this variable will be undefined.
 *
 * @example
 * var vertigo = require('vertigo');
 * vertigo.executor.startHandler(error, executor) {
 *   execuor.execute({foo: 'bar'}, function(error, result) {
 *     if (!error) {
 *       console.log('Result is ' + result.body);
 *     }
 *   });
 * }
 *
 * @see module:vertigo/executor
 */
vertigo.executor = undefined;

/**
 * The vertigo worker module.
 *
 * The worker module is only available within worker instances. If the
 * current verticle or module instance is not a Vertigo feeder instance,
 * this variable will be undefined.
 *
 * @example
 * var vertigo = require('vertigo');
 * vertigo.worker.messageHandler(function(message) {
 *   vertigo.worker.emit({body: 'I am a child of the message'}, message);
 * });
 *
 * @see module:vertigo/worker
 */
vertigo.worker = undefined;

// If the current verticle instance is a Vertigo component instance, store
// the Java component and its context in a global variable and set up
// Javascript objects. We make the component's specific API available
// based on the component type.
if (__jvertigo.isComponent()) {
  this.__jcomponent = __jvertigo.component();
  this.__jcontext = __jvertigo.context();

  vertigo.context = new context.InstanceContext(__jcontext);

  var componentType = net.kuujo.vertigo.util.Component.serializeType(__jcontext.getComponent().getType());
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
 * If the current module or verticle instance is a Vertigo component
 * instance, the feeder, executor, or worker will be available within
 * this module as well.
 *
 * @returns {Boolean} Indicates whether this verticle is a Vertigo component.
 */
vertigo.isComponent = function() {
  return __jvertigo.isComponent();
}

/**
 * Creates a new Vertigo network.
 *
 * @example
 * var vertigo = require('vertigo');
 * var network = vertigo.createNetwork('foo');
 * network.addFeeder('foo.feeder', 'foo_feeder.js');
 * network.addWorker('foo.worker', 'foo_worker.js', 4).addInput('foo.feeder').randomGrouping();
 *
 * @param {string} address The network address
 * @returns {module:vertigo/network.Network} A new network definition
 */
vertigo.createNetwork = function(address) {
  return new network.Network(address);
}

/**
 * Deploys a local network.
 *
 * @example
 * var vertigo = require('vertigo');
 * var network = vertigo.createNetwork('foo');
 * network.addFeeder('foo.feeder', 'foo_feeder.js');
 * network.addWorker('foo.worker', 'foo_worker.js', 4).addInput('foo.feeder').randomGrouping();
 * vertigo.deployLocalNetwork(network, function(error, context) {
 *   if (!error) {
 *     // The network was successfully deployed.
 *   }
 * });
 *
 * @param {module:vertigo/network.Network} The network to deploy.
 * @param {Handler} A handler to be called once the deployment is complete.
 * The first argument to the handler will be an error if an error occured.
 * The second argument will be a network context.
 * @returns {module:vertigo} The vertigo instance.
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
 *
 * @example
 * vertigo.deployLocalNetwork(network, function(error, context) {
 *   if (!error) {
 *     vertigo.shutdownLocalNetwork(context, function(error) {
 *       if (!error) {
 *         // The network was successfully shutdown.
 *       }
 *     });
 *   }
 * });
 *
 * @param {module:vertigo/context.NetworkContext} The context of the network to shutdown.
 * @param {Handler} A handler to be called once the shutdown is complete.
 * If an error occurred, the error will be passed as the only argument.
 * @returns {module:vertigo} The vertigo instance.
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
 *
 * @example
 * var vertigo = require('vertigo');
 * var network = vertigo.createNetwork('foo');
 * network.addFeeder('foo.feeder', 'foo_feeder.js');
 * network.addWorker('foo.worker', 'foo_worker.js', 4).addInput('foo.feeder').randomGrouping();
 * vertigo.deployRemoteNetwork('via.master', network, function(error, context) {
 *   if (!error) {
 *     // The network was successfully deployed.
 *   }
 * });
 *
 * @param {String} address The remote cluster manager event bus address
 * @param {module:vertigo/network.Network} The network to deploy.
 * @param {Handler} A handler to be called once the deployment is complete.
 * The first argument to the handler will be an error if an error occured.
 * The second argument will be a network context.
 * @returns {module:vertigo} The vertigo instance.
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
 *
 * @example
 * vertigo.deployRemoteNetwork('via.master', network, function(error, context) {
 *   if (!error) {
 *     vertigo.shutdownRemoteNetwork('via.master', context, function(error) {
 *       if (!error) {
 *         // The network was successfully shutdown.
 *       }
 *     });
 *   }
 * });
 *
 * @param {String} address The remote cluster manager event bus address
 * @param {module:vertigo/context.NetworkContext} The context of the network to shutdown.
 * @param {Handler} A handler to be called once the shutdown is complete.
 * If an error occurred, the error will be passed as the only argument.
 * @returns {module:vertigo} The vertigo instance.
 */
vertigo.shutdownRemoteNetwork = function(address, context, doneHandler) {
  if (doneHandler !== undefined) {
    doneHandler = adaptAsyncResultHandler(doneHandler);
  }
  __jvertigo.shutdownRemoteNetwork(address, context.__jcontext, doneHandler);
  return vertigo;
}

/**
 * Creates a local cluster.
 *
 * @returns {module:vertigo/cluster.LocalCluster} A new local cluster instance
 */
vertigo.createLocalCluster = function() {
  return new cluster.LocalCluster();
}

/**
 * Creates a Via cluster.
 *
 * @param {string} address The remote cluster manager event bus address
 * @returns {module:vertigo/cluster.ViaCluster} A new remote cluster instance
 */
vertigo.createRemoteCluster = function(address) {
  return new cluster.RemoteCluster(address);
}

module.exports = vertigo;

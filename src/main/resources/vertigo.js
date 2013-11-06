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
var vertx = require('vertx');
var container = require('vertx/container');

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

var context = require('vertigo/context');

var config = __jcontainer.config();
if (config !== null && config.getFieldNames().contains('__context__')) {
  vertigo.context = new context.InstanceContext(net.kuujo.vertigo.context.InstanceContext.fromJson(config.getObject('__context__')));
}
else {
  vertigo.context = null;
}

/**
 * The vertigo network module.
 * @see module:vertigo/network
 */
vertigo.network = require('vertigo/network');

/**
 * The vertigo input module.
 * @see module:vertigo/input
 */
vertigo.input = require('vertigo/input');

/**
 * The vertigo grouping module.
 * @see module:vertigo/grouping
 */
vertigo.grouping = require('vertigo/grouping');

/**
 * The vertigo filter module.
 * @see module:vertigo/filter
 */
vertigo.filter = require('vertigo/filter');

/**
 * Creates a new Vertigo network.
 * @param {string} address The network address
 * @returns {module:vertigo/network.Network} A new network definition
 */
vertigo.createNetwork = function(address) {
  return new vertigo.network.Network(address);
}

/**
 * The vertigo feeder module.
 * @see module:vertigo/feeder
 */
vertigo.feeder = require('vertigo/feeder');

/**
 * Creates a basic feeder.
 * @returns {module:vertigo/feeder.BasicFeeder} A basic feeder
 */
vertigo.createBasicFeeder = function() {
  return new vertigo.feeder.BasicFeeder(vertigo.context);
}

vertigo.createFeeder = vertigo.createBasicFeeder;

/**
 * Creates a polling feeder.
 * @returns {module:vertigo/feeder.PollingFeeder} A polling feeder
 */
vertigo.createPollingFeeder = function() {
  return new vertigo.feeder.PollingFeeder(vertigo.context);
}

/**
 * Creates a stream feeder.
 * @returns {module:vertigo/feeder.StreamFeeder} A stream feeder
 */
vertigo.createStreamFeeder = function() {
  return new vertigo.feeder.StreamFeeder(vertigo.context);
}

/**
 * The vertigo RPC module.
 * @see module:vertigo/rpc
 */
vertigo.rpc = require('vertigo/rpc');

/**
 * Creates a basic executor.
 * @returns {module:vertigo/rpc.BasicExecutor} A basic executor
 */
vertigo.createBasicExecutor = function() {
  return new vertigo.rpc.BasicExecutor(vertigo.context);
}

vertigo.createExecutor = vertigo.createBasicExecutor;

/**
 * Creates a polling executor.
 * @returns {module:vertigo/rpc.PollingExecutor} A polling executor
 */
vertigo.createPollingExecutor = function() {
  return new vertigo.rpc.PollingExecutor(vertigo.context);
}

/**
 * Creates a stream executor.
 * @returns {module:vertigo/rpc.StreamExecutor} A stream executor
 */
vertigo.createStreamExecutor = function() {
  return new vertigo.rpc.StreamExecutor(vertigo.context);
}

/**
 * The vertigo worker module.
 * @see module:vertigo/worker
 */
vertigo.worker = require('vertigo/worker');

/**
 * Creates a worker.
 * @returns {module:vertigo/worker.BasicWorker} A basic worker
 */
vertigo.createWorker = function() {
  return new vertigo.worker.BasicWorker(vertigo.context);
}

/**
 * The vertigo cluster module.
 * @see module:vertigo/cluster
 */
vertigo.cluster = require('vertigo/cluster');

/**
 * Creates a local cluster.
 * @returns {module:vertigo/cluster.LocalCluster} A new local cluster instance
 */
vertigo.createLocalCluster = function() {
  return new vertigo.cluster.LocalCluster();
}

/**
 * Creates a Via cluster.
 * @param {string} address The Via cluster address
 * @returns {module:vertigo/cluster.ViaCluster} A new Via cluster instance
 */
vertigo.createViaCluster = function(address) {
  return new vertigo.cluster.ViaCluster(address);
}

module.exports = vertigo;

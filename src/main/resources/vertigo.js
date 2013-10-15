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

var vertigo = {};

var context = require('vertigo/context');

vertigo.context = new context.WorkerContext(net.kuujo.vertigo.context.WorkerContext.fromJson(__jcontainer.config()));

vertigo.network = require('vertigo/network');

/**
 * Creates a new Vertigo network.
 */
vertigo.createNetwork = function(name) {
  return new vertigo.network.Network(name);
}

/**
 * Creates a new Vertigo component.
 */
vertigo.createComponent = function(name) {
  return new vertigo.network.Component(name);
}

vertigo.feeder = require('vertigo/feeder');

/**
 * Creates a new basic feeder.
 */
vertigo.createBasicFeeder = function() {
  return new vertigo.feeder.BasicFeeder();
}

vertigo.createFeeder = vertigo.createBasicFeeder;

/**
 * Creates a new polling feeder.
 */
vertigo.createPollingFeeder = function() {
  return new vertigo.feeder.PollingFeeder();
}

/**
 * Creates a new stream feeder.
 */
vertigo.createStreamFeeder = function() {
  return new vertigo.feeder.StreamFeeder();
}

vertigo.executor = require('vertigo/executor');

/**
 * Creates a new basic executor.
 */
vertigo.createBasicExecutor = function() {
  return new vertigo.executor.BasicExecutor();
}

vertigo.createExecutor = vertigo.createBasicExecutor;

/**
 * Creates a new polling executor.
 */
vertigo.createPollingExecutor = function() {
  return new vertigo.executor.PollingExecutor();
}

/**
 * Creates a new stream executor.
 */
vertigo.createStreamExecutor = function() {
  return new vertigo.executor.StreamExecutor();
}

vertigo.worker = require('vertigo/worker');

/**
 * Creates a new worker.
 */
vertigo.createWorker = function() {
  return new vertigo.worker.Worker();
}

vertigo.cluster = require('vertigo/cluster');

/**
 * Creates a new local cluster.
 */
vertigo.createLocalCluster = function() {
  return new vertigo.cluster.LocalCluster();
}

/**
 * Creates a new Via cluster.
 */
vertigo.createViaCluster = function(address) {
  return new vertigo.cluster.ViaCluster(address);
}

module.exports = vertigo;
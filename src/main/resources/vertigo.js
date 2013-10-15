var vertx = require('vertx');
var container = require('vertx/container');

var vertigo = {};

var context = require('vertigo/context');

vertigo.context = new context.WorkerContext(net.kuujo.vertigo.context.WorkerContext.fromJson(__jcontainer.config()));

vertigo.network = require('vertigo/network');

vertigo.createNetwork = function(name) {
  return new vertigo.network.Network(name);
}

vertigo.createComponent = function(name) {
  return new vertigo.network.Component(name);
}

vertigo.feeder = require('vertigo/feeder');

vertigo.createBasicFeeder = function() {
  return new vertigo.feeder.BasicFeeder();
}

vertigo.createFeeder = vertigo.createBasicFeeder;

vertigo.createPollingFeeder = function() {
  return new vertigo.feeder.PollingFeeder();
}

vertigo.createStreamFeeder = function() {
  return new vertigo.feeder.StreamFeeder();
}

vertigo.executor = require('vertigo/executor');

vertigo.createBasicExecutor = function() {
  return new vertigo.executor.BasicExecutor();
}

vertigo.createExecutor = vertigo.createBasicExecutor;

vertigo.createPollingExecutor = function() {
  return new vertigo.executor.PollingExecutor();
}

vertigo.createStreamExecutor = function() {
  return new vertigo.executor.StreamExecutor();
}

vertigo.worker = require('vertigo/worker');

vertigo.createWorker = function() {
  return new vertigo.worker.Worker();
}

vertigo.cluster = require('vertigo/cluster');

vertigo.createLocalCluster = function() {
  return new vertigo.cluster.LocalCluster();
}

vertigo.createViaCluster = function(address) {
  return new vertigo.cluster.ViaCluster(address);
}

module.exports = vertigo;

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
 * This example demonstrates the use of event bus hooks in the Vertigo Javascript
 * API. These hooks are known as event bus hooks because the underlying hook
 * implementation uses the Java EventBusHook. Available hooks are as follows:
 * - start: called when a component instance is started
 * - receive: called when a component instance receives a message
 * - ack: called when a component instance acks a message
 * - fail: called when a component instance fails a message
 * - emit: called when a component instance emits a message
 * - acked: called when a feeder or executor receives notification of an ack
 * - failed: called when a feeder or executor receives notification of a failure
 * - timeout: called when a feeder or executor receives notification of a timeout
 * - stop: called when a component instance is stopped
 */

var vertigo = require('vertigo');
var console = require('vertx/console');

var network = vertigo.createNetwork('hook');
network.addFeeder('hook.feeder', 'example_feeder.js');
var worker = network.addWorker('hook.worker', 'example_worker.js');
worker.addInput('hook.feeder');

// Add a start hook.
worker.addHook('start', function(context) {
  console.log(context.id() + ' was started.');
});

// Add a message receive hook.
worker.addHook('receive', function(messageid) {
  console.log('Worker received message ' + messageid);
});

// Add a stop hook.
worker.addHook('stop', function(context) {
  console.log(context.id() + ' was stopped.');
});

vertigo.deployLocalNetwork(network);

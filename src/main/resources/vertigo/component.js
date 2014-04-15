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

var input = require('vertigo/input');
var output = require('vertigo/output');
var cluster = require('vertigo/cluster');

/**
 * The 'component' module provides the primary API for working with
 * components within a Javascript component verticle. In order for
 * attributes of the component module to be accessed, the current
 * verticle must have been deployed as part of a Vertigo network.
 * @exports component
 */
var component = {};

/**
 * The current Vertigo cluster.
 *
 * The component cluster can be used to deploy modules and verticles within
 * the same cluster as the current component instance. If the component and
 * its network were deployed to a local cluster then the component's cluster
 * will be a local cluster instance, e.g. within a single Vert.x instance.
 * Conversely, if the network was deployed as a distributed cluster then the
 * component's cluster will be a Xync-backed distributed deployment interface.
 *
 * @see module:vertigo/cluster.VertigoCluster
 */
component.cluster = undefined;

/**
 * The component logger.
 *
 * This is a special Vert.x logger implementation that automatically logs
 * messages to special output ports. It exposes all the same methods as the
 * standard Vert.x logger and logs messages to output ports with the same
 * names as the method called. For example, an error message will be automatically
 * sent on the component's 'error' output port.
 */
component.logger = undefined;

/**
 * The component's input.
 *
 * This is a simple wrapper around component input ports.
 *
 * @see module:vertigo/input.InputCollector
 */
component.input = undefined;

/**
 * The component's output.
 *
 * This is a simple wrapper around component output ports.
 *
 * @see module:vertigo/output.OutputCollector
 */
component.output = undefined;

var _start_handler = null;
var _started = false;
var _error = null;

/**
 * Registers a start handler on the component.
 *
 * @param {function} handler A handler to be called once the component is started.
 *
 * @return {module:vertigo/component} The component module.
 */
component.startHandler = function(handler) {
  _start_handler = handler;
  check_start();
  return component;
}

function check_start() {
  if (_started && _start_handler !== null) {
    if (_error !== null) {
      _start_handler(_error);
    } else {
      _start_handler(null, component);
    }
  }
}

var jcomponent = undefined;
try {
  jcomponent = net.kuujo.vertigo.util.Factories.createComponent(__jvertx, __jcontainer);
} catch (e) {
  // Do nothing.
}

if (jcomponent !== undefined) {
  component.cluster = new cluster.VertigoCluster(jcomponent.cluster());
  component.logger = jcomponent.logger();
  component.input = new input.InputCollector(jcomponent.input());
  component.output = new output.OutputCollector(jcomponent.output());

  jcomponent.start(adaptAsyncResultHandler(function(error, jcomponent) {
    _started = true;
    _error = error
    check_start();
  }));
}

module.exports = component;

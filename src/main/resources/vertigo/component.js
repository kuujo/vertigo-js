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
 * The 'component' module provides the primary API for working with
 * components within a Javascript component verticle. In order for
 * attributes of the component module to be accessed, the current
 * verticle must have been deployed as part of a Vertigo network.
 * @exports component
 */
var component = {};

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

component.__jcomponent = undefined;
try {
  component.__jcomponent = net.kuujo.vertigo.util.Factories.createComponent(__jvertx, __jcontainer);
} catch (e) {
  // Do nothing.
}

if (component.__jcomponent !== undefined) {
  component.__jcomponent.start(adaptAsyncResultHandler(function(error, jcomponent) {
    _started = true;
    _error = error
    check_start();
  }));
}

module.exports = component;

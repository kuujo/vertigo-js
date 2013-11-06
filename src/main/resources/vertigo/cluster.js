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
 * The <code>vertigo/cluster</code> module provides interfaces to
 * deploying/undeploying Vertigo networks.
 * @exports vertigo/cluster
 */
var cluster = {}

var context = require('vertigo/context');

/**
 * A local cluster.
 * @constructor
 */
cluster.LocalCluster = function() {
  var that = this;
  var jcluster = new net.kuujo.vertigo.cluster.LocalCluster(__jvertx, __jcontainer);

  /**
   * Deploys a network.
   *
   * @param {module:vertigo/network.Network} network The network to deploy
   * @param handler An asynchronous result handler
   */
  this.deploy = function(network, handler) {
    if (handler) {
      jcluster.deploy(network.__jnetwork, adaptAsyncResultHandler(handler, function(jcontext) {
        return new context.NetworkContext(jcontext);
      }));
    }
    else {
      jcluster.deploy(network.__jnetwork);
    }
  }

  /**
   * Shuts down a network.
   *
   * @param {module:vertigo/context.NetworkContext} network A network context
   * @param handler An asynchronous result handler
   */
  this.shutdown = function(context, handler) {
    if (handler) {
      jcluster.shutdown(context.__jcontext, adaptAsyncResultHandler(handler));
    }
    else {
      jcluster.shutdown(context.__jcontext);
    }
  }
}

/**
 * A remote (Via) cluster.
 * @constructor
 */
cluster.ViaCluster = function(address) {
  var that = this;
  var jcluster = new net.kuujo.vertigo.cluster.ViaCluster(__jvertx, __jcontainer, address);

  this.address = address;

  /**
   * Deploys a network.
   *
   * @param {module:vertigo/network.Network} network The network to deploy
   * @param handler An asynchronous result handler
   */
  this.deploy = function(network, handler) {
    if (handler) {
      jcluster.deploy(network.__jnetwork, adaptAsyncResultHandler(handler, function(jcontext) {
        return new context.NetworkContext(jcontext);
      }));
    }
    else {
      jcluster.deploy(network.__jnetwork);
    }
  }

  /**
   * Shuts down a network.
   *
   * @param {module:vertigo/context.NetworkContext} network A network context
   * @param handler An asynchronous result handler
   */
  this.shutdown = function(context, handler) {
    if (handler) {
      jcluster.shutdown(context.__jcontext, adaptAsyncResultHandler(handler));
    }
    else {
      jcluster.shutdown(context.__jcontext);
    }
  }
}

module.exports = cluster;

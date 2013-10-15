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

var cluster = {}

var context = require('vertigo/context');

cluster.LocalCluster = function() {
  var that = this;
  var jcluster = new net.kuujo.vertigo.LocalCluster(__jvertx, __jcontainer);

  this.deploy = function(network, handler) {
    if (handler) {
      handler = adaptAsyncResultHandler(handler, function(jcontext) {
        return new context.NetworkContext(jcontext);
      });
      jcluster.deploy(network.__jnetwork, handler);
    }
    else {
      jcluster.deploy(network.__jnetwork);
    }
  }

  this.shutdown = function(context, handler) {
    if (handler) {
      handler = adaptAsyncResultHandler(handler);
      jcluster.shutdown(context.__jcontext, handler);
    }
    else {
      jcluster.shutdown(context.__jcontext);
    }
  }
}

cluster.ViaCluster = function(address) {
  var that = this;
  var jcluster = new net.kuujo.vertigo.ViaCluster(__jvertx, __jcontainer, address);

  this.address = address;

  this.deploy = function(network, handler) {
    if (handler) {
      handler = adaptAsyncResultHandler(handler, function(jcontext) {
        return new context.NetworkContext(jcontext);
      });
      jcluster.deploy(network.__jnetwork, handler);
    }
    else {
      jcluster.deploy(network.__jnetwork);
    }
  }

  this.shutdown = function(context, handler) {
    if (handler) {
      handler = adaptAsyncResultHandler(handler);
      jcluster.shutdown(context.__jcontext, handler);
    }
    else {
      jcluster.shutdown(context.__jcontext);
    }
  }
}

module.exports = cluster;

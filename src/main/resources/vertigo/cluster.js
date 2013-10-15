load('vertx/helpers.js');

var cluter = {}

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

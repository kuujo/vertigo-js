var context = {};

var network = require('vertigo/network');

context.WorkerContext = function(jcontext) {
  this.__jcontext = jcontext;

  this.address = jcontext.address();

  var config = jcontext.config();
  if (config != null) {
    this.config = JSON.parse(config.encode());
  }
  else {
    this.config = {};
  }

  this.componentContext = function() {
    return new context.ComponentContext(jcontext.getComponentContext());
  }
}

context.ComponentContext = function(jcontext) {
  this.__jcontext = jcontext;

  var name = jcontext.name();

  var address = jcontext.address();

  var connectionContexts = function() {
    var contexts = jcontext.getConnectionContexts().toArray();
    var arr = new Array(contexts.length);
    for (var i = 0; i < contexts.length; i++) {
      arr[i] = new context.ConnectionContext(contexts[i]);
    }
    return arr;
  }

  var connectionContext = function(name) {
    var connection = jcontext.getConnectionContext(name);
    if (connection != null) {
      return new context.ConnectionContext(connection);
    }
    return null;
  }

  var workerContexts = function() {
    var contexts = jcontext.getWorkerContexts().toArray();
    var arr = new Array(contexts.length);
    for (var i = 0; i < contexts.length; i++) {
      arr[i] = new context.WorkerContext(contexts[i]);
    }
    return arr;
  }

  var networkContext = function() {
    return new context.NetworkContext(jcontext.getNetworkContext());
  }
}

context.NetworkContext = function(jcontext) {
  this.__jcontext = jcontext;

  this.address = jcontext.address();

  this.broadcastAddress = function() {
    return jcontext.getBroadcastAddress();
  }

  this.numAuditors = function() {
    return jcontext.getNumAuditors();
  }

  this.auditors = function() {
    return jcontext.getAuditors().toArray();
  }

  this.componentContexts = function() {
    var contexts = jcontext.getComponentContexts().toArray();
    var arr = new Array(contexts.length);
    for (var i = 0; i < contexts.length; i++) {
      arr[i] = new context.ComponentContext(contexts[i]);
    }
    return arr;
  }

  this.componentContext = function(name) {
    var component = jcontext.getComponentContext(name);
    if (component != null) {
      return new context.ComponentContext(component);
    }
    return null;
  }

  this.definition = function() {
    return new network.Network(jcontext.getDefinition());
  }

}

module.exports = context;

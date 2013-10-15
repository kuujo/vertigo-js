var context = {};

context.WorkerContext = function(jcontext) {
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
  var name = jcontext.name();

  var address = jcontext.address();

  var connectionContexts = function() {
    return jcontext.getConnectionContexts();
  }

  var connectionContext = function(name) {
    var connection = jcontext.getConnectionContext(name);
    if (connection) {
      return new context.ConnectionContext(connection);
    }
    return null;
  }

  var workerContexts = function() {
    var contexts = jcontext.getWorkerContexts();
  }

  var networkContext = function() {
    return new context.NetworkContext(jcontext.getNetworkContext());
  }
}

context.NetworkContext = function(jcontext) {
  var address = jcontext.address();

  var broadcastAddress = jcontext.getBroadcastAddress();

  var numAuditors = jcontext.getNumAuditors();

  var auditors = jcontext.getAuditors();

  var componentContexts = function() {
    var contexts = jcontext.getComponentContexts();
  }

  var componentContext = function(name) {
    var component = jcontext.getComponentContext(name);
  }

  var definition = function() {
    
  }

}

module.exports = context;

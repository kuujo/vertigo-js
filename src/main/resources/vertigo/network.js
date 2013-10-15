var network = {}

network.Network = function(name) {
  var that = this;
  var jnetwork = new net.kuujo.vertigo.Network(name);

  this.__jnetwork = jnetwork;

  this.address = function(addr) {
    if (addr == undefined) {
      return jnetwork.address();
    }
    else {
      jnetwork.setAddress(addr);
      return that;
    }
  }

  this.enableAcking = function() {
    jnetwork.enableAcking();
    return that;
  }

  this.disableAcking = function() {
    jnetwork.disableAcking();
    return that;
  }

  this.ackingEnabled = function() {
    return jnetwork.isAckingEnabled();
  }

  this.numAuditors = function(num) {
    if (num === undefined) {
      return jnetwork.getNumAuditors();
    }
    else {
      jnetwork.setNumAuditors(num);
      return that;
    }
  }

  this.ackExpire = function(expire) {
    if (expire === undefined) {
      return jnetwork.getAckExpire();
    }
    else {
      jnetwork.setAckExpire(expire);
      return that;
    }
  }

  this.from = function(component) {
    jnetwork.from(component.__jcomponent);
    return component;
  }

  this.fromVerticle = function(name, main, config, instances) {
    if (config) {
      config = new org.vertx.java.core.json.JsonObject(JSON.stringify(config));
    }
    var component = new network.Component(name);
    component.__jcomponent = jnetwork.fromVerticle(name, main, config, instances);
    return component;
  }

  this.fromModule = function(name, moduleName, config, instances) {
    if (config) {
      config = new org.vertx.java.core.json.JsonObject(JSON.stringify(config));
    }
    var component = new network.Component(name);
    component.__jcomponent = jnetwork.fromModule(name, moduleName, config, instances);
    return component;
  }

}

network.Component = function(name) {
  var that = this;
  var jcomponent = new net.kuujo.vertigo.Component(name);

  this.__jcomponent = jcomponent;

  this.name = function(name) {
    if (name === undefined) {
      return jcomponent.name();
    }
    else {
      jcomponent.setName(name);
      return that;
    }
  }

  this.type = function(type) {
    if (type === undefined) {
      return jcomponent.type();
    }
    else {
      jcomponent.setType(type);
      return that;
    }
  }

  this.main = function(main) {
    if (main === undefined) {
      return jcomponent.main();
    }
    else {
      jcomponent.setMain(main);
      return that;
    }
  }

  this.module = function(module) {
    if (module === undefined) {
      return jcomponent.module();
    }
    else {
      jcomponent.setModule(module);
      return that;
    }
  }

  this.config = function(config) {
    if (config === undefined) {
      return JSON.parse(jcomponent.config().encode());
    }
    else {
      jcomponent.setConfig(new org.vertx.java.core.json.JsonObject(JSON.stringify(config)));
      return that;
    }
  }

  this.workers = function(workers) {
    if (workers === undefined) {
      return jcomponent.workers();
    }
    else {
      jcomponent.setWorkers(workers);
      return that;
    }
  }

  this.groupBy = function(grouping) {
    jcomponent.groupBy(grouping.__jgrouping);
    return that;
  }

  this.filterBy = function(filter) {
    jcomponent.filterBy(filter.__jfilter);
    return that;
  }

  this.to = function(component) {
    jcomponent.to(component.__jcomponent);
    return component;
  }

  this.toVerticle = function(name, main, config, instances) {
    if (config) {
      config = new org.vertx.java.core.json.JsonObject(JSON.stringify(config));
    }
    var component = new network.Component(name);
    component.__jcomponent = jcomponent.toVerticle(name, main, config, instances);
    return component;
  }

  this.toModule = function(name, moduleName, config, instances) {
    if (config) {
      config = new org.vertx.java.core.json.JsonObject(JSON.stringify(config));
    }
    var component = new network.Component(name);
    component.__jcomponent = jcomponent.toMoudle(name, moduleName, config, instances);
    return component;
  }

}

module.exports = network;

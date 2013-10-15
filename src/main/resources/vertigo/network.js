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
var network = {}

load("vertx/helpers.js");

network.Network = function(obj) {
  var that = this;

  if (typeof obj == 'string') {
    var jnetwork = new net.kuujo.vertigo.Network(obj);
  }
  else {
    var jnetwork = obj;
  }

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

  this.fromVerticle = function(name) {
    var args = Array.prototype.slice.call(arguments);
    args.shift();
    var instances = getArgValue('number', args);
    var config = getArgValue('object', args);
    var main = getArgValue('string', args);
    if (config != null) {
      config = new org.vertx.java.core.json.JsonObject(JSON.stringify(config));
    }
    if (main != null && config != null && instances != null) {
      return new network.Component(jnetwork.fromVerticle(name, main, config, instances));
    }
    else if (main != null && config != null) {
      return new network.Component(jnetwork.fromVerticle(name, main, config));
    }
    else if (main != null && config != null) {
      return new network.Component(jnetwork.fromVerticle(name, main, instances));
    }
    else if (main != null) {
      return new network.Component(jnetwork.fromVerticle(name, main));
    }
    else {
      return new network.Component(jnetwork.fromVerticle(name));
    }
  }

  this.fromModule = function(name) {
    var args = Array.prototype.slice.call(arguments);
    args.shift();
    var instances = getArgValue('number', args);
    var config = getArgValue('object', args);
    var moduleName = getArgValue('string', args);
    if (config) {
      config = new org.vertx.java.core.json.JsonObject(JSON.stringify(config));
    }
    if (moduleName != null && config != null && instances != null) {
      return new network.Component(jnetwork.fromModule(name, moduleName, config, instances));
    }
    else if (moduleName != null && config != null) {
      return new network.Component(jnetwork.fromModule(name, moduleName, config));
    }
    else if (moduleName != null && instances != null) {
      return new network.Component(jnetwork.fromModule(name, moduleName, instances));
    }
    else if (moduleName != null) {
      return new network.Component(jnetwork.fromModule(name, moduleName));
    }
    else {
      return new network.Component(jnetwork.fromModule(name));
    }
  }

}

network.Component = function(obj) {
  var that = this;

  if (typeof(obj) == 'string') {
    var jcomponent = new net.kuujo.vertigo.Component(obj);
  }
  else {
    var jcomponent = obj;
  }

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

  this.toVerticle = function(name) {
    var args = Array.prototype.slice.call(arguments);
    args.shift();
    var instances = getArgValue('number', args);
    var config = getArgValue('object', args);
    var main = getArgValue('string', args);
    if (config) {
      config = new org.vertx.java.core.json.JsonObject(JSON.stringify(config));
    }
    if (main != null && config != null && instances != null) {
      return new network.Component(jcomponent.toVerticle(name, main, config, instances));
    }
    else if (main != null && config != null) {
      return new network.Component(jcomponent.toVerticle(name, main, config));
    }
    else if (main != null && instances != null) {
      return new network.Component(jcomponent.toVerticle(name, main, instances));
    }
    else if (main != null) {
      return new network.Component(jcomponent.toVerticle(name, main));
    }
    else {
      return new network.Component(jcomponent.toVerticle(name));
    }
  }

  this.toModule = function(name) {
    var args = Array.prototype.slice.call(arguments);
    args.shift();
    var instances = getArgValue('number', args);
    var config = getArgValue('object', args);
    var moduleName = getArgValue('string', args);
    if (config) {
      config = new org.vertx.java.core.json.JsonObject(JSON.stringify(config));
    }
    if (moduleName != null && config != null && instances != null) {
      return new network.Component(jcomponent.toModule(name, moduleName, config, instances));
    }
    else if (moduleName != null && config != null) {
      return new network.Component(jcomponent.toModule(name, moduleName, config));
    }
    else if (moduleName != null && instances != null) {
      return new network.Component(jcomponent.toModule(name, moduleName, instances));
    }
    else if (moduleName != null) {
      return new network.Component(jcomponent.toModule(name, moduleName));
    }
    else {
      return new network.Component(jcomponent.toModule(name));
    }
  }

}

module.exports = network;

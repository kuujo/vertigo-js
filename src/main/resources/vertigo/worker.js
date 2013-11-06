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

var vertigo = require('vertigo');
var message = require('vertigo/message');

var worker = {};

/**
 * A basic worker.
 */
worker.BasicWorker = function(context) {
  var that = this;

  if (context === undefined) {
    context = vertigo.context;
  }

  this.context = context;
  var jworker = new net.kuujo.vertigo.worker.BasicWorker(__jvertx, __jcontainer, this.context.__jcontext);

  /**
   * Starts the worker.
   */
  this.start = function(handler) {
    if (handler) {
      handler = adaptAsyncResultHandler(handler, function(result) {
        return that;
      });
      jworker.start(handler);
    }
    else {
      jworker.start();
    }
    return that;
  }

  /**
   * Sets a message handler on the worker.
   */
  this.messageHandler = function(handler) {
    jworker.messageHandler(function(jmessage) {
      handler(new message.Message(jmessage));
    });
    return that;
  }

  /**
   * Emits a message.
   */
  this.emit = function(data) {
    var args = Array.prototype.slice.call(arguments);
    args.shift();
    var parent = getArgValue('object', args);
    var tag = getArgValue('string', args);
    if (typeof(data) != 'object') {
      throw 'Invalid data type for emit()';
    }
    else if (parent != null && tag != null) {
      jworker.emit(new org.vertx.java.core.json.JsonObject(JSON.stringify(data)), tag, parent.__jmessage);
    }
    else if (parent != null) {
      jworker.emit(new org.vertx.java.core.json.JsonObject(JSON.stringify(data)), parent.__jmessage)
    }
    else if (tag != null) {
      jworker.emit(new org.vertx.java.core.json.JsonObject(JSON.stringify(data)), tag);
    }
    else {
      jworker.emit(new org.vertx.java.core.json.JsonObject(JSON.stringify(data)));
    }
    return that;
  }

  /**
   * Acks a message.
   */
  this.ack = function(message) {
    jworker.ack(message.__jmessage);
    return that;
  }

  /**
   * Fails a message.
   */
  this.fail = function(message) {
    jworker.fail(message.__jmessage);
    return that;
  }

}

worker.Worker = worker.BasicWorker;

module.exports = worker;

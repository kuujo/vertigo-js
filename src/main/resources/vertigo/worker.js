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

var worker = {};

/**
 * Wraps a Java JsonMessage.
 */
function wrap_message(jmessage) {
  var message = {};
  message.__jmessage = jmessage;
  message.id = jmessage.id();
  message.body = JSON.parse(jmessage.body().encode());
  message.tag = jmessage.tag();
  message.parent = jmessage.parent();
  message.ancestor = jmessage.ancestor();
  message.source = jmessage.source();
  message.auditor = jmessage.auditor();
  message.copy = function() {
    return wrap_message(jmessage.copy());
  }
  return message;
}

/**
 * A basic worker.
 */
worker.Worker = function() {
  var that = this;
  var context = __jcontainer.config().getObject('__context__');
  __jcontainer.config().removeField('__context__');
  var jworker = new net.kuujo.vertigo.worker.BasicWorker(__jvertx, __jcontainer, net.kuujo.vertigo.context.InstanceContext.fromJson(context));

  var config = jworker.config();
  if (config != null) {
    this.config = JSON.parse(config.encode());
  }
  else {
    this.config = {};
  }

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
      handler(wrap_message(jmessage));
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

module.exports = worker;

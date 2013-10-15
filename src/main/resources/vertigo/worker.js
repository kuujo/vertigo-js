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

worker.Worker = function() {

  var that = this;
  var jworker = new net.kuujo.vertigo.component.worker.DefaultWorker(__jvertx, __jcontainer, new net.kuujo.vertigo.context.WorkerContext(__jcontainer.config()));

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

  this.messageHandler = function(handler) {
    jworker.messageHandler(function(jmessage) {
      handler(wrap_message(jmessage));
    });
    return that;
  }

  this.emit = function() {
    var args = Array.prototype.slice.call(arguments);
    var data = getArgValue('object', args);
    var tag = getArgValue('string', args);
    jworker.emit(new org.vertx.java.core.json.JsonObject(JSON.stringify(data)), tag);
    return that;
  }

  this.ack = function(message) {
    jworker.ack(message.__jmessage);
    return that;
  }

  this.fail = function(message, failMessage) {
    jworker.fail(message.__jmessage, failMessage);
    return that;
  }

}

module.exports = worker;

Vert.igo Javascript API
=======================

**The Vertigo Javascript API is still under heavy development and is only recommended
for testing and contributions :-)**

[Vertigo](https://github.com/kuujo/vertigo) is a distributed event processing
framework built on the [Vert.x](http://vertx.io/) application platform. Following
a concept and structure similar to [Storm](https://github.com/nathanmarz/storm),
Vertigo allows real-time problems to be broken down into smaller tasks (as Vert.x
verticles) and distributed across **one or many Vert.x instances**, managing
communication between components in a **predictable and reliable** manner.

**[Check out the main Vertigo project](https://github.com/kuujo/vertigo)**

## Javascript User Manual

1. [Networks](#networks)
1. [Components](#components)
1. [Messaging](#messaging)
   * [How components communicate](#how-components-communicate)
   * [Message distribution](#message-distribution)
   * [Messages](#messages)
1. [Reliability](#reliability)
   * [Component supervision](#component-supervision)
   * [Message acking](#message-acking)
   * [How acking works](#how-acking-works)
1. [A Simple Network](#a-simple-network)
   * [Defining the network](#defining-the-network)
   * [Creating the feeder](#creating-the-feeder)
   * [Creating the worker](#creating-the-worker)
   * [Deploying the network](#deploying-the-network)
   * [Executing the network as a remote procedure](#executing-the-network-as-a-remote-procedure)
1. [Creating Components](#creating-components)
   * [Contexts](#contexts)
      * [WorkerContext](#workercontext)
      * [ComponentContext](#componentcontext)
      * [NetworkContext](#networkcontext)
   * [Feeders](#feeders)
     * [BasicFeeder](#basic-feeder)
     * [PollingFeeder](#polling-feeder)
     * [StreamFeeder](#stream-feeder)
   * [Workers](#workers)
      * [Vertigo messages](#vertigo-messages)
      * [Emitting messages](#emitting-messages)
      * [Acking messages](#acking-messages)
   * [Executors](#executors)
      * [BasicExecutor](#basic-executor)
      * [PollingExecutor](#polling-executor)
      * [StreamExecutor](#stream-executor)
1. [Defining networks](#defining-networks)
   * [Defining network components](#defining-network-components)
   * [Defining connections](#defining-connections)
   * [Component Groupings](#component-groupings)
   * [Component Filters](#component-filters)
   * [Network structures](#network-structures)
   * [Remote procedure calls](#defining-remote-procedure-calls)
1. [Network deployment](#network-deployment)
   * [Clustering](#clustering)

## Networks
A network is the representation of a collection of [components](#components) - special
Vert.x verticle implementations- and the connections between them. Put together,
a network processes streams of data in real-time. Vertigo puts no limitations
on network structures. Each component may be connected to zero or many other components,
and circular relationships may be created as well. Networks are defined using
the [definition](#defining-networks) API and [deployed](#network-deployment) using
local or [Via](https://github.com/kuujo/via) clusters.

![Vert.igo Network](http://s9.postimg.org/xuv3addj3/vertigo_complex_network.png)

This is an example of a complex network. Given a set of Vert.x verticles or
modules, Vertigo uses a code-based representation of the network structure
to define connections between network components, start component verticles
or modules, monitor components, and manage communication between them in a fast,
reliable manner.

See the [complex network example](https://github.com/kuujo/vertigo/tree/master/examples/complex)

## Components
A component represents a single vertex in a Vertigo network graph. Each network
may contain any number of components, and each component may have any number of
instances running within the network (each of which may be assigned to different
machines around a [cluster](#network-deployment)). Within the context of Vert.x
a component can be defined as a verticle that may receive messages from zero or
many verticles and send messages to one or many verticles. What happens within the
verticle depends entirely where they appear in a network graph and how the component
is implemented. Vertigo provides several component implementations.

## Messaging
One of the primary responsibilities of Vertigo is managing communication between
network components in a consistent, predictable, and reliable manner. Vertigo
uses the Vert.x event bus for inter-component communication, but Vertigo also
provides many reliability features on top of the event bus.

### How components communicate
Network components communicate with each other directly over the event bus
rather than being routed through a central message broker. When a network
is created, Vertigo assigns unique addresses *to each component (verticle)
instance* which that verticle uses to communicate with the verticles around
it. Thus, each component instance essentially maintains a direct connection
to its neighbors, ensuring fast messaging between them.

![Communication Channels](http://s7.postimg.org/unzwkrvgb/vertigo_channel.png)

### Message distribution
When messages are sent between components which have multiple instances running
within a network, Vertigo can manage distribution of messages between component
instances. To do this, Vertigo provides a *grouping* abstraction that allows
users to define how messages are dispatched to a set of component instances.
For instance, one component may require messages to be distributed among its
instances in a round-robin fashion, while another may require a consisten
hashing based approach. [Vertigo provides numerous component groupings for
different scenarios](#component-groupings).

### Messages
Messages are sent over the event bus in the form of `JsonObject` instances.
Just as Vertigo networks have a structure, Vertigo messages can have structure
as well: trees. Messages can be emitted from components either as individuals
or as children of other messages. This hierarchical system integrates with the
[message acking](#message-acking) system to provide increased reliability -
acking for entire message trees, not just individual messages.

Vertigo messages also contain a number of metadata fields in addition to
the message body. These fields describe things like where the message came
from, who the message's parents and ancestors are, and other interesting
information. [Read more about message fields here](#jsonmessage)

## Reliability
Vertigo provides a number of reliability features that help ensure networks
continue to run and messages are never lost.

### Component supervision
When a Vertigo network is deployed, a special *coordinator* verticle is
deployed as well. It is *coordinator's* task to ensure that all component
instances continue to run smoothly. To do so, component instances connect
to the *coordinator* verticle, receive a unique heartbeat address, and begin
sending heartbeat messages to the coordinator. If a component fails to send
a heartbeat within a certain amount of time, the component is assumed to be
dead and will be automatically re-deployed.

This concept holds true for both local and clustered Vertigo networks. In
the case of using [Via](https://github.com/kuujo/via) for clustering, the
*coordinator* verticle will simply re-deploy failed component verticles
or modules using the Via API, resulting in the component being assigned
to a new machine.

### Message acking
In addition to the *coordinator* verticle being deployed for each Vertigo
network, another special verticle called the *auditor* verticle is deployed,
as well. The Vertigo *auditor* is tasked with monitoring messages within the
network, tracking acks and nacks throughout the network, and notifying
*feeders* when a message tree fails.

![Network Auditor](http://s14.postimg.org/kkl297qo1/vertigo_acker.png)

Each network may have any number of auditor verticles (this is configurable
via the network definition).

#### How acking works
When a component creates and emits a new message, the message will be
assigned an *auditor* verticle (each auditor for any given network has
a unique event bus address). Any time the message or a descendent message
is emitted, acked, or failed from a component, the assigned *auditor*
will be sent a message notifying it of the change. A source message
can potentially have thousands of messages created based on its data,
and Vertigo tracks all of the messages that originate from a source
message. If a message or one of its descendents is failed or times
out at any point within the network, the original source will be
notified immediately. Internally, the auditor maintains a record of the
entire message tree structure, and only once all of the messages have
been acked will it send a message back to the original data source (the
component that created the first message). In this way, Vertigo
tracks a single message's transformation - no matter how complex -
to completion before notifying the data source.

## A simple network
In order to get a better understanding of the concepts introduced in
Vertigo, let's take a look at a simple network example.

### Defining the network
Vertigo networks are defined using the [definitions](#defining-networks)
API.

```javascript
var vertigo = require('vertigo');
var grouping = require('vertigo/grouping');

var network = vertigo.createNetwork('word_count');
network.fromVerticle('word_feeder', 'word_feeder.js')
  .toVerticle('word_counter', 'word_counter.js', 4)
  .groupBy(new grouping.FieldsGrouping('word'));
```

This network definition defines a simple network that consists of only two
verticles, a feeder and a worker. First, we define a new network named *word_count*.
Each vertigo network should have a unique name which is used to derive each
of the network's *component* instances unique addresses (Vertigo addresses are
generated in a predictable manner). With the new network defined, we add a
*source* verticle to the network - this is usually a feeder or executor, though
workers can be used in more complex cases - which connects to a *worker* verticle.
In Vertigo, each of the elements is known as a *component* - either a verticle
or module - each of which can have any number of instances. In this case, the
*word_counter* component has four instances. This means that Vertigo will deploy
four instances of the `WordCountWorker` verticle when deploying the network.

Finally, we group the `word_counter` component using a `FieldsGrouping`. Because
this particular component counts the number of words arriving to it, the same
word *must always go to the same component instance*, and the `FieldsGrouping`
is the element of the definition that guarantees this will happen. Groupings are
used to essentially define how messages are distributed among multiple instances
of a component.

### Creating the feeder
Now let's look at how the feeder emits messages. First, to create a [feeder](#feeders)
component we need to first import the `vertigo` module.

```javascript
var vertigo = require('vertigo');
var console = require('vertx/console');

vertigo.createPollingFeeder().start(function(error, feeder) {
  if (error) {
    console.log('An error occured.');
  }
});
```

Here we `require` the `vertigo` module. From this we create and start a new `PollingFeeder`
instance. The polling feeder allows us to feed data to the network whenever the feeder's
internal feed queue is not full. Vertigo provides several [feeders](#feeders) for
different use cases.

Once the feeder has started, we can begin feeding data.

```javascript
feeder.feedHandler(function(feeder) {
  var words = ['apple', 'banana', 'peach', 'pear', 'orange'];
  var word = words[Math.random() * words.length];
  feeder.feed({'word': word});
});
```

Here we feed a random word from a list of words to the network. But what if
the data fails to be processed? How can we be notified? The Vertigo feeder
API provides for additional arguments that allow the feeder to be notified
once a message is successfully processed.
[See what successfully processing means](#how-acking-words)

```javascript
feeder.feedHandler(function(feeder) {
  var words = ['apple', 'banana', 'peach', 'pear', 'orange'];
  var word = words[Math.random() * words.length];
  feeder.feed({'word': word}, function(failed) {
    if (failed) {
      console.log('Failed to process message.');
    }
    else {
      console.log('Successfully processed message.');
    }
  });
});
```

By providing an additional handler to the `feed()` method, the feeder will
now be notified once the message is acked or failed.

### Creating the worker
Now that we have a feeder to feed messages to the network, we need
to implement a [worker](#workers). Workers are the primary units of processing in
Vertigo. In this case, we're creating a worker that counts the occurences
of words in the `word` field of the message body.

Creating and starting workers is done in the same was as with the feeder.

```javascript
var vertigo = require('vertigo');
var console = require('vertx/console');

var counts = {};

vertigo.createWorker().start(function(error, worker) {
  if (error) {
    console.log('An error occured.');
  }
});
```

Once we have created a worker, we need to add a handler for incoming
messages. To do this we call the `messageHandler` method.

```javascript
worker.messageHandler(function(message) {
  word = message.body['word'];
  if (typeof(counts[word]) == 'undefined') {
    counts[word] = 1;
  }
  else {
    counts[word]++;
  }
});
```

Once we're done processing the message, we may want to emit the new
count to any other components that may be listening. To do so, we call
the `emit()` method on the `Worker` instance.

```javascript
worker.emit({'word': word, 'count': counts[word]}, message);
```

Once a message has been fully processed, it is essential that the
message be acked. This notifies the network that the message has been
fully processed, and once all messages in a message tree have been
processed the original data source (the feeder above) will be notified.

```javascript
worker.ack(message);
```

### Deploying the network
Now that we've created the network and implemented each of its components,
we need to deploy the network. Vertigo supports both local and clustered
network deployments using the `LocalCluster` and `ViaCluster` (see
[Via](https://github.com/kuujo/via)) interfaces. In this case, we'll just
use the `LocalCluster`.

To deploy the network, we just pass our network definition to a cluster
instance's `deploy()` method.

```javascript
var vertigo = require('vertigo');
var grouping = require('vertigo/grouping');
var vertx = require('vertx');
var console = require('vertx/console');

var network = vertigo.createNetwork('word_count');
network.fromVerticle('word_feeder', 'word_feeder.js')
  .toVerticle('word_counter', 'word_counter.js', 4)
  .groupBy(new grouping.FieldsGrouping('word'));

var cluster = vertigo.createLocalCluster();
cluster.deploy(network, function(error, context) {
  if (error) {
    console.log('Failed to deploy network.');
  }
  else {
    vertx.setTimer(5000, function() {
      cluster.shutdown(context);
    });
  }
});
```

The `NetworkContext` that is returned by the deployment contains
valuable information about the network. See [contexts](#contexts)
for more info.

### Executing the network as a remote procedure
But what if the feeder needs to receive feedback on the word count? In this
case, we can replace the feeder with an [executor](#executors). Executors
work by capitalizing on circular connections within networks. Thus, first
we need to re-define the network to create a circular connection between
the data source and the worker.

```javascript
var network = vertigo.createNetwork('word_count');
var executor = network.fromVerticle('word_executor', 'word_executor.js');
executor.toVerticle('word_counter', 'word_counter.js', 4)
  .groupBy(new grouping.FieldsGrouping('word'))
  .to(executor);
```

First, we store the `word_executor` component definition in a variable, connect
it to the `word_counter`, and then connect the `word_counter` back to the
`word_executor`. This creates the circular connections that are required for
remote procedure calls.

Now that we have our circular connections, we can re-define the original feeder
to expect a result using an executor.

```javascript
var vertigo = require('vertigo');

vertigo.createBasicExecutor().start(function(error, executor) {
  if (!error) {
    var words = ['apple', 'banana', 'peach', 'pear', 'orange'];
    while (!executor.queueFull()) {
      var word = words[Math.random() * words.length];
      execeutor.execute({'word': word}, function(failed, result) {
        if (failed) {
          console.log('Failed to process message.');
        }
        else {
          console.log('Current count is ' + result.body['count']);
        }
      });
    }
  }
});
```

Note that because the `word_counter` component always emits data, it does
not have to be refactored to support remote procedure calls. For this reason,
all component implementations *should always emit data* whether they may or
may not be connected to any other component. If the component is not, in fact,
connected to any other component, `emit`ing data will have no effect.

## Creating components
Components are simply special Vert.x verticle instances. As such, Vertigo can
deploy components of any language from any language. In Javascript, the
`vertigo` module is used to access Vertigo feeders, workers, and executors.

The `vertigo` object exposes the following methods:
* `createNetwork()` - creates a [network](#networks)
* `createFeeder()` - creates a [basic feeder](#basic-feeder)
* `createBasicFeeder()` - creates a [basic feeder](#basic-feeder)
* `createPollingFeeder()` - creates a [polling feeder](#polling-feeders)
* `createStreamFeeder()` - creates a [stream feeder](#stream-feeders)
* `createExecutor()` - creates a [basic executor](#executors)
* `createBasicExecutor()` - creates a [basic executor](#executors)
* `createWorker()` - creates a [worker](#workers)
* `createLocalCluster()` - creates a [local cluster](#clustering)
* `createViaCluster()` - creates a [Via cluster](#clustering)

### Contexts
The `WorkerContext` object contains information relevant to the current component
instance, as well as its parent component definition and even information about
the entire network layout, including unique addresses for each network component
instance.

#### WorkerContext
The `WorkerContext` exposes the following interface:
* `address` - the unique worker event bus address
* `config` - the worker configuration - this is inherited from the component definition
* `componentContext()` - returns the parent component context

#### ComponentContext
The `ComponentContext` exposes the following interface:
* `address` - the component address - this is the basis for all component instance addresses
* `connectionContexts()` - an array of `ConnectionContext` instances that
  describe the addresses to which this component feeds/emits messages and their
  component [filters](#component-filters) and [groupings](#component-groupings)
* `workerContexts()` - an array of all component instance contexts for the component
* `definition()` - the component [definition](#defining-network-components)
* `networkContext()` - returns the parent network context

#### NetworkContext
The `NetworkContext` exposes the following interface:
* `address` - the network address - this is the basis for all component addresses
* `broadcastAddress()` - the network broadcast address - this is the event bus
  address used by network [auditors](#message-acking) to broadcast message statuses (acks/nacks)
* `numAuditors()` - returns the number of network [auditors](#message-acking)
* `auditors()` - returns a set of network auditor addresses, each auditor is
  assigned its own unique event bus address
* `componentContexts()` - a collection of all network component contexts
* `definition()` - the network [definition](#defining-networks)

### Feeders
Feeders are components whose sole responsibility is to feed data to a network.
Data generated by feeders may come from any source, and Vertigo provides a number
of feeder implementations for integrating networks with a variety of Vert.x and
other APIs.

Each feeder exposes the following configuration methods:
* `maxQueueSize(queueSize)` - sets the maximum feed queue size
* `maxQueueSize()` - gets the maximum feed queue size
* `queueFull()` - indicates whether the feed queue is full
* `autoRetry(retry)` - sets whether to automatically retry sending
  [failed](#message-acking) messages
* `autoRetry()` - indicates whether auto retry is enabled
* `retryAttempts(attempts)` - sets the number of retries to attempt
  before explicitly failing the feed. To set an infinite number of retry
  attempts pass `-1` as the `attempts` argument
* `retryAttempts()` - indicate the number of automatic retry attempts

To start a feeder, call the `start()` method:
* `start(startHandler)` - `startHandler` is an asyncronous handler that accepts
  the started feeder as the second argument

Once a feeder has been started, you can feed messages using the `feed()` method:
* `feed(data)`
* `feed(data, tag)`
* `feed(data, ackHandler)`
* `feed(data, tag, ackHandler)`

`data` must always be a JSON object.

When passing an `ackHandler` to a `feed` method, the handler will be invoked
once an `ack` or `fail` message is received from a network *auditor*. If
`autoRetry` is enabled, `retryAttempts` attempts will be made before the
handler will be invoked.

#### Basic Feeder
The `BasicFeeder` is a simple feeder implementation that provides no additional
methods for integrating with Vert.x APIs. It is sufficient for simple feed
operations. Once a `BasicFeeder` has been created, you must call the `start`
method, passing an asynchronous result handler to be invoked once the feeder
has been registered with the network.

The basic feeder exposes only the standard feeder methods.

```javascript
vertigo.createBasicFeeder().start(function(error, feeder) {
  if (!error) {
    feeder.feed({'foo': 'bar'}, function(failed) {
      if (failed) {
        // Processing failed.
      }
      else {
        // Processing succeeded.
      }
    });
  }
});
```

#### Polling Feeder
The `PollingFeeder` is designed to poll for new messages only when the feed
queue is not empty. To do so, a `feedHandler` is registered on the feeder.

The `PollingFeeder` provides the following additional configuration methods:
* `feedDelay(delay)` - sets the interval between feed attempts when
  no messages were fed by the `feedHandler`
* `feedDelay()` - indicates the feed delay

To register a feed handler, call the `feedHandler()` method, passing a
handler instance.

```javascript
vertigo.createPollingFeeder().start(function(error, feeder) {
  if (!error) {
    feeder.maxQueueSize(1000);
    feeder.feedHandler(function(feeder) {
      feeder.feed({'body': 'Hello world!'}, function(failed) {
        if (failed) {
          // Processing failed.
        }
        else {
          // Processing succeeded.
        }
      });
    });
  }
});
```

#### Stream Feeder
The `StreamFeeder` is designed to integrate with Vert.x `ReadStream` APIs,
such as with sockets. To do so, it exposes an API similar to that of the
`WriteStream`, providing `fullHandler` and `drainHandler` methods.
* `fullHandler(handler)` - sets a handler to be invoked when
  the feed queue is full
* `drainHandler(handler)` - sets a handler to be invoked
  once a full feed queue is prepared to accept new messages

```javascript
vertigo.createStreamFeeder().start(function(error, feeder) {
  if (!error) {
    var paused = false;
    feeder.fullHandler(function() {
      paused = true;
    });
    feeder.drainHandler(function() {
      paused = false;
    });

    feeder.feed({'foo': 'bar'}, function(failed) {
      if (failed) {
        // Processing failed.
      }
      else {
        // Processing succeeded.
      }
    });
  }
});
```

### Workers
Worker components are the primary units of processing in Vertigo. Workers
are designed to both receive input and emit output (though workers can do
one or the other). The processes that are performed in between depend
entirely on the implementation.
Each worker must have a handler assigned to it for handling incoming messages.
To attach a handler to a `Worker`, call the `messageHandler()` method. To
start a worker, call the `start()` method, passing an asynchronous handler
to be invoked once the worker has been registered on the event bus.

```javascript
vertigo.createWorker().start(function(error, worker) {
  if (!error) {
    worker.messageHandler(function(message) {
      // Handle the message.
    });
  }
});
```

#### Vertigo Messages
When a worker receives data, it receives it in the form of a `JsonMessage`
instance. This special message wrapper provides an API that exposes more
information about a message than just data. Vertigo messages can be organized
into message trees with relationships between messages. The `JsonMessage`
provides metadata about the message and its relationship to other messages
with the following methods:
* `id` - the unique message identifier
* `body` - the message body, a `JsonObject` instance
* `tag` - the message tag
* `source` - the `name` of the component from which this message tree originated
* `parent` - the parent message's unique identifier
* `ancestor` - the original message's unique identifier, the identifier
  of the source of the message tree
* `auditor` - the address of the auditor for this message's message tree

```javascript
worker.messageHandler(function(message) {
  words = message.body['words'];
});
```

#### Emitting messages
Each worker component can both receive and emit messages. Of course, where
a message goes once it is emitted from a worker instance is abstracted from
the implementation, and the `Worker` interface behaves accordingly. The
`Worker` exposes the following methods for emitting messages
* `emit(data)` - emits a message body
* `emit(data, tag)` - emits a message body with a tag
* `emit(data, parent)` - emits a message body as a child of the given
  message instance
* `emit(data, tag, parent)` emits a message body with a tag as a child of
  the given message instance

```javascript
worker.messageHandler(function(message) {
  words = message.body['words'];
  worker.emit({'count': words.length}, message);
});
```

Note that hierarchical message relationships are created by passing a parent
message to the `emit()` method. When this type of relationship is created, the
message tree's assigned `auditor` is notified of the new relationship. What this
relationship means is that the message `source` will not be notified of a
message's successful completion until *all messages in the message tree* have
been completely acked. However, if a message is *failed* then the message `source`
will be notified immediately.

#### Acking messages
Vertigo provides for reliable messaging between network components using acks
and fails. *Each message that is received by a worker component must be acked
or failed*, otherwise the message tree will eventually be failed via timeout.
The `Worker` provides the following methods for acks/fails:
* `ack(message)` - indicates that a message has been successfully
  processed
* `fail(message)` - indicates that a message has failed processing.
  This can be used as a vehicle for notifying data sources of invalid data
* `fail(message, failureMessage)` - indicates that a message
  has failed processing, passing a failure message that will be passed on to
  the data source

```javascript
worker.messageHandler(function(message) {
  words = message.body['words'];
  if (words === undefined) {
    worker.fail(message, 'Invalid data.');
  }
  else {
    worker.emit({'count': words.length}, message);
    worker.ack(message);
  }
});
```

### Executors
Executors are components that execute part or all of a network essential
as a remote procedure invocation. Data emitted from executors is tagged
with a unique ID, and new messages received by the executor are correlated
with past emissions.

Each executor exposes the following `execute()` methods:
* `execute(args, resultHandler)`
* `execute(args, tag, resultHandler)`

#### Basic Executor
The `BasicExecutor` is a bare bones implementation of the executor API that
is synonymous with the `BasicFeeder` for feeders. The `BasicExecutor` exposes
the following configuration methods:

* `replyTimeout(timeout)` - sets the message reply timeout
* `replyTimeout()` - gets the message reply timeout
* `maxQueueSize(queueSize)` - sets the maximum execute queue size
* `maxQueueSize()` - gets the maximum execute queue size
* `queueFull()` - indicates whether the execute queue is full

```javascript
vertigo.createBasicExecutor().start(function(error, executor) {
  if (!error) {
    executor.execute({'x': 10, 'y': 45}, function(failed, result) {
      if (!failed) {
        var sum = result.body['sum'];
      }
    });
  }
});
```

#### Polling Executor
The `PollingExecutor` allows a handler to be registered with the executor.
Whenever the executor queue is prepared to accept new messages (i.e. the execute
queue is not full) the handler will be called. This allows flow to be controlled
by the executor.

The `PollingExecutor` exposes the following configuration methods:
* `executeDelay(delay)` - sets the amount of time to delay between polls
  when no executions occur during polling
* `executeDelay()` - gets the execute delay period

Execute handlers are registered via the `executeHandler()` method:
* `executeHandler(handler)`


```javascript
vertigo.createBasicExecutor().start(function(error, executor) {
  if (!error) {
    executor.executeHandler(function(executor) {
      executor.execute({'x': 10, 'y': 45}, function(failed, result) {
        if (!failed) {
          var sum = result.body['sum'];
        }
      });
    });
  }
});
```

#### Stream Executor
The `StreamExecutor` is specifically designed to integrate with Vert.x `ReadStream`
APIs. To do so, the `StreamExecutor` exposes an interface similar to that of the
`WriteStream`. The `StreamExecutor` exposes the following methods:
* `fullHandler(handler)` - sets a handler to be invoked when the
  execute queue is full
* `drainHandler(handler)` - sets a handler to be invoked when a
  full execute queue has been drained

```javascript
vertigo.createBasicExecutor().start(function(error, executor) {
  if (!error) {
    var paused = false;
    executor.fullHandler(function() {
      paused = true;
    });
    executor.drainHandler(function() {
      paused = false;
    });

    executor.execute({'x': 10, 'y': 45}, function(failed, result) {
      if (!failed) {
        var sum = result.body['sum'];
      }
    });
  }
});
```

Networks that use remote procedure invocations must be designed in a very
specific manner. Remote procedure calls work by essentially creating circular
connections between network components. See
[defining remote procedure calls](#defining-remote-procedure-calls) for more
on how this works.

## Defining networks
Networks are defined in code using a `Network` instance. 

Some [examples](https://github.com/kuujo/vertigo/tree/master/examples/complex)
demonstrate how the network definition API works.

To define a network, create a new `Network` instance either by using the
`vertigo.createNetwork()` method or instantiating a `Network` instance directly.

```javascript
var vertigo = require('vertigo');

var network = vertigo.createNetwork('test');
```

Each network must be given a *unique* name. Vertigo component addresses are
generated in a predictable manner, and this name is used to prefix all
component addresses and instance addresses.

The `Network` exposes the following configuration methods:
* `address(address)` - sets the network address, this is the basis
  for all generated network addresses and is synonymous with the network `name`
* `enableAcking()` - enables acking for the network
* `disableAcking()` - disabled acking for the network
* `ackingEnabled()` - indicates whether acking is enabled for the network
* `numAuditors(numAuditors)` - sets the number of network auditors (ackers)
* `numAuditors()` - indicates the number of network auditors
* `ackExpire(expire)` - sets the message ack expiration for the network
* `ackExpire()` - indicates the ack expiration for the network

### Defining network components
The `Network` class provides several methods for adding components
to the network.

* `from(component)`
* `fromVerticle(name)`
* `fromVerticle(name, main)`
* `fromVerticle(name, main, config)`
* `fromVerticle(name, main, instances)`
* `fromVerticle(name, main, config, instances)`
* `fromModule(name)`
* `fromModule(name, moduleName)`
* `fromModule(name, moduleName, config)`
* `fromModule(name, moduleName, instances)`
* `fromModule(name, moduleName, config, instances)`

Note that Vertigo supports both verticles and modules as network components.
The return value of each of these methods is a new `Component` instance
on which you can set the following properties:

* `type(type)` - sets the component type, *verticle* or *module*
* `main(main)` - sets a verticle main
* `module(moduleName)` - sets a module name
* `config(config)` - sets the component configuration. This is made available within
  component verticles via the instance's `WorkerContext`
* `workers(numWorkers)` - sets the number of component workers
* `groupBy(grouping)` - sets the component grouping, see [groupings](#component-groupings)
* `filterBy(filter)` - adds a component filter, see [filters](#component-filters)

### Defining connections
Connections between components are created by `toVerticle` and `toModule`
instances on `ComponentDefinition` objects. By calling one of the `to*` methods,
a connection from one component to the new component is implicitly created,
and a new component definition is returned. These methods follow the same
interface as the `fromVerticle` and `fromModule` methods on the `Network`
class.

* `to(component)`
* `toVerticle(name)`
* `toVerticle(name, main)`
* `toVerticle(name, main, config)`
* `toVerticle(name, main, instances)`
* `toVerticle(name, main, config, instances)`
* `toModule(name)`
* `toModule(name, moduleName)`
* `toModule(name, moduleName, config)`
* `toModule(name, moduleName, instances)`
* `toModule(name, moduleName, config, instances)`

### Component Groupings
With each component instance maintaining its own unique event bus address,
Vertigo needs a way to determine which component messages emitted from one
component are dispatched to. Each component may indicate a *grouping* which
determines how messages are distributed among multiple instances of the
component. For instance, one component may need to receive all messages
emitted to it, while another may be need to receive messages in a round-robin
fashion. Vertigo provides groupings for various scenarios, including
consistent-hashing based groupings. Custom component groupings may also
be provided.

Groupings are abstracted from component implementations, so they can be added
when *defining* a network component rather than within component verticles
themselves.

To set a component grouping, call the `groupBy()` method on a component
definition, passing a grouping instance.

```javascript
var vertigo = require('vertigo');
var grouping = require('vertigo/grouping');

var network = vertigo.createNetwork('foo');
network.fromVerticle('bar', 'com.mycompany.myproject.MyFeederVerticle')
  .toVerticle('baz', 'some_worker.py', 2).groupBy(new grouping.FieldsGrouping('type'));
```

When messages are emitted to instances of the component, the related grouping
*dispatcher* will be used to determine to which component instance a given
message is sent.

Vertigo provides several grouping types:

* `RandomGrouping` - component instances receive messages in random order
```javascript
var network = vertigo.createNetwork('foo');
network.fromVerticle('bar', 'com.mycompany.myproject.MyFeederVerticle')
  .toVerticle('baz', 'some_worker.py', 2).groupBy(new grouping.RandomGrouping());
```

* `RoundGrouping` - component instances receive messages in round-robin fashion
```javascript
var network = vertigo.createNetwork('foo');
network.fromVerticle('bar', 'com.mycompany.myproject.MyFeederVerticle')
  .toVerticle('baz', 'some_worker.py', 2).groupBy(new grouping.RoundGrouping());
```

* `FieldsGrouping` - component instances receive messages according to basic
  consistent hashing based on a given field
```javascript
var network = vertigo.createNetwork('foo');
network.fromVerticle('bar', 'com.mycompany.myproject.MyFeederVerticle')
  .toVerticle('baz', 'some_worker.py', 2).groupBy(new grouping.FieldsGrouping('foo'));
```

* `AllGrouping` - all component instances receive a copy of each message
```javascript
var network = vertigo.createNetwork('foo');
network.fromVerticle('bar', 'com.mycompany.myproject.MyFeederVerticle')
  .toVerticle('baz', 'some_worker.py', 2).groupBy(new grouping.AllGrouping());
```

### Component Filters
Vertigo messages contain metadata in addition to the message body. And just
as with grouping component instances, sometimes components may be only
interested in receiving messages containing specific metadata. For this,
Vertigo provides message filters which allow components to define the types
of messages they receive. As with groupings, custom filters may be provided.

Filters are abstracted from component implementations, so they can be added
when *defining* a network rather than within component verticles themselves.

To add a filter to a component, call the `filterBy()` method on a component
definition, passing a filter instance. Multiple filters can be set on any
given component, in which case a message must pass *all* filters before being
sent to the component.

```javascript
var vertigo = require('vertigo');
var filter = require('vertigo/filter');

var network = vertigo.createNetwork('foo');
network.fromVerticle('bar', 'com.mycompany.myproject.MyFeederVerticle')
  .toVerticle('baz', 'some_worker.py', 2).filterBy(new grouping.TagsFilter('product'));
```

Vertigo provides several types of filters:

* `TagsFilter` - filters messages by tags
```javascript
var network = vertigo.createNetwork('foo');
network.fromVerticle('bar', 'com.mycompany.myproject.MyFeederVerticle')
  .toVerticle('baz', 'some_worker.py', 2).filterBy(new grouping.TagsFilter('product'));
```

* `FieldFilter` - filters messages according to a field/value
```javascript
var network = vertigo.createNetwork('foo');
network.fromVerticle('bar', 'com.mycompany.myproject.MyFeederVerticle')
  .toVerticle('baz', 'some_worker.py', 2).filterBy(new grouping.FieldFilter('type', 'product'));
```

* `SourceFilter` - filters messages according to the source component name
```javascript
var network = vertigo.createNetwork('foo');
network.fromVerticle('bar', 'com.mycompany.myproject.MyFeederVerticle')
  .toVerticle('baz', 'some_worker.py', 2).filterBy(new grouping.SourceFilter('rabbit'));
```

### Network structures
Vertigo places *no limits* on network structures. The definitions API is
designed to support any network topology including circular structures
(which are in fact required for [remote-procedure calls](#executors)).

### Defining remote procedure calls
Remote procedure calls in Vertigo work by creating circular topologies.
When an executor executes a message, the message is tagged with a unique
ID and the executor waits for a message with the same ID to make its return.
Thus, the network must eventually lead back to the executor component.

To create a connection back to the original executor, you must store the
executor definition in a variable and then pass the definition to the `to()`
method of a component instance.

```javascript
var network = vertigo.createNetwork('rpc');
executor = network.fromVerticle('executor', 'executor.js');
executor.toVerticle('sum', 'com.mycompany.myproject.SumVerticle').to(executor);
```

## Network deployment
Once you have defined a network using the definition API, the network can
be deployed via the `Cluster` API. Vertigo provides two types of deployment
methods via `LocalCluster` and `ViaCluster`. Each implement the `Cluster`
interface:

* `deploy(network)`
* `deploy(network, doneHandler)`
* `shutdown(context)`
* `shutdown(context, doneHandler)`

When a network is deployed successfully, a `NetworkContext` instance may
be returned if a `doneHandler` was provided. The `NetworkContext` instance
contains information about the network components, including component
definitions, addresses, and connections.

```javascript
var vertigo = require('vertigo');

var cluster = vertigo.createLocalCluster();
cluster.deploy(network, function(error, context) {
  if (error) {
    cluster.shutdown(context);
  }
});
```

## Clustering
Vertigo supports distributing network components across multiple Vert.x
instances using [Via](https://github.com/kuujo/via), a distributed
deployment framework for Vert.x (Via was specifically developed for Vertigo).
Following the same `Cluster` API, Via will handle assigning component
instances to various Vert.x instances within a cluster in a predictable
manner. Users can optionally specify custom Via *schedulers* in order to
control component assignments.

See the [Via documentation](https://github.com/kuujo/via) for more information
on clustering with Vertigo.

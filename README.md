Vert.igo
========

**Check out the [Main Project](https://github.com/kuujo/vertigo)**
**The Vertigo [Python API](https://github.com/kuujo/vertigo-python) is under development**

Vertigo is a distributed event processing framework built on the
[Vert.x](http://vertx.io/) application platform. Following a concept and
structure similar to [Storm](https://github.com/nathanmarz/storm), Vertigo
allows real-time problems to be broken down into smaller tasks (as Vert.x
verticles) and distributed across **one or many Vert.x instances**, managing
communication between components in a **predictable and reliable** manner.

## [Javascript User Manual](#javascript-user-manual) | [JSDoc](http://vertigo.kuujo.net/js/)

# Javascript User Manual

1. [Concepts](#concepts)
   * [Networks](#networks)
   * [Components](#components)
1. [A Simple Network](#a-simple-network)
   * [Defining the network](#defining-the-network)
   * [Creating the feeder](#creating-the-feeder)
   * [Creating the worker](#creating-the-worker)
   * [Deploying the network](#deploying-the-network)
   * [Executing the network as a remote procedure](#executing-the-network-as-a-remote-procedure)
1. [Creating Components](#creating-components)
   * [Contexts](#contexts)
      * [InstanceContext](#instancecontext)
      * [ComponentContext](#componentcontext)
      * [NetworkContext](#networkcontext)
   * [Feeders](#feeders)
     * [BasicFeeder](#basic-feeder)
     * [PollingFeeder](#polling-feeder)
     * [StreamFeeder](#stream-feeder)
   * [Workers](#workers)
      * [JsonMessage](#jsonmessage)
      * [Emitting messages](#emitting-messages)
      * [Acking messages](#acking-messages)
   * [Executors](#executors)
      * [BasicExecutor](#basic-executor)
      * [PollingExecutor](#polling-executor)
      * [StreamExecutor](#stream-executor)
1. [Creating networks](#creating-networks)
   * [Adding components](#adding-components)
   * [Adding inputs](#adding-inputs)
   * [Input groupings](#input-groupings)
   * [Input filters](#input-filters)
   * [Network structures](#network-structures)
   * [Remote procedure calls](#defining-remote-procedure-calls)
1. [Network deployment](#network-deployment)
   * [Deploying networks locally](#deploying-networks-locally)
   * [Deploying networks across a cluster](#deploying-networks-across-a-cluster)
1. [Events](#events)
   * [Network events](#network-events)
   * [Component events](#component-events)
1. [Advanced features](#advanced-features)
   * [Wire taps](#wire-taps)
   * [Nested networks](#nested-networks)

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

## A simple network
In order to get a better understanding of the concepts introduced in
Vertigo, let's take a look at a simple network example.

### Defining the network
Vertigo networks are defined using the [networks](#creating-networks)
API.

```javascript
var vertigo = require("vertigo");
var network = vertigo.createNetwork("word_count");
network.addVerticle("word_count.word_feeder", "word_feeder.js");
network.addVerticle("word_count.word_counter", "word_counter.js")
  .addInput("word_count.word_feeder").groupBy(new vertigo.grouping.FieldsGrouping("word"));
```

This code defines a simple network that consists of only two verticles, a
feeder and a worker. First, we define a new network named *word_count*.
This is the address that will be used by the network coordinator once the
network is deployed.

Next, we add the *word_feeder* component to the network. Components may be
either verticles or modules, with `addVerticle` and `addModule` methods for
adding each type respectively. The first argument to any `addVerticle` or
`addModule` method is the component address. *Note that this is actually
the event bus address to which other components may connect to receive
messages from the component, so it's important that this name does not
conflict with other addresses on the event bus.*

Next, we add the *word_counter* verticle, which will count words. After the word
counter is added we indicate that the word counter should receive messages
from the component at *word_count.word_feeder* by adding an input from
that address. This means that once the network is started, each *word_count*
instance will notify all instances of the *word_feeder* component that it
is interested in receiving messages emitted by the *word_feeder*.

Finally, we group the `word_counter` component using a `FieldsGrouping`. Because
this particular component counts the number of words arriving to it, the same
word *must always go to the same component instance*, and the `FieldsGrouping`
is the element of the definition that guarantees this will happen. Groupings are
used to essentially define how messages are distributed among multiple instances
of a component.

### Creating the feeder
Now let's look at how the feeder emits messages. First, to create a [feeder](#feeders)
component we need to extend the `VertigoVerticle`.

`word_feeder.js`

```javascript
var vertigo = require('vertigo');

vertigo.createPollingFeeder().start(function(error, feeder) {
  if (!error) {
    // Feeder started successfully!
  }
});
```

Here we extend the special `VertigoVerticle` class which makes the `vertigo`
member available to us. From this we create and start a new `PollingFeeder` instance.
The polling feeder allows us to feed data to the network whenever the feeder's
internal feed queue is not full. Vertigo provides several [feeders](#feeders) for
different use cases.

Once the feeder has started, we can begin feeding data.

```javascript
feeder.feedHandler(function() {
  var words = ["apple", "banana", "peach", "pear", "orange"];
  var word = words[0];
  feeder.feed({word: word});
});
```

Here we feed a random word from a list of words to the network. But what if
the data fails to be processed? How can we be notified? The Vertigo feeder
API provides for additional arguments that allow the feeder to be notified
once a message is successfully processed.
[See what successfully processing means](#how-acking-works)

```javascript
var console = require('vertx/console');

feeder.feedHandler(function() {
  var word = ... // Get a random word.
  feeder.feed({word: word}, function(failed) {
    if (failed) {
      console.log("Failed to process word.");
    }
    else {
      console.log("Word was successfully processed!");
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
var console = require('vertigo/console');

vertigo.createWorker().start(function(error, worker) {
  if (!error) {
    console.log("Started worker!");
  }
});
```

Once we have created a worker, we need to add a handler for incoming
messages. To do this we call the `messageHandler` method.

```javascript
var counts = {};

worker.messageHandler(function(message) {
  word = message.body['word'];
  if (counts[word] === undefined) {
    counts[word] = 0;
  }
  counts[word]++;
});
```

Once we're done processing the message, we may want to emit the new
count to any other components that may be listening. To do so, we call
the `emit()` method on the `Worker` instance.

```javascript
worker.emit({word: word, count: counts[count]}, message);
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
var vertigo = require("vertigo");
var network = vertigo.createNetwork("word_count");
network.addVerticle("word_count.word_feeder", "word_feeder.js");
network.addVerticle("word_count.word_counter", "word_counter.js")
  .addInput("word_count.word_feeder").groupBy(new vertigo.grouping.FieldsGrouping("word"));

var cluster = vertigo.createLocalCluster();
cluster.deploy(network, function(error, context) {
  if (error) {
    console.log("An error occurred.");
  }
  else {
    cluster.shutdown(context);
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
network = vertigo.createNetwork("word_count");
network.addVerticle("word_count.word_executor", "word_executor.js")
  .addInput("word_count.word_counter");
network.addVerticle("word_count.word_counter", "word_counter.js", 4)
  .addInput("word_count.word_executor", new vertigo.grouping.FieldsGrouping("word"));
```

Here we simply add the word counter's address as an input to the word executor,
thus creating the circular connection.

Now that we have our circular connections, we can re-define the original feeder
to expect a result using an executor.

```javascript
vertigo.createBasicExecutor().start(function(error, executor) {
  if (!error) {
    var word = ... // Select a random word
    executor.execute({word: word}, function(error, result) {
      if (!error) {
        console.log("Current word count for " + result.body['word'] + " is " + result.body['count']);
      }
    });
  }
});
```

Note that because the `word_counter` component always emits data, it does
not have to be refactored to support remote procedure calls. For this reason,
all component implementations *should always emit data* whether they may or
may not be connected to any other component. If the component is not, in fact,
connected to any other component, `emit`ing data will have no effect.

Vert.igo Javascript API
=======================

Vertigo is a fast, reliable, fault-tolerant event processing framework built on
the [Vert.x](http://vertx.io/) application platform. Combining concepts of
cutting-edge [real-time systems](http://storm.incubator.apache.org/) and
[flow-based programming](http://en.wikipedia.org/wiki/Flow-based_programming),
Vertigo allows real-time problems to be broken down into smaller tasks (as
Vert.x verticles) and distributed across a Vert.x cluster. Vertigo provides
fault-tolerance for data streams and components, allowing developers to spend more
time focusing on application code.

For an in-depth look at the concepts underlying Vertigo, check out
[how it works](#how-it-works).

# Javascript User Manual
1. [Introduction](#introduction)
1. [Networks](#networks)
   * [Creating a new network](#creating-a-new-network)
   * [Adding components to a network](#adding-components-to-a-network)
   * [Creating connections between components](#)
   * [Routing messages between multiple component instances](#routing-messages-between-multiple-component-instances)
   * [Creating networks from JSON](#creating-networks-from-json)
1. [Deployment](#deployment)
   * [Deploying a network](#deploying-a-network)
   * [Undeploying a network](#undeploying-a-network)
   * [Reconfiguring a network](#reconfiguring-a-network)
   * [Deploying a bare network](#deploying-a-bare-network)
   * [Working with active networks](#working-with-active-networks)
1. [Clustering](#clustering)
   * [Configuring cluster scopes](#configuring-cluster-scopes)
1. [Components](#components)
   * [Creating a component](#creating-a-component)
   * [The elements of a Vertigo component](#the-elements-of-a-vertigo-component)
1. [Messaging](#messaging)
   * [Sending messages on an output port](#sending-messages-on-an-output-port)
   * [Receiving messages on an input port](#receiving-messages-on-an-input-port)
   * [Working with message groups](#working-with-message-groups)
1. [Logging](#logging)
   * [Logging messages to output ports](#logging-messages-to-output-ports)
   * [Reading log messages](#reading-log-messages)
1. [How it works](#how-it-works)
   * [How Vertigo handles messaging](#how-vertigo-handles-messaging)
   * [How Vertigo performs deployments](#how-vertigo-performs-deployments)
   * [How Vertigo coordinates networks](#how-vertigo-coordinates-networks)

## Introduction
Vertigo is a multi-step event processing framework built on Vert.x. It exposes a
very simple yet powerful API defines networks of Vert.x verticles and the relationships
between them in a manner that abstracts communication details from implementations, making
Vertigo components reusable. It supports deployment of networks within a single Vert.x
instance or across a cluster of Vert.x instances and performs setup and coordination
internally. Vertigo also provides for advanced messaging requirements such as strong
ordering and exactly-once semantics.

## Networks
Vertigo networks are collections of Vert.x verticles and modules that are connected
together by the Vert.x event bus. Networks and the relationships therein are defined
externally to their components, promoting reusability.

### Creating a network
To create a new network, create a new `Vertigo` instance and call the `createNetwork` method.

```javascript
var vertigo = require('vertigo');

var network = vertigo.createNetwork('my-network');
```

All Vertigo networks have an explicit, unique name. This name is very important to
Vertigo as it can be used to reference networks from anywhere within a Vert.x cluster,
but more on that later.

### Adding components to a network
To add a component to the network, use one of the `addVerticle` or `addModule` methods.

```javascript
network.addVerticle('foo', 'foo.js');
```

The `addVerticle` and `addModule` methods each accept a component name, module or
main, configuration, and number of instances.

Just as with networks, Vertigo components are explicitly named. The component name
*must be unique within the network to which the component belongs*.

The `NetworkConfig` API also exposes an abstract `addComponent` method which detects
whether the added component is a module or a verticle based on module naming conventions.

Once a component has been added to the network, the component configuration will
be returned. Users can set additional options on the component configuration. The
most important of these options is the `group` option. When deploying networks within
a Vert.x cluster, the `group` indicates the HA group to which to deploy the module or verticle.

### Creating connections between components
A set of components is not a network until connections are created between those
components. Vertigo uses a concept of *ports* to abstract input and output from
each component instance. When creating connections between components, you must
specify a component and port to which the connection connects. Each connection
binds one component's output port with another component's input port.

To create a connectoin between two components use the `createConnection` method.

```javascript
network.createConnection('foo', 'out', 'bar', 'in');
```

The arguments to the `createConnection` method are, in order:
* The source component's name
* The source component's output port to connect
* The target component's name
* The target component's input port to connect

You may wonder why components and ports are specified by strings rather than
objects. Vertigo supports reconfiguring live networks with partial configurations,
so objects may not necessarily be available within the network configuration
when a partial configuration is created. More on partial network deployment
and runtime configuration changes in the [deployment](#deployment) section.

### Routing messages between multiple component instances
Just as with Vert.x verticles and modules, each Vertigo component can support
any number of instances. But connections are created between components and
not component instances. This means that a single connection can reference
multiple instances of each component. By default, the Vert.x event bus routes
messages to event bus handlers in a round-robin fashion. But Vertigo provides
additional routing methods known as *selectors*. Selectors indicate how messages
should be routed between multiple instances of a component.

Vertigo provides several selector types by default and supports custom selectors
as well.

* Round robin selector - selects targets in a round-robin fashion
* Random selector - selects a random target to which to send each message
* Hash selector - uses a simple mod hash algorithm to select a target for each message
* Fair selector - selects the target with the least number of messages in the queue
* All selector - sends each message to all target instances
* Custom selector - user provided custom selector implementation

The `ConnectionConfig` API provides several methods for setting selectors
on a connection.
* `roundSelect()` - sets a round-robin selector on the connection
* `randomSelect()` - sets a random selector on the connection
* `hashSelect()` - sets a mod hash based selector on the connection
* `fairSelect()` - sets a fair selector on the connection
* `allSelect()` - sets an all selector on the connection
* `customSelect(Selector selector)` - sets a custom selector on the connection

### Creating networks from JSON
Vertigo supports creating networks from json configurations. To create a network
from json call the `Vertigo.createNetwork(JsonObject)` method.

```javascript
var network = vertigo.createNetwork({name: 'test-network'});
```

The JSON configuration format is as follows:

* `name` - the network name
* `scope` - the network cluster scope, e.g. `local` or `cluster`. See [configuring cluster scopes](#configuring-cluster-scopes)
* `components` - an object of network components, keyed by component names
   * `name` - the component name
   * `type` - the component type, either `module` or `verticle`
   * `main` - the verticle main (if the component is a verticle)
   * `module` - the module name (if the component is a module)
   * `config` - the module or verticle configuration
   * `instances` - the number of component instances
   * `group` - the component deployment group (Vert.x HA group for clustering)
   * `storage` - an object defining the component data storage facility
      * `type` - the component data storage type. This is a fully qualified `DataStore` class name
      * `...` - additional data store configuration options
* `connections` - an array of network connections
   * `source` - an object defining the connection source
      * `component` - the source component name
      * `port` - the source component's output port
   * `target` - an object defining the connection target
      * `component` - the target component name
      * `port` - the target component's input port
   * `selector`- an object defining the connection selector
      * `type` - the selector type, e.g. `round-robin`, `random`, `hash`, `fair`, `all`, or `custom`
      * `selector` - for custom selectors, the selector class
      * `...` - additional selector options

For example...

```
{
  "name": "my-network",
  "scope": "local",
  "components": {
    "foo": {
      "name": "foo",
      "type": "verticle",
      "main": "foo.js",
      "config": {
        "foo": "bar"
      },
      "instances": 2
    },
    "bar": {
      "name": "bar",
      "type": "module",
      "module": "com.foo~bar~1.0",
      "instances": 4
    }
  },
  "connections": [
    {
      "source": {
        "component": "foo",
        "port": "out"
      },
      "target": {
        "component": "bar",
        "port": "in"
      },
      "selector": {
        "type": "fair"
      }
    }
  ]
}
```

## Deployment
One of the most important tasks of Vertigo is to support dpeloyment and startup
of networks in a consistent and reliable manner. Vertigo supports network deployment
either within a single Vert.x instance (local) or across a cluster of Vert.x instances.
When a Vertigo network is deployed, a special verticle known as the *network manager*
is deployed. The network manager is tasked with managing and monitoring components
within the network, handling runtime configuration changes, and coordinating startup
and shutdown of networks.

Networks can be deployed and configured from any verticle within any node in a Vert.x
cluster. If a network is deployed from another verticle, the network can still be
referenced and updated from anywhere in the cluster. Vertigo's internal coordination
mechanisms ensure consistency for deployments across all nodes in a cluster.

Vertigo clustering is supported by [Xync](http://github.com/kuujo/xync)

For more information on network deployment and coordination see [how it works](#how-it-works)

### Deploying a network
To deploy a network, simply use the `deployNetwork` method.

```javascript
var network = vertigo.createNetwork('test');
network.addVerticle('foo', 'foo.js', 2);
network.addVerticle('bar', 'bar.py', 4);
network.createConnection('foo', 'out', 'bar', 'in');

vertigo.deployNetwork(network);
```

When Vertigo deploys the network, it will automatically detect the current Vert.x
cluster scope. If the current Vert.x instance is a member of a Xync cluster then
the network will be deployed across the Xync cluster. Otherwise, the network will
be deployed within the current Vert.x instance using the Vert.x `Container`.

### Undeploying a network
To undeploy a network, use the `undeployNetwork` method.

```javascript
vertigo.undeployNetwork('test', function(error) {
  if (!error) {
    // Successfully undeployed the network
  }
});
```

Passing a string network name to the method will cause the entire network to
be undeployed. The method also supports a network configuration which can be
used to undeploy portions of the network without undeploying the entire network.
More on that in a minute.

### Reconfiguring a network
Vertigo networks can be reconfigured even after deployment. This is where network
names become particularly important. When a user deploys a network, Vertigo first
determines whether the network is already deployed within the current Vertigo cluster.
If a network with the same name is already deployed, *the given network configuration
will be merged with the existing network configuration* and Vertigo will update
components and connections within the network rather than deploying a new network.
This means that Vertigo networks can be deployed one component or connection at
a time.

```javascript
// Create and deploy a two component network.
var network = vertigo.createNetwork('test');
network.addVerticle('foo', 'foo.js', 2);
network.addVerticle('bar', 'bar.py', 4);

// Deploy the network to the cluster.
vertigo.deployNetwork(network, function(error) {
  if (!error) {
    // Create and deploy a connection between the two components.
    var network = vertigo.createNetwork('test'); // Note the same network name.
    network.createConnection('foo', 'out', 'bar', 'in');
    vertigo.deployNetwork(network);
  }
});
```


### Deploying a bare network
Since networks can be reconfigured *after* deployment, Vertigo provides a simple
helper method for deploying empty networks that will be reconfigured after deployment.
To deploy an empty network simply deploy a string network name.

```javascript
vertigo.deployNetwork('test');
```

Note that this method can also be used to reference an existing network and retrieve
an `ActiveNetwork` instance (more on active networks below):

```javascript
vertigo.deployNetwork('test', function(error, network) {
  // 'network' is an active network
});
```

### Working with active networks
Vertigo provides a helper API for reconfiguring netowrks known as *active networks*.
The `ActiveNetwork` is a `NetworkConfig` like object that exposes methods that directly
update the running network when called. Obviously, the name is taken from the active
record pattern.

When deploying any network an `ActiveNetwork` instance for the deployed network will
be returned once the deployment is complete.

```javascript
// Create a network with a single component.
var network = vertigo.createNetwork('test');
network.addVerticle('foo', 'foo.js', 2);

vertigo.deployNetwork(network, function(error, network) {
  // Add another component to the network and create a connection between the two components.
  network.addVerticle('bar', 'bar.py', 4);
  network.createConnection('foo', 'out', 'bar', 'in');
});
```

The `ActiveNetwork` instance contains a reference to the *entire* network configuration,
even if the configuration that was deployed was only a partial network configuration.

## Clustering
Vertigo clustering is currently only supported by [Xync](http://github.com/kuujo/xync).
Xync allows Vertigo to remotely deploy Vert.x verticles and modules and provides
cluster-wide data structures for synchronization. This allows Vertigo to spread deployments
out across the cluster and synchronize local and clustered networks that are deployed
within the same Vert.x cluster.

When deploying a network, Vertigo will *automatically detect the current cluster state*.
If the current Vert.x cluster is a Xync-backed cluster, Vertigo networks will be deployed
across the cluster by default. In Vertigo, this is known as the cluster scope.

For more information on Vertigo clustering see [how Vertigo coordinates networks](#how-vertigo-coordinates-networks)

### Configuring cluster scopes
Users can optionally configure the cluster scope for individual Vertigo networks.
To configure the cluster scope for a network simply use the `setScope` method on the
network configuration.

```javascript
var network = vertigo.createNetwork('test');
network.setScope('local');
```

The network scope defaults to `cluster`, but if the current Vert.x cluster is
not a Xync cluster then the network will automatically fall back to `local`.

It's important to note that while configuring the cluster scope on a network will
cause the network to be *deployed* in that scope, the network's scope configuration
*does not impact Vertigo's synchronization*. In other words, even if a network is
deployed locally, if the current Vert.x cluster is a Xync cluster, Vertigo will still
coordinate with other Vert.x instances using Xync. This allows locally deployed networks
to be referenced and reconfigured even outside of the instance in which it was deployed.
For instance, users can deploy one component of the `foo` network locally in one Vert.x
instance and deploy a separate component of the `foo` network locally in another Vert.x
instance and both components will still become a part of the same network event though
the network is `local`.

## Components
Components are "black box" Vert.x verticles that communicate with other components within
the same network through named *input* and *output* ports.

For detailed information on component startup and coordination see
[how Vertigo coordinates networks](#how-vertigo-coordinates-networks)

### Creating a component
Components use the `vertigo/component` module.

```javascript
var component = require('vertigo/component');
```

In Javascript components, it's important that you always register a start handler
by calling the `startHandler` method. Once the component has completed startup
this function will be called.

```javascript
component.startHandler(function(component) {
  // The component has finished startup.
});
```

### The elements of a Vertigo component
Each Java component has several additional fields:
* `cluster` - the Vertigo `Cluster` to which the component belongs
* `input` - the component's `InputCollector`, an interface to input ports
* `output`- the component's `OutputCollector`, an interface to output ports
* `logger` - the component's `PortLogger`, a special logger that logs messages to output ports

## Messaging
The Vertigo messaging API is simply a wrapper around the Vert.x event bus.
Vertigo messages are not sent through any central router. Rather, Vertigo uses
network configurations to create direct event bus connections between components.
Vertigo components send and receive messages using only output and input *ports*
and are hidden from event bus address details which are defined in network configurations.
This is the element that makes Vertigo components reusable.

Vertigo messages are guaranteed to arrive in order. See [how it works](#how-it-works)
for more information.

Vertigo also provides an API that allows for logical grouping and ordering of messages
known as [groups](#working-with-message-groups). Groups are strongly ordered named
batches of messages that can be nested.

For more information on messaging see [how Vertigo handles messaging](#how-vertigo-handles-messaging)

### Sending messages on an output port
To reference an output port, use the `output.port(String name)` method.

```javascript
var output = require('vertigo/output');

var port = output.port('out');
```

If the referenced output port is not defined in the network configuration, the
port will be lazily created, though it will not actually reference any connections.

Any message that can be sent on the Vert.x event bus can be sent on the output port.
To send a message on the event bus, simply call the `send` method.

```javascript
output.port('out').send("Hello world!");
```

Internally, Vertigo will route the message to any connections as defined in the
network configuration.

Output ports also support custom message serialization.
See [providing serializeable messages](#providing-serializeable-messages)

### Receiving messages on an input port
Input ports are referenced in the same was as output ports.

```javascript
var input = require('vertigo/input');

var port = input.port('in');
```

To receive messages on an input port, register a message handler on the port.

```javascript
input.port('in').messageHandler(function(message) {
  output.port('out').send(message);
});
```

Note that Vertigo messages arrive in plain format and not in any sort of `Message`
wrapper. This is because Vertigo messages are inherently uni-directional, and message
acking is handled internally.

### Working with message groups
The base Vertigo messaging system does not guarantee ordering of messages.
But Vertigo does provide a mechanism for logically grouping and ordering
messages known as *groups*. Groups are named logical collections of messages.
Groups can be nested and groups of the same name are guaranteed to be delivered
in order. Before any given group can start, each of the groups of the same name
at the same level that preceeded it must have been received by the target.
Additionally, messages within a group are guaranteed to be delivered to the
same instance of each target component. In other words, routing is performed
per-group rather than per-message.

When a new output group is created, Vertigo will await the completion of all groups
that were created prior to the new group before sending the new group's messages.

```javascript
output.port('out').group('foo', function(group) {
  group.send('foo').send('bar').send('baz').end();
});
```

Note that the group's `end()` method *must* be called in order to indicate completion of
the group. Groups are fully asynchronous, meaning they support asynchronous calls to other
APIs, and this step is crucial to that functionality.

```javascript
output.port('out').group('foo', function(group) {
  someAsyncApi(function(result) {
    group.send(result).end();
  });
});
```

The `OutputGroup` API exposes the same methods as the `OutputPort`. That means that groups
can be nested and Vertigo will still guarantee ordering across groups.

```javascript
output.port('out').group('foo', function(group) {
  group.group('bar', function(group) {
    group.send(1).send(2).send(3).end();
  });
  group.group('baz', function(group) {
    group.send(1).send(2).send(3).end();
  });
  group.end();
});
```

As with receiving messages, to receive message groups register a handler on an
input port using the `groupHandler` method, passing a group name as the first
argument.

```javascript
input.port('in').groupHandler('foo', function(group) {
  group.messageHandler(function(message) {
    output.port('out').send(message);
  });
});
```

The `InputGroup` API also supports a `startHandler` and `endHandler`. The `endHandler`
can be particularly useful for aggregations. Vertigo guarantees that if a group's
`endHandler` is called then *all* of the messages sent for that group were received
by that group.

```javascript
input.port('in').groupHandler('foo', function(group) {
  var messages = [];

  group.messageHandler(function(message) {
    messages.push(message);
  });

  group.endHandler(function() {
    console.log('Received ' + messages.length + ' messages in group.');
  });
});
```

As with output groups, input groups can be nested, representing the same structure
sent by an output group.

```javascript
input.port('in').groupHandler('foo', function(group) {

  input.port('in').groupHandler('bar', function(group) {
    group.messageHandler(function(message) {
      output.port('out').send(message);
    });
  });

  input.port('in').groupHandler('baz', function(group) {
    group.messageHandler(function(message) {
      output.port('out').send(message);
    });
  });

});
```

## Logging
Ecah Vertigo component contains a special `PortLogger` which logs messages
to component output ports in addition to standard Vert.x log files. This allows
other components to listen for log messages on input ports.

The `PortLogger` logs to ports named for each logger method:
* `fatal`
* `error`
* `warn`
* `info`
* `debug`
* `trace`

### Logging messages to output ports
The `PortLogger` simple implements the standard Vert.x `Logger` interface.
So, to log a message to an output port simply call the appropriate log method:

```javascript
var logger = require('vertigo/logger');
logger.info('Component started successfully!');
```

### Reading log messages
To listen for log messages from a component, simply add a connection to a network
configuration listening on the necessary output port. For instance, you could
aggregate and count log messages from one component by connecting each log port to
a single input port on another component.

```javascript
var network = vertigo.createNetwork("log-test");
network.addVerticle("logger", "logger.js", 2);
network.addVerticle("log-reader", "log_reader.js", 2);
network.createConnection("logger", "fatal", "log-reader", "log").hashSelect();
network.createConnection("logger", "error", "log-reader", "log").hashSelect();
network.createConnection("logger", "warn", "log-reader", "log").hashSelect();
network.createConnection("logger", "info", "log-reader", "log").hashSelect();
network.createConnection("logger", "debug", "log-reader", "log").hashSelect();
network.createConnection("logger", "trace", "log-reader", "log").hashSelect();
```

With a hash selector on each connection, we guarantee that the same log message
will always go to the same `log-reader` instance.

Log messages will arrive as simple strings:

```javascript
var component = require('vertigo/component');
var input = require('vertigo/input');
var output = require('vertigo/output');

component.startHandler(function() {
  input.port('log').messageHandler(function(message) {
    console.log(message);
  });
});
```

## How it works
This section is a more in-depth examination of how Vertigo deploys and manages
networks and the communication between them. It is written with the intention
of assisting users in making practical decisions when working with Vertigo.

### How Vertigo handles messaging
All Vertigo messaging is done over the Vert.x event bus. Vertigo messaging is
designed to provide guaranteed ordering and exactly-once processing semantics.
Internally, Vertigo uses *streams* to model connections between an output port
on one set of component instances and an input port on another set of component
instances. Each output port can contain any number of output streams, and each
output stream can contain any number of output connections (equal to the number
of instances of the target component). Connections represent a single event bus
address connection between two instances of two components on a single Vertigo
connection. Connection selectors are used at the stream level to select a set
of connections to which to send each message for the stream.

(See `net.kuujo.vertigo.io`)

Vertigo ensures exactly-once semantics by batching messages for each connection.
Each message that is sent on a single output connection will be tagged with a
monotonically increasing ID for that connection. The input connection that receives
messages from the specific output connection will keep track of the last seen
monitonically increasing ID for the connection. When a new message is received,
the input connection checks to ensure that it is the next message in the sequence
according to its ID. If a message is received out of order, the input connection
immediately sends a message to the output connection indicating the last sequential
ID that it received. The output connection will then begin resending messages from
that point. Even if a message is not received out of order, input connections will
periodically send a message to their corresponding output connection notifying it
of the last message received. This essentially acts as a *ack* for a batch of
messages and allows the output connection to clear its output queue.

In the future, this batching algorithm will be the basis for state persistence.
By coordinating batches between multiple input connections, components can
checkpoint their state after each batch and notify data sources that it's safe
to clear persisted messages.

### How Vertigo performs deployments
Vertigo provides two mechanisms for deployment - local and cluster. The *local*
deployment method simply uses the Vert.x `Container` for deployments. However, Vertigo's
internal deployment API is designed in such a way that each deployment is *assigned*
a unique ID rather than using Vert.x's internal deployment IDs. This allows Vertigo
to reference and evealuate deployments after failures. In the case of local deployments,
deployment information is stored in Vert.x's `SharedData` structures.

Vertigo also supports clustered deployments using Xync. Xync exposes user-defined
deployment IDs in its own API.

(See `net.kuujo.vertigo.cluster.Cluster` and `net.kuujo.vertigo.cluster.ClusterManager`)

When Vertigo begins deploying a network, it first determines the current cluster scope.
If the current Vert.x instance is a member of a Xync-based Vert.x cluster, Vertigo will
attempt to deploy the network across the cluster. This behavior can be configured in the
network configuration.

Once the cluster scope has been determined, Vertigo will check the cluster (e.g. `SharedData`
or Xync) to determine whether the network is already deployed. If the network has not
been deployed (a deployment with the ID of the netowrk name is not deployed) then
Vertigo simply deploys a new `NetworkManager` verticle to manage the network. Actual
component deployments are performed within the network manager through the coordination
system. For more information on the network manager and coordination see
[how vertigo coordinates networks](#how-vertigo-coordinates-networks).

### How Vertigo coordinates networks
Vertigo uses a very unique and flexible system for coordinating network deployment,
startup, and configuration. The Vertigo coordination system is built on a distributed
observer implementation. Vertigo will always use the highest cluster scope available
for coordination. That is, if the current Vert.x cluster is a Xync cluster then Vertigo
will use the Xync cluster for coordination. This ensures that Vertigo can coordinate
all networks within a cluster, even if they are deployed as local networks.

The distributed observer pattern is implemented as map events for both Vert.x `SharedData`
and Xync's Hazelcast-based maps. Events for any given key in a Vertigo cluster can be
watched by simply registering an event bus address to which to send events. The Vertigo
`NetworkManager` and components both use this mechanism for coordination with one another.

(See `net.kuujo.vertigo.data.WatchableAsyncMap`)

The `NetworkManager` is a special verticle that is tasked with starting, configuring,
and stopping a single network and its components. When a network is deployed, Vertigo
simply deploys a network manager and sets the network configuration in the cluster. The
network manager completes the rest of the process.

When the network manager first starts up, it registers to receive events for the
network's configuration key in the cluster. Once the key has been set, the manager will
be notified of the configuration change through the event system, load the network
configuration, and deploy the necessary components.

(See `net.kuujo.vertigo.network.manager.NetworkManager`)

This is the mechanism that makes live network configurations possible in Vertigo.
Since the network manager already receives notifications of configuration changes for
the network, all we need to do is set the network's configuration key to a new configuration
and the network will be automatically notified and updated asynchronously.

But deployment is only one part of the equation. Often times network reconfigurations
may consist only of new connections between components. For this reason, each Vertigo
component also watches its own configuration key in the cluster. When the network
configuration changes, the network manager will update each component's key in the
cluster, causing running components to be notified of their new configurations.
Whenever such a configuration is detected by a component, the component will automatically
update its internal input and output connections asynchronously.

(See `net.kuujo.vertigo.component.ComponentCoordinator`)

Finally, cluster keys are used to coordinate startup, pausing, resuming, and shutdown
of all components within a network. When a component is deployed and completes setting
up its input and output connections, it will set a special status key in the cluster.
The network manager watches status keys for each component in the network. Once the
status keys have been set for all components in the cluster, the network will be
considered ready to start. The network manager will then set a special network-wide
status key which each component in turn watches. Once the components see the network
status key has been set they will finish startup and call the `start()` method.

During configuration changes, the network manager will unset the network-wide status
key, causing components to optionally pause during the configuration change.

It's important to note that each of these updates is essentially atomic. The network
manager, components, and connections each use internal queues to enqueue and process
updates atomically in the order in which they occur. This has practically no impact on
performance since configuration changes should be rare and it ensures that rapid configuration
changes (through an `ActiveNetwork` object for instance) do not cause race conditions.

One of the most important properties of this coordination system is that it is completely
fault-tolerant. Since configurations are stored in the cluster, even if a component fails
it can reload its last existing configuration from the cluster once failover occurs.
If the network manager fails, the rest of the network can continue to run as normal.
Only configuration changes will be unavailable. Once the manager comes back online, it
will fetch the last known configuration for the network and continue normal operation.

**Need support? Check out the [Vertigo Google Group][google-group]**

**[Java API](https://github.com/kuujo/vertigo)**
**[Python API](https://github.com/kuujo/vertigo-python) is under development**

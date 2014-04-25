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
var vertigo = require('vertigo');
var console = require('vertx/console');

var network = vertigo.createNetwork('word-count');
network.addVerticle('word-feeder', 'word_feeder.js', {words: ['apple', 'banana', 'orange']});
network.addVerticle('word-counter', 'word_counter.js', 4);
network.createConnection('word-feeder', 'out', 'word-counter', 'in').hashSelect();

vertigo.deployNetwork(network, function(error, network) {
  if (error) {
    console.log(error.getMessage());
  }
});

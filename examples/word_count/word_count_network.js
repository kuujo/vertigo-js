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

var network = vertigo.createNetwork('word_count');

network.addFeeder('word_feeder', 'word_count_feeder.js', {'words': ['apple', 'banana', 'orange']});
network.addWorker('word_counter', 'word_count_worker.js').addInput('word_feeder');

vertigo.deployLocalNetwork(network, function(error, context) {
  if (error) {
    console.log(error.getMessage());
  }
});

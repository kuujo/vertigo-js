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
var test = require('testtools');

vertigo.worker.messageHandler(function(message) {
  test.assertEquals('string', typeof(message.id));
  test.assertEquals('object', typeof(message.body));
  test.assertEquals('string', typeof(message.stream));
  test.assertEquals('boolean', typeof(message.hasParent()));
  if (message.hasParent()) {
    test.assertEquals('string', typeof(message.parent));
  }
  else {
    test.assertNull(message.parent);
  }
  test.assertEquals('boolean', typeof(message.hasRoot()));
  if (message.hasRoot()) {
    test.assertEquals('string', typeof(message.root));
  }
  else {
    test.assertNull(message.root);
  }
  test.assertEquals('string', typeof(message.source));

  var config = vertigo.worker.config;
  if (config['validate'] !== undefined) {
    test.assertEquals(config['validate'], message.body);
  }
  vertigo.worker.emit(message.body, message);
  vertigo.worker.ack(message);
});

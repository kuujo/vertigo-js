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

vertigo.executor.startHandler(function(error, executor) {
  test.assertNull(error);
  executor.resultTimeout(15000);
  test.assertEquals(15000, executor.resultTimeout());
  executor.executeQueueMaxSize(500);
  test.assertEquals(500, executor.executeQueueMaxSize());
  test.assertFalse(executor.executeQueueFull());
  executor.autoRetry(true);
  test.assertTrue(executor.autoRetry());
  executor.autoRetryAttempts(3);
  test.assertEquals(3, executor.autoRetryAttempts());
  executor.executeInterval(500);
  test.assertEquals(500, executor.executeInterval());
  executor.executeHandler(function(executor) {});
  executor.drainHandler(function() {});
  executor.execute(executor.config, function(error, result) {
    test.assertNotNull(error);
    test.assertEquals('failure', error.type);
    test.testComplete();
  });
});

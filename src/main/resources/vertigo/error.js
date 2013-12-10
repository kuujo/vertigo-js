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

/**
 * The <code>vertigo/error</code> module provides wrappers for
 * Vertigo errors.
 * @exports vertigo/error
 */
var error = {};

error.FAILURE = 'failure';

/**
 * A failure exception.
 * @constructor
 */
error.FailureError = function(exception) {
  this.exception = exception;
  this.type = error.FAILURE;

  this.toString = function() {
    return exception.getMessage();
  }
}

error.TIMEOUT = 'timeout';

/**
 * A timeout exception.
 * @constructor
 */
error.TimeoutError = function(exception) {
  this.exception = exception;
  this.type = error.TIMEOUT;

  this.toString = function() {
    return exception.getMessage();
  }
}

error.UNKNOWN = 'unknown';

error.VertigoError = function(exception) {
  this.exception = exception;
  this.type = error.UNKNOWN;

  this.toString = function() {
    return exception.getMessage();
  }
}

/**
 * Creates a Vertigo error.
 */
error.createError = function(exception) {
  if (exception == undefined || exception == null) {
    return null;
  }
  if (exception instanceof net.kuujo.vertigo.runtime.FailureException) {
    return new error.FailureError(exception);
  }
  else if (exception instanceof net.kuujo.vertigo.runtime.TimeoutException) {
    return new error.TimeoutError(exception);
  }
  return exception;
}

module.exports = error;

/* global describe, it, xit */
/* jslint node: true, esnext: true */

"use strict";

const chai = require('chai'),
  assert = chai.assert,
  expect = chai.expect,
  should = chai.should(),
  llm = require('loglevel-mixin'),
  MessageHandler = require('../index').MessageHandler,
  connectorMixin = require('kronos-interceptor').ConnectorMixin;


const stepMock = {
  "name": "dummy step name",
  "type": "dummy step type"
};
llm.defineLogLevelProperties(stepMock, llm.defaultLogLevels, llm.defaultLogLevels);

class _DummyInterceptor {}
class MockReceiveInterceptor extends connectorMixin(_DummyInterceptor) {

  constructor(validateFunction, done) {
    super();

    const props = {
      validateFunction: {
        value: validateFunction
      },
      done: {
        value: done
      }
    };

    Object.defineProperties(this, props);
  }

  receive(request, oldRequest) {
    // This is a dummy implementation. Must be overwritten by the derived object.
    this.validateFunction(request, oldRequest);
    this.done();
  }
}



describe('Message Handler', function () {

  it('Create', function () {
    const endpoint = {
      "step": stepMock
    };
    const messageHandler = new MessageHandler(endpoint);
    assert.ok(messageHandler);
  });

  it('Send message', function (done) {
    const endpoint = {
      "step": stepMock
    };

    const sendMessage = {
      "info": "first message"
    };

    const messageHandler = new MessageHandler(endpoint);
    const mockReceive = new MockReceiveInterceptor(function (request, oldRequest) {

      assert.ok(request);
      assert.equal(request.hops.length, 1);
      assert.ok(request.hops[0].host);
      assert.ok(request.hops[0].id);
      assert.ok(request.hops[0].time);

      delete(request.hops[0].host);
      delete(request.hops[0].id);
      delete(request.hops[0].time);

      assert.deepEqual(request, {
        "hops": [{
          "stepName": "dummy step name",
          "stepType": "dummy step type"
        }],
        "info": "first message",
        "payload": {}
      });
    }, done);

    messageHandler.connected = mockReceive;

    messageHandler.receive(sendMessage);

    assert.ok(messageHandler);
  });
});

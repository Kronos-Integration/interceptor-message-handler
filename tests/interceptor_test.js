/* global describe, it, xit */
/* jslint node: true, esnext: true */

"use strict";

const chai = require('chai'),
  assert = chai.assert,
  expect = chai.expect,
  should = chai.should(),
  llm = require('loglevel-mixin'),
  MessageHandler = require('../index').MessageHandler,
  MockReceiveInterceptor = require('kronos-test-interceptor').MockReceiveInterceptor,
  connectorMixin = require('kronos-interceptor').ConnectorMixin;


const stepMock = {
  "name": "dummy step name",
  "type": "dummy step type"
};
llm.defineLogLevelProperties(stepMock, llm.defaultLogLevels, llm.defaultLogLevels);


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
          "endpoint": undefined,
          "stepName": "dummy step name",
          "stepType": "dummy step type"
        }],
        "info": "first message",
        "payload": {}
      });
      done();
    });

    messageHandler.connected = mockReceive;

    messageHandler.receive(sendMessage);

  });

  it('Send message: Simulate multi hops', function (done) {
    const endpoint = {
      "step": stepMock
    };

    const sendMessage = {
      "info": "first message"
    };

    const messageHandler1 = new MessageHandler(endpoint);
    const messageHandler2 = new MessageHandler(endpoint);
    const messageHandler3 = new MessageHandler(endpoint);

    const mockReceive = new MockReceiveInterceptor(function (request, oldRequest) {

      assert.ok(request);
      assert.equal(request.hops.length, 3);
      assert.ok(request.hops[0].host);
      assert.ok(request.hops[0].id);
      assert.ok(request.hops[0].time);

      for (let i = 0; i < 3; i++) {
        delete(request.hops[i].host);
        delete(request.hops[i].id);
        delete(request.hops[i].time);
      }

      assert.deepEqual(request, {
        "hops": [{
          "endpoint": undefined,
          "stepName": "dummy step name",
          "stepType": "dummy step type"
        }, {
          "endpoint": undefined,
          "stepName": "dummy step name",
          "stepType": "dummy step type"
        }, {
          "endpoint": undefined,
          "stepName": "dummy step name",
          "stepType": "dummy step type"
        }],
        "info": "first message",
        "payload": {}
      });
      done();
    });

    messageHandler1.connected = messageHandler2;
    messageHandler2.connected = messageHandler3;
    messageHandler3.connected = mockReceive;

    messageHandler1.receive(sendMessage);
  });


});

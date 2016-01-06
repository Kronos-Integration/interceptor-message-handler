/* jslint node: true, esnext: true */

"use strict";

const Interceptor = require('kronos-interceptor').Interceptor;
const messageHandler = require('kronos-message');

/**
 * This interceptor cares about the handling of the messages.
 * It will add the hops and copies the messages
 */
class MessageHandlerInterceptor extends Interceptor {
	static get type() {
		return "message-handler";
	}

	get type() {
		return "message-handler";
	}


	receive(request, oldRequest) {
		const newRequest = messageHandler.createMessage(request, oldRequest);
		messageHandler.addHop(newRequest, this.endpoint.step.name, this.endpoint.step.type);

		return this.connected.receive(newRequest, oldRequest);
	}
}

exports.MessageHandler = MessageHandlerInterceptor;

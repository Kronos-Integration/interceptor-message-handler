/* jslint node: true, esnext: true */
'use strict';

import { 
	Interceptor
}
from 'kronos-interceptor';

const messageHandler = require('kronos-message');

/**
 * This interceptor cares about the handling of the messages.
 * It will add the hops and copies the messages
 */
export default class MessageHandlerInterceptor extends Interceptor {
	static get name() {
		return 'message-handler';
	}

	receive(request, oldRequest) {
		const newRequest = messageHandler.createMessage(request, oldRequest);
		messageHandler.addHop(newRequest, this.endpoint.owner.name, this.endpoint.owner.type, this.endpoint.name);

		return this.connected.receive(newRequest, oldRequest);
	}
}

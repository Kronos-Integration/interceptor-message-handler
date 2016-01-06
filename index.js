/* jslint node: true, esnext: true */
"use strict";

const MessageHandler = require('./lib/messageHandler').MessageHandler;

exports.MessageHandler = MessageHandler;

exports.registerWithManager = function (manager) {
	manager.registerInterceptor(MessageHandler);
};

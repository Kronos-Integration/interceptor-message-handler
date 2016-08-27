/* jslint node: true, esnext: true */
'use strict';

const MessageHandler = require('./lib/messageHandler').MessageHandler;

exports.MessageHandler = MessageHandler;

exports.registerWithManager = manager => manager.registerInterceptor(MessageHandler);

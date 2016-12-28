/* jslint node: true, esnext: true */
'use strict';

import MessageHandlerInterceptor from './MessageHandlerInterceptor';

function registerWithManager(manager) {
  return manager.registerInterceptor(MessageHandlerInterceptor);
}

export {
  registerWithManager,
  MessageHandlerInterceptor
};

/**
 * SubscriptionManager
 * manages subscriptions of the stores by keeping track of listeners.
 *
 * Implements methods to handle operations on listeners.
 */

import isEqual from 'lodash/isEqual';

export default class SubscriptionManager {
  constructor() {
    this.listeners = [];
  }

  publish(currentState, previousState) {
    this.listeners.forEach((listener) => {
      if (!isEqual(currentState, previousState)) {
        listener(currentState, previousState);
      }
    });
  }

  subscribe(listenerCallback) {
    this.listeners = [...this.listeners, listenerCallback];
    return true;
  }

  unsubscribe(listenerCallback) {
    const listenerIndex = this.listeners.findIndex(listener => listener === listenerCallback);
    if (listenerIndex > -1) {
      this.listeners.splice(listenerIndex, 1);
    }
  }
}

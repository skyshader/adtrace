/**
 * MetricStore
 * is a state class that inherits SubscriptionManager.
 *
 * It keeps the up-to-date state,
 * and publishes updates to all the subscribers of the store.
 */

import cloneDeep from 'lodash/cloneDeep';
import SubscriptionManager from "../base/SubscriptionManager";

export default class MetricStore extends SubscriptionManager {
  constructor(
    initialState = {
      visible: false,
      viewTime: 0,
      visiblePercentage: 0,
      clicks: 0
    }) {

    super();
    this.internalState = cloneDeep(initialState);
  }

  get state() {
    return cloneDeep(this.internalState);
  }

  setState(state) {
    const previousState = cloneDeep(this.internalState);
    const currentState = Object.assign(cloneDeep(previousState), cloneDeep(state));
    this.internalState = currentState;
    super.publish(currentState, previousState);
    return currentState;
  }
}

import SubscriptionManager from '../../base/SubscriptionManager';
import MetricStore from '../MetricStore';

jest.mock('../../base/SubscriptionManager');

describe('testing MetricStore', () => {

  beforeEach(() => {
    SubscriptionManager.mockClear();
  });

  test('MetricStore initializes with defaults', () => {
    const store = new MetricStore();
    expect(store.state).toEqual({
      visible: false,
      viewTime: 0,
      visiblePercentage: 0,
      clicks: 0
    });
  });

  test('setState updates state properly and publishes', () => {
    const store = new MetricStore();
    const previousState = store.state;

    const currentState = store.setState({
      ...store.state,
      ...{ visible: true }
    });

    expect(store.state).toEqual(currentState);
    expect(SubscriptionManager.prototype.publish)
      .toHaveBeenCalledWith(currentState, previousState);
  });
});

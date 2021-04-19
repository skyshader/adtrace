import SubscriptionManager from '../SubscriptionManager';

describe('testing SubscriptionManager', () => {
  test('subscribe registers a listener', () => {
    const callback = jest.fn();
    const manager = new SubscriptionManager();
    manager.subscribe(callback);
    expect(manager.listeners.length).toBe(1);
  });

  test('unsubscribe removes a listener', () => {
    const callback = jest.fn();
    const manager = new SubscriptionManager();
    manager.subscribe(callback);
    expect(manager.listeners.length).toBe(1);
    manager.unsubscribe(callback);
    expect(manager.listeners.length).toBe(0);
  });

  test('publish values to all listeners', () => {
    const callback = jest.fn();
    const manager = new SubscriptionManager();
    manager.subscribe(callback);
    manager.subscribe(callback);
    manager.subscribe(callback);

    manager.publish({ x: 1 }, { x: 0 });
    expect(callback).toHaveBeenCalledTimes(3);
  });

  test('unsubscribe removes only one listener from list of same listeners', () => {
    const callback = jest.fn();
    const manager = new SubscriptionManager();
    manager.subscribe(callback);
    manager.subscribe(callback);
    manager.subscribe(callback);

    expect(manager.listeners.length).toBe(3);
    manager.unsubscribe(callback);
    expect(manager.listeners.length).toBe(2);
  });
});

import IntersectionTracker from "../IntersectionTracker";

describe('testing IntersectionTracker', () => {
  test('IntersectionTracker is initialized with defaults', () => {
    global.IntersectionObserver = jest.fn(() => {});
    const tracker = new IntersectionTracker({
      element: 'element'
    });

    expect(tracker.element).toBe('element');
    expect(tracker.options.root).toBe(null);
    expect(tracker.options.rootMargin).toBe('0px');
    expect(tracker.threshold).toEqual({'cutoff': 1.0, 'steps': 100});
    expect(tracker.intersectionObserver).toBeDefined();
  });

  test('buildThresholdList builds thresholds based on steps', () => {
    global.IntersectionObserver = jest.fn(() => {});
    const tracker = new IntersectionTracker({
      element: 'element',
      options: {
        threshold: {
          steps: 10
        }
      }
    });

    const thresholdList = tracker.buildThresholdList();
    expect(thresholdList.length).toBe(11);
  });

  test('calling track registers an observer', () => {
    const intersectionObserverMock = {
      observe: jest.fn()
    };
    global.IntersectionObserver = jest.fn(() => intersectionObserverMock);

    const tracker = new IntersectionTracker({
      element: 'element'
    });

    tracker.track();

    expect(intersectionObserverMock.observe).toBeCalledWith("element");
  });

  test('determines visibility when ratio < cutoff and dispatches event', () => {
    let intersectionCb = null;
    const intersectionObserverMock = {
      observe: jest.fn(() => {
        intersectionCb([{
          intersectionRatio: 0.1,
          isIntersecting: true
        }])
      })
    };
    global.IntersectionObserver = jest.fn((cb, opts) => {
      intersectionCb = cb;
      return intersectionObserverMock;
    });
    global.CustomEvent = jest.fn();

    const elementMock = {
      dispatchEvent: jest.fn()
    };

    const tracker = new IntersectionTracker({
      element: elementMock
    });

    tracker.track();

    expect(elementMock.dispatchEvent).toHaveBeenCalledWith(expect.any(CustomEvent));
    expect(CustomEvent).toHaveBeenCalledWith('onvisiblepercentagechange', {
      detail: {
        isVisible: false,
        percentage: 10
      }
    });
  });

  test('determines visibility when ratio >= cutoff and dispatches event', () => {
    let intersectionCb = null;
    const intersectionObserverMock = {
      observe: jest.fn(() => {
        intersectionCb([{
          intersectionRatio: 1.0,
          isIntersecting: true
        }])
      })
    };

    global.IntersectionObserver = jest.fn((cb) => {
      intersectionCb = cb;
      return intersectionObserverMock;
    });

    global.CustomEvent = jest.fn();

    const elementMock = {
      dispatchEvent: jest.fn()
    };

    const tracker = new IntersectionTracker({
      element: elementMock
    });

    tracker.track();

    expect(elementMock.dispatchEvent).toHaveBeenCalledWith(expect.any(CustomEvent));
    expect(CustomEvent).toHaveBeenCalledWith('onvisiblepercentagechange', {
      detail: {
        isVisible: true,
        percentage: 100
      }
    });
  });
});

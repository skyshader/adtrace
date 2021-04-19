import ClickMetricsTracker from "../ClickMetricsTracker";

describe('testing ClickMetricsTracker', () => {
  test('click event listener is registered on element', () => {
    const elementMock = { addEventListener: jest.fn() };

    const tracker = new ClickMetricsTracker(elementMock, {});
    tracker.track();

    expect(elementMock.addEventListener).toBeCalledWith('click', expect.any(Function), false);
  });

  test('click handler is called on click of element', () => {
    let events = {};
    const elementMock = {
      addEventListener: jest.fn((event, callback) => {
        events[event] = callback;
      })
    };

    const callback = jest.fn();

    const tracker = new ClickMetricsTracker(elementMock, {});
    tracker.onClick = callback;
    tracker.track();

    events.click();
    expect(callback).toBeCalledTimes(1);
  });

  test('click handler increments clicks', () => {
    const storeMock = {
      state: {
        clicks: 0
      },
      setState: jest.fn()
    };

    const tracker = new ClickMetricsTracker({}, storeMock);
    tracker.onClick();
    expect(storeMock.setState).toHaveBeenCalledWith({clicks: 1});
  })
});

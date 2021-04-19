import Timer from "../Timer";
import IntersectionTracker from "../IntersectionTracker";
import ViewMetricsTracker from "../ViewMetricsTracker";

jest.mock('../Timer');
jest.mock('../IntersectionTracker');

describe('testing ViewMetricsTracker', () => {
  beforeEach(() => {
    Timer.mockClear();
    IntersectionTracker.mockClear();
  });

  test('ViewMetricsTracker initializes with defaults', () => {
    Object.defineProperty(document, 'hidden', { value: false });
    global.document.hasFocus = jest.fn(() => true);
    const tracker = new ViewMetricsTracker('element', {});
    expect(tracker.element).toBe('element');
    expect(tracker.store).toEqual({});
    expect(tracker.visibility).toEqual({document: true, advertisement: false});
    expect(tracker.timer).toBeDefined();
    expect(tracker.intersectionTracker).toBeDefined();
  });

  test('Track registers required trackers and listeners', () => {
    Object.defineProperty(document, 'hidden', { value: false });
    global.document.hasFocus = jest.fn(() => true);
    const windowSpy = jest.spyOn(window, 'addEventListener');
    const documentSpy = jest.spyOn(document, 'addEventListener');
    const elementMock = { addEventListener: jest.fn() };
    const tracker = new ViewMetricsTracker(elementMock, {});

    tracker.track();

    expect(tracker.intersectionTracker.track).toBeCalled();
    expect(tracker.timer.track).toBeCalled();
    expect(windowSpy).toHaveBeenCalledWith('blur', expect.any(Function), false);
    expect(windowSpy).toHaveBeenCalledWith('focus', expect.any(Function), false);
    expect(documentSpy).toHaveBeenCalledWith('visibilitychange', expect.any(Function), false);
    expect(elementMock.addEventListener).toHaveBeenCalledWith('onvisiblepercentagechange', expect.any(Function), false);
  });

  test('Listeners are invoked when tracked events are triggered', () => {
    let events = {};
    const elementMock = {
      addEventListener: jest.fn((event, callback) => {
        events[event] = callback;
      })
    };
    jest.spyOn(window, 'addEventListener')
      .mockImplementation((event, callback) => {
        events[event] = callback;
      });
    jest.spyOn(document, 'addEventListener')
      .mockImplementation((event, callback) => {
        events[event] = callback;
      });

    const onVisibilityChangeMock = jest.fn();
    const onVisibilityPercentageChangeMock = jest.fn();

    const tracker = new ViewMetricsTracker(elementMock, {});
    tracker.onVisibilityChange = onVisibilityChangeMock;
    tracker.onVisibilityPercentageChange = onVisibilityPercentageChangeMock;
    tracker.track();

    events.blur();
    events.focus();
    events.visibilitychange();
    events.onvisiblepercentagechange();

    expect(onVisibilityChangeMock).toBeCalledTimes(3);
    expect(onVisibilityPercentageChangeMock).toBeCalledTimes(1);
  });

  test('onVisibilityChange calls updateVisibility with right values', () => {
    Object.defineProperty(document, 'hidden', { value: false });
    global.document.hasFocus = jest.fn(() => true);
    const updateVisibilityMock = jest.fn();

    const tracker = new ViewMetricsTracker('element', {});
    tracker.updateVisibility = updateVisibilityMock;
    tracker.onVisibilityChange();

    expect(updateVisibilityMock).toHaveBeenCalledWith({ document: true } );
  });

  test('onVisibilityPercentageChange updates visible percentage and calls updateVisibility', () => {
    Object.defineProperty(document, 'hidden', { value: false });
    global.document.hasFocus = jest.fn(() => true);
    const updateVisibilityMock = jest.fn();

    const storeMock = {
      state: {
        visiblePercentage: 0
      },
      setState: jest.fn()
    };

    const tracker = new ViewMetricsTracker('element', storeMock);
    tracker.updateVisibility = updateVisibilityMock;
    tracker.onVisibilityPercentageChange({ detail: { percentage: 80, isVisible: false } });

    expect(storeMock.setState).toHaveBeenCalledWith({ visiblePercentage: 80 });
    expect(updateVisibilityMock).toHaveBeenCalledWith({ advertisement: false } );
  });

  test('updateVisibility updates state and starts timer when ad is visible', () => {
    Object.defineProperty(document, 'hidden', { value: false });
    global.document.hasFocus = jest.fn(() => true);

    const storeMock = {
      state: {
        visible: false
      },
      setState: jest.fn()
    };

    const tracker = new ViewMetricsTracker('element', storeMock);
    tracker.updateVisibility({ advertisement: true });

    expect(storeMock.setState).toHaveBeenCalledWith({ visible: true });
    expect(tracker.timer.start).toHaveBeenCalled();
  });

  test('updateVisibility updates state and stops timer when ad is hidden', () => {
    Object.defineProperty(document, 'hidden', { value: false });
    global.document.hasFocus = jest.fn(() => true);

    const storeMock = {
      state: {
        visible: true
      },
      setState: jest.fn()
    };

    const tracker = new ViewMetricsTracker('element', storeMock);
    tracker.updateVisibility({ advertisement: false });

    expect(storeMock.setState).toHaveBeenCalledWith({ visible: false });
    expect(tracker.timer.stop).toHaveBeenCalled();
  });

  test('updateVisibility does nothing if visibility is same as before', () => {
    Object.defineProperty(document, 'hidden', { value: false });
    global.document.hasFocus = jest.fn(() => true);

    const storeMock = {
      state: {
        visible: false
      },
      setState: jest.fn()
    };

    const tracker = new ViewMetricsTracker('element', storeMock);
    tracker.updateVisibility({ advertisement: false });

    expect(storeMock.setState).not.toHaveBeenCalled();
    expect(tracker.timer.start).not.toHaveBeenCalled();
    expect(tracker.timer.stop).not.toHaveBeenCalled();
  });
});

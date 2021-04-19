import ViewMetricsTracker from "../trackers/ViewMetricsTracker";
import ClickMetricsTracker from "../trackers/ClickMetricsTracker";
import MetricsTracker from '../MetricsTracker';
import MetricsType from "../MetricsType";

jest.mock('../trackers/ViewMetricsTracker');
jest.mock('../trackers/ClickMetricsTracker');

describe('testing MetricsTracker', () => {

  beforeEach(() => {
    ViewMetricsTracker.mockClear();
    ClickMetricsTracker.mockClear();
  });

  test('initializes with corresponding metrics tracker', () => {
    const trackers = MetricsTracker.initialize(
      'element',
      'store',
      [MetricsType.CLICK]
    );

    expect(trackers.length).toBe(1);
    expect(trackers[0]).toBeInstanceOf(ClickMetricsTracker);
  });
});

/**
 * MetricsTracker
 * is a factory module,
 * that allows creation of relevant trackers you want to use on the element
 *
 * Supported metrics type: view, click
 */

import MetricsType from "./MetricsType";
import ViewMetricsTracker from "./trackers/ViewMetricsTracker";
import ClickMetricsTracker from "./trackers/ClickMetricsTracker";

export default {
  initialize: (element, store, metricTypes = [MetricsType.VIEW, MetricsType.CLICK]) => {
    return metricTypes.map(metricsType => {
      switch (metricsType) {
        case MetricsType.VIEW:
          return new ViewMetricsTracker(element, store);
        case MetricsType.CLICK:
          return new ClickMetricsTracker(element, store);
        default:
          throw Error('Metrics tracker not available for provided type!')
      }
    });
  }
}

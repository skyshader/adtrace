import MetricStore from "./metrics/MetricStore";
import MetricsLogger from "./metrics/MetricsLogger";
import MetricsTracker from "./metrics/MetricsTracker";

const adElement = document.getElementById("ad");

const store = new MetricStore();
store.subscribe(MetricsLogger.log);

const trackers = MetricsTracker.initialize(adElement, store);
trackers
  .forEach((tracker) =>
    tracker.track()
  );

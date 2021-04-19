/**
 * ViewMetricsTracker
 * registers various trackers to track
 * provided element's visibility.
 *
 * Uses IntersectionObserver, Page Visibility API,
 * window blur and focus events to keep track of element's visibility.
 */

import Timer from "./Timer";
import IntersectionTracker from "./IntersectionTracker";

export default class ViewMetricsTracker {
  constructor(element, store) {
    this.element = element;
    this.store = store;

    this.timer = null;
    this.intersectionTracker = null;

    this.visibility = {
      document: !document.hidden && document.hasFocus(),
      advertisement: false
    };

    this.onVisibilityChange = this.onVisibilityChange.bind(this);
    this.onVisibilityPercentageChange = this.onVisibilityPercentageChange.bind(this);

    this.setup();
  }

  setup() {
    this.timer = new Timer();

    this.intersectionTracker = new IntersectionTracker({
      element: this.element
    });
  }

  updateVisibility(visibility) {
    const previousVisibility = this.store.state.visible;
    this.visibility = { ...this.visibility, ...visibility };
    const currentVisibility = this.visibility.document && this.visibility.advertisement;

    if (previousVisibility === currentVisibility) {
      return;
    }

    this.store.setState({
      ...this.store.state,
      ...{ visible: currentVisibility }
    });

    if (currentVisibility) {
      this.timer.start();
    } else {
      this.timer.stop();
    }
  }

  onVisibilityPercentageChange(e) {
    const { percentage, isVisible } = e.detail;

    this.store.setState({
      ...this.store.state,
      ...{ visiblePercentage: percentage }
    });

    this.updateVisibility({ advertisement: isVisible });
  }

  onVisibilityChange() {
    this.updateVisibility({ document: !document.hidden && document.hasFocus() });
  }

  track() {
    this.timer.track((elapsedTime) => {
      this.store.setState({
        ...this.store.state,
        ...{ viewTime: Math.round(elapsedTime / 1000) }
      });
    });

    this.intersectionTracker.track();

    window.addEventListener("blur", this.onVisibilityChange, false);
    window.addEventListener("focus", this.onVisibilityChange, false);
    document.addEventListener("visibilitychange", this.onVisibilityChange, false);
    this.element.addEventListener('onvisiblepercentagechange', this.onVisibilityPercentageChange, false);
  }
}

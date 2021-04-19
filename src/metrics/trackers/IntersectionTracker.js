/**
 * IntersectionTracker
 * utilizes IntersectionObserver to track the element's
 * intersection with the viewport or specified parent element.
 *
 * The class triggers `onvisiblepercentagechange`
 * based on provided tracking configuration.
 */

export default class IntersectionTracker {
  constructor({
    element,
    options: {
      root = null,
      rootMargin = '0px',
      threshold: {
        steps = 100,
        cutoff = 1.0
      } = {}
    } = {}
  } = {}) {
    this.element = element;
    this.options = { root, rootMargin };
    this.threshold = { steps, cutoff };

    this.intersectionObserver = new IntersectionObserver(
      this.onIntersection.bind(this),
      {
        ...this.options,
        threshold: this.buildThresholdList()
      }
    );
  }

  buildThresholdList() {
    let thresholds = [];

    for (let i = 1.0; i <= this.threshold.steps; i++) {
      let ratio = i / this.threshold.steps;
      thresholds.push(ratio);
    }

    thresholds.push(0);
    return thresholds;
  }

  onIntersection(entries) {
    entries.forEach((entry) => {
      const visiblePercentage = Math.round(entry.intersectionRatio * 100);
      let isVisible = false;

      if (entry.isIntersecting) {
        if (entry.intersectionRatio >= this.threshold.cutoff) {
          isVisible = true;
        }
      } else {
        isVisible = false;
      }

      this.element.dispatchEvent(new CustomEvent('onvisiblepercentagechange', {
        detail: { percentage: visiblePercentage, isVisible }
      }));
    });
  }

  track() {
    this.intersectionObserver.observe(this.element);
  }
}

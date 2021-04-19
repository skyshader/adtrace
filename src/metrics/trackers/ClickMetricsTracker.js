/**
 * ClickMetricsTracker
 * tracks clicks on the element provided
 * and updates the store.
 */

export default class ClickMetricsTracker {
  constructor(element, store) {
    this.element = element;
    this.store = store;

    this.onClick = this.onClick.bind(this);
  }

  onClick() {
    const { clicks } = this.store.state;
    this.store.setState({
      ...this.store.state,
      ...{ clicks: clicks + 1 }
    })
  }

  track() {
    this.element.addEventListener('click', this.onClick, false);
  }
}

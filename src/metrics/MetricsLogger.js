/**
 * MetricsLogger
 * takes the state and logs to the console.
 */

export default {
  log: (state) => {
    console.log(
      "Ad is viewable: ", state.visible,
      "\nViewability time of the ad in sec:", state.viewTime,
      "\nVisible percentage of the ad:", state.visiblePercentage,
      "\nClicks:", state.clicks
    );
  }
}

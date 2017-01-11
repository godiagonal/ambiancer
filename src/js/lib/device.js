import ThrottleEvent from './throttle-event';

export default {
  onOrientationChanged(callback) {
    if (window.DeviceOrientationEvent) {
      ThrottleEvent('deviceorientation', (event) => {
        event.normBeta = (event.beta + 180) / 360;
        event.normGamma = (event.gamma + 90) / 180;
        callback(event);
      }, window, 20);
    } else {
      console.error('Your browser does not support device orientation events.');
    }
  },
};

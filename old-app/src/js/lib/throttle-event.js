import RequestAnimationFrame from './request-animation-frame';

export default function ThrottleEvent(eventName, callback, targetElem = window, maxPerSecond = 0) {
  let running = false;
  
  function fireEvent(data) {
    if (!running) {
      running = true;
      
      if (maxPerSecond === 0) {
        RequestAnimationFrame(() => {
          callback(data);
          running = false;
        });
      } else {
        setTimeout(() => {
          callback(data);
          running = false;
        }, 1000 / maxPerSecond);
      }
    }
  }
  
  targetElem.addEventListener(eventName, fireEvent);
}

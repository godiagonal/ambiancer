import $ from 'jquery';
import Slider from 'bootstrap-slider';

const ambienceSlider = window.sl = new Slider('#ambience-level', {
  tooltip: 'hide',
});

export default {
  onCloseIntro(callback) {
    $('#close-intro').on('click', (event) => {
      callback(event);
    });
  },
  onToggleAutoPlay(callback) {
    $('#toggle-auto-play').on('click', (event) => {
      callback(event);
    });
  },
  onAmbienceLevelChanged(callback) {
    function getValue() {
      let value = ambienceSlider.getValue();
      const min = ambienceSlider.options.min;
      const max = ambienceSlider.options.max;
    
      if (value < min) {
        value = min;
      } else if (value > max) {
        value = max;
      }
    
      return value / max;
    }
    
    ambienceSlider.on('change', () => {
      callback(getValue());
    });
  
    callback(getValue());
  },
};

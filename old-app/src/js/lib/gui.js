import $ from 'jquery';
import Slider from 'bootstrap-slider';

const ambienceSlider = new Slider('#ambience-level', {
  // tooltip: 'hide',
});
const bpmSlider = new Slider('#bpm', {
  // tooltip: 'hide',
});
const octaveRangeSlider = new Slider('#octave-range', {
  // tooltip: 'hide',
});

$('#toggle-controls-more').on('click', () => {
  $('#controls-more').toggleClass('in');
  $('#toggle-controls-more').toggleClass('open');
});

export default {
  onCloseIntro(callback) {
    $('#close-intro').on('click', (event) => {
      callback(event);
    });
  },
  onControlsSizeChanged(callback) {
    $('#toggle-controls-more').on('click', (event) => {
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
  onBpmChanged(callback) {
    bpmSlider.on('change', () => {
      callback(bpmSlider.getValue());
    });
  
    callback(bpmSlider.getValue());
  },
  onScaleOrOctaveRangeChanged(callback) {
    function triggerCallback() {
      const scale = [];
      $('input[name="scale[]"]:checked').each(function () {
        scale.push($(this).val());
      });

      const octaveRange = octaveRangeSlider.getValue();

      callback(scale, octaveRange);
    }

    octaveRangeSlider.on('change', triggerCallback);
    $('input[name="scale[]"]').on('change', triggerCallback);

    triggerCallback();
  },
};

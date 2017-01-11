import $ from 'jquery';
import RequestAnimationFrame from './lib/request-animation-frame';
import Device from './lib/device';
import Canvas from './lib/canvas';
import Gui from './lib/gui';
import Synthesizer from './lib/audio/synthesizer';
import NoteGenerator from './lib/audio/note-generator';
import Distortion from './lib/audio/effects/distortion';
import Reverb from './lib/audio/effects/reverb';
import LowpassFilter from './lib/audio/effects/lowpass-filter';
import Delay from './lib/audio/effects/delay';
import Panner from './lib/audio/effects/panner';

const synth = new Synthesizer(false, 'sawtooth');
const noteGenerator = new NoteGenerator(['G', 'A', 'D', 'E', 'F#'], 3);
const canvas = new Canvas('touch-pad');

const distortion = new Distortion('distortion');
const reverb = new Reverb('reverb');
const reverb2 = new Reverb('reverb2');
const delay = new Delay('delay');
const lowpassFilter = new LowpassFilter('lowpass');
const panner = new Panner('panner');

synth.audioBus.setFxChain([
  distortion,
  delay,
  reverb,
  reverb2,
  lowpassFilter,
  panner,
]);

/*
 Device events
 */
Device.onOrientationChanged((event) => {
  lowpassFilter.node.frequency.value = Math.round(event.normBeta * 2000);
  panner.node.pan.value = event.normGamma * 2 - 1;
});

/*
 Gui events
 */
Gui.onCloseIntro(() => {
  $('#intro').animate({ opacity: 0 }, 500, () => {
    $('#intro').hide();
  });
});

Gui.onToggleAutoPlay(() => {
  synth.toggleAutoPlay(noteGenerator);
  canvas.toggleAnimateBg();
});

Gui.onAmbienceLevelChanged((level) => {
  const lowThreshold = 0.25;
  const mediumThreshold = 0.5;
  const highThreshold = 0.75;
  
  if (level < lowThreshold) {
    const relLevel = level / lowThreshold;
    delay.setFeedback(relLevel * 0.6);
  } else {
    delay.setFeedback(0.6);
  }
  
  if (level < mediumThreshold) {
    const relLevel = level / mediumThreshold;
    reverb.node.wet.value = relLevel;
  } else {
    reverb.node.wet.value = 1;
  }
  
  if (level < highThreshold) {
    const relLevel = level / highThreshold;
    reverb.node.dry.value = 1 - relLevel;
    reverb.node.cutoff.value = (1 - relLevel) * 3000 + 1000;
    reverb.node.time = relLevel * 10;
  } else {
    reverb.node.dry.value = 0;
    reverb.node.cutoff.value = 1000;
    reverb.node.time = 10;
  }
  
  if (level >= mediumThreshold) {
    const relLevel = (level - mediumThreshold) / mediumThreshold;
    reverb2.node.dry.value = 1 - relLevel;
    reverb2.node.wet.value = relLevel;
    reverb2.node.cutoff.value = (1 - relLevel) * 3000 + 1000;
    reverb2.node.time = relLevel * 10;
  } else {
    reverb2.node.dry.value = 1;
    reverb2.node.wet.value = 0;
    reverb2.node.cutoff.value = 4000;
    reverb2.node.time = 0;
  }
});

/*
 Canvas events
 */
canvas.onTouchPosChanged((pos) => {
  if (pos) {
    const relX = pos.x / canvas.elem.width;
    const relY = pos.y / canvas.elem.height;
    const note = noteGenerator.fromXY(relX, relY);
    if (note) {
      synth.playNote(note);
    } else {
      synth.releaseAll();
    }
  } else {
    synth.releaseAll();
  }
});

/*
 Synth events
 */
synth.onToggleAutoPlay((enabled) => {
  if (enabled) {
    $('#toggle-auto-play').addClass('btn-primary');
  } else {
    $('#toggle-auto-play').removeClass('btn-primary');
  }
});

((function drawLoop() {
  RequestAnimationFrame(drawLoop);
  canvas.render();
})());

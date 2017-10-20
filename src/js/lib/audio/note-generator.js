import Note from './note';

export default class NoteGenerator {
  constructor(scale, octaveRange = [1, 2]) {
    if (!scale || !scale.length) {
      console.error('No notes in scale.');
    }

    this.scale = scale;
    this.octaveRange = octaveRange;
  }
  
  random() {
    return this.fromXY(Math.random(), Math.random());
  }
  
  fromXY(x, y) {
    const noteIndex = Math.round(x * (this.scale.length - 1));
  
    let note;
    if (this.scale[noteIndex]) {
      note = this.scale[noteIndex];
    } else {
      return null;
    }
    
    const octaveSpan = this.octaveRange[1] - this.octaveRange[0];
    const octave = Math.round((1 - y) * octaveSpan + this.octaveRange[0]);
    
    return new Note(note, octave);
  }
}

import Note from './note';

export default class NoteGenerator {
  constructor(scale, maxOctaves = 2) {
    this.scale = scale;
    this.maxOctaves = maxOctaves;
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
    
    let relOctave = Math.round((1 - y) * this.maxOctaves);
    
    if (relOctave < 0) {
      relOctave = 0;
    } else if (relOctave > this.maxOctaves) {
      relOctave = this.maxOctaves;
    }
    
    return new Note(note, relOctave);
  }
}

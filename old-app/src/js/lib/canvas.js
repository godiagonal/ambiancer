import Chroma from 'chroma-js';
import ThrottleEvent from './throttle-event';

const pointerColor = '#83AF9B';
const pointerSize = 25;
const defaultTransitionDuration = '0.1s';

const bgColorScales = {
  x: Chroma.bezier([Chroma('#FC9D9A'), Chroma('#F9CDAD')]),
  y: Chroma.bezier([Chroma('#C8C8A9'), Chroma('#83AF9B')]),
};

export default class Canvas {
  constructor(elemId) {
    this.elem = document.getElementById(elemId);
    this.context = this.elem.getContext('2d');
    this.animateBgInterval = 1000;
    
    this.touching = false;
    this.touchPos = { x: 0, y: 0 };
    this.lastTouchPos = this.touchPos;
    
    this.initMouseEvents();
    this.initTouchEvents();
    
    ThrottleEvent('resize', () => {
      this.resize();
    }, window, 2);
    this.resize();
  }
  
  resize() {
    const controlsHeight = document.getElementById('controls').clientHeight;
    const winWidth = document.documentElement.clientWidth || window.innerWidth || 0;
    const winHeight = document.documentElement.clientHeight || window.innerHeight || 0;
    this.elem.width = winWidth;
    this.elem.height = winHeight - controlsHeight;
  }
  
  render() {
    this.context.clearRect(0, 0, this.elem.width, this.elem.height);
    
    if (this.touching) {
      this.context.beginPath();
      this.context.arc(this.touchPos.x, this.touchPos.y, pointerSize, 0, 2 * Math.PI, true);
      this.context.fillStyle = pointerColor;
      this.context.fill();
      
      const relX = this.touchPos.x / this.elem.width;
      const relY = this.touchPos.y / this.elem.height;
      
      this.renderBg(relX, relY);
    }
  }
  
  renderBg(relX, relY) {
    const color = Chroma.mix(
      bgColorScales.x(relX),
      bgColorScales.y(relY),
    );
    
    document.body.style.background = color.hex();
  }
  
  toggleAnimateBg() {
    if (this.animateBgTimeout) {
      document.body.style.transitionDuration = defaultTransitionDuration;
      clearInterval(this.animateBgTimeout);
      this.animateBgTimeout = null;
    } else {
      document.body.style.transitionDuration = `${this.animateBgInterval / 1000}s`;
      this.animateBgTimeout = setInterval(() => {
        this.renderBg(Math.random(), Math.random());
      }, this.animateBgInterval);
    }
  }
  
  initMouseEvents() {
    this.elem.addEventListener('mousedown', (e) => {
      this.touching = true;
      this.touchPos = this.lastTouchPos = Canvas.getMousePos(this.elem, e);
      
      if (this.handleTouchPosChanged) {
        this.handleTouchPosChanged(this.touchPos);
      }
    }, false);
    
    this.elem.addEventListener('mouseup', () => {
      this.touching = false;
      
      if (this.handleTouchPosChanged) {
        this.handleTouchPosChanged(null);
      }
    }, false);
    
    this.elem.addEventListener('mousemove', (e) => {
      this.touchPos = Canvas.getMousePos(this.elem, e);
      
      if (this.handleTouchPosChanged && this.touching) {
        this.handleTouchPosChanged(this.touchPos);
      }
    }, false);
  }
  
  initTouchEvents() {
    const canvas = this.elem;
    
    this.elem.addEventListener('touchstart', (e) => {
      this.touchPos = Canvas.getTouchPos(this.elem, e);
      const mouseEvent = new MouseEvent('mousedown', {
        clientX: e.touches[0].clientX,
        clientY: e.touches[0].clientY,
      });
      canvas.dispatchEvent(mouseEvent);
    }, false);
    
    this.elem.addEventListener('touchend', () => {
      const mouseEvent = new MouseEvent('mouseup', {});
      canvas.dispatchEvent(mouseEvent);
    }, false);
    
    this.elem.addEventListener('touchmove', (e) => {
      const mouseEvent = new MouseEvent('mousemove', {
        clientX: e.touches[0].clientX,
        clientY: e.touches[0].clientY,
      });
      canvas.dispatchEvent(mouseEvent);
    }, false);
    
    // Prevent scrolling when touching the canvas
    document.body.addEventListener('touchstart', (e) => {
      if (e.target === this.elem) {
        e.preventDefault();
      }
    }, false);
    
    document.body.addEventListener('touchend', (e) => {
      if (e.target === this.elem) {
        e.preventDefault();
      }
    }, false);
    
    document.body.addEventListener('touchmove', (e) => {
      if (e.target === this.elem) {
        e.preventDefault();
      }
    }, false);
  }
  
  static getMousePos(canvasDom, mouseEvent) {
    const rect = canvasDom.getBoundingClientRect();
    return {
      x: mouseEvent.clientX - rect.left,
      y: mouseEvent.clientY - rect.top,
    };
  }
  
  static getTouchPos(canvasDom, touchEvent) {
    const rect = canvasDom.getBoundingClientRect();
    return {
      x: touchEvent.touches[0].clientX - rect.left,
      y: touchEvent.touches[0].clientY - rect.top,
    };
  }
  
  onTouchPosChanged(callback) {
    this.handleTouchPosChanged = callback;
  }
}

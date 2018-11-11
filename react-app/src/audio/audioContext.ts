const AudioCtx = (window as any).AudioContext || (window as any).webkitAudioContext;

export const createAudioContext = () => new AudioCtx() as AudioContext;

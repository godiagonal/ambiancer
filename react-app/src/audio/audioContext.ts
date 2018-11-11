const audioCtx = (window as any).AudioContext || (window as any).webkitAudioContext;

export const createAudioContext = () => new audioCtx() as AudioContext;

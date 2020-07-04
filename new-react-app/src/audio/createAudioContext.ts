// eslint-disable-next-line @typescript-eslint/no-explicit-any
const context = window.AudioContext || (window as any).webkitAudioContext;
export const createAudioContext = (): AudioContext => new context();

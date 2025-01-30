import { renderDiceFace } from "./diceRenderer";

const animateDice = async (context: CanvasRenderingContext2D, height: number, width: number, lastValue: number, value: number) : Promise<void> => {
  renderDiceFace(context, value, height, width);
  return Promise.resolve();
}

export {
  animateDice,
}
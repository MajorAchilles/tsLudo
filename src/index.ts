import { initGame } from "./ludoCanvas";

declare global {
  interface Window {
    tsludo: typeof tsludo;
  }
}

const tsludo = {
  initGame,
}

window.tsludo  = tsludo;

export {
  tsludo,
};

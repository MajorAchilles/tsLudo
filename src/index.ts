import { initGame, ludoState, onRoll } from "./ludo";

declare global {
  interface Window {
    tsludo: typeof tsludo;
  }
}

const tsludo = {
  initGame,
  GAME_STATE: ludoState,
  onRoll,
}

window.tsludo  = tsludo;

export {
  tsludo,
};

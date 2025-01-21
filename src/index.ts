import { initGame, ludoState } from "./ludo";

declare global {
  interface Window {
    tsludo: typeof tsludo;
  }
}

const tsludo = {
  initGame,
  GAME_STATE: ludoState,
}

window.tsludo  = tsludo;

export {
  tsludo,
};

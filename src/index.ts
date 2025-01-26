import { initGame, ludoState, onBoardClick, onDiceClick } from "./ludo";

declare global {
  interface Window {
    tsludo: typeof tsludo;
  }
}

const tsludo = {
  initGame,
  GAME_STATE: ludoState,
  onDiceClick,
  onBoardClick,
}

window.tsludo  = tsludo;

export {
  tsludo,
};

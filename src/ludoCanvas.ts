import { PlayerId } from "./data/enums";
import { LudoGameState } from "./data/derivedTypes";
import { renderLudo } from "./renderer/ludoRenderer";
import initialState from "./stateManagement/initialState";
import { renderDiceFace } from "./renderer/diceRenderer";

const initGame = (
  canvas: HTMLCanvasElement,
  dice: HTMLCanvasElement,
  width: number,
  height: number,
) : void => {
  const ludoState : LudoGameState = {
    board: initialState,
    diceState: {
      value: 6,
      lastValue: 6,
      rolling: false,
    },
    currentPlayer: PlayerId.RED,
    players: [],
    started: false,
  }

  const gameCanvasCtx = canvas.getContext('2d');
  if (gameCanvasCtx) {
    gameCanvasCtx.fillStyle = 'red';
    gameCanvasCtx.fillRect(0, 0, width, height);
    
    renderLudo(gameCanvasCtx, ludoState, 500, 500, 1, [], 0, () => {});
  }

  const diceCanvasCtx = dice.getContext('2d');
  if (diceCanvasCtx && ludoState.diceState) {
    renderDiceFace(diceCanvasCtx, ludoState.diceState.value, 100);
  }
};

export {
  initGame,
}
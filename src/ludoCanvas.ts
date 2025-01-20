import { PlayerId } from "./data/enums";
import { LudoGameState } from "./data/derivedTypes";
import { renderLudo } from "./renderer/ludoRenderer";
import initialState from "./stateManagement/initialState";

const initGame = (
  canvas: HTMLCanvasElement,
  width: number,
  height: number,
) : void => {
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.fillStyle = 'red';
    ctx.fillRect(0, 0, width, height);
    const ludoState : LudoGameState = {
      boardMatrix: initialState,
      diceState: {
        value: 6,
        rolling: false,
      },
      currentPlayer: PlayerId.RED,
      players: [],
      started: false,
    }
    renderLudo(ctx, ludoState, 500, 500, 1, [], 0, () => {});
  }


  console.log('Game initialized');
  console.log(initialState);
};

export {
  initGame,
}
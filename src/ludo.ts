import { renderLudo } from "./renderer/ludoRenderer";
import { getRandomDiceValue, renderDiceFace } from "./renderer/diceRenderer";
import { LudoGameState } from "./data/derivedTypes";
import { canRollDice, getInitialState, setNextPlayer } from "./stateManagement/state.helpers";
import { log, LogType } from "./logger";
import { PlayerState } from "./data/enums";

const ludoState: LudoGameState = getInitialState();

log(LogType.GAME_STATE);

const initGame = (
  ludoCanvas: HTMLCanvasElement,
  diceCanvas: HTMLCanvasElement,
  ludoWidth: number,
  ludoHeight: number,
  diceHeight: number,
  diceWidth: number,
) : void => {
  if (!ludoCanvas || !diceCanvas) {
    throw new Error('Canvas elements are required');
  }

  ludoState.canvas.board.canvas = ludoCanvas;
  const ludoCanvasCtx = ludoCanvas.getContext('2d');
  ludoState.canvas.board.context = ludoCanvasCtx;
  ludoState.canvas.board.height = ludoHeight;
  ludoState.canvas.board.width = ludoWidth;

  if (!ludoHeight || !ludoWidth || ludoHeight < 0 || ludoWidth < 0) {
    throw new Error('Ludo board dimensions should be positive');
  }

  if (ludoHeight !== ludoWidth) {
    throw new Error('Ludo board should be square');
  }
  
  ludoState.canvas.dice.canvas = diceCanvas;
  const diceCanvasCtx = diceCanvas.getContext('2d');
  ludoState.canvas.dice.context = diceCanvasCtx;
  ludoState.canvas.dice.height = diceHeight;
  ludoState.canvas.dice.width = diceWidth;

  if (!diceHeight || !diceWidth || diceHeight < 0 || diceWidth < 0) {
    throw new Error('Dice dimensions should be positive');
  }

  if (diceHeight !== diceWidth) {
    throw new Error('Dice should be square');
  }
  
  if (ludoCanvasCtx) {
    ludoCanvasCtx.fillStyle = 'red';
    ludoCanvasCtx.fillRect(0, 0, ludoWidth, ludoHeight);
    
    renderLudo(ludoCanvasCtx, ludoState, 1, [], 0, () => {});
  }

  if (diceCanvasCtx) {
    renderDiceFace(diceCanvasCtx, ludoState.diceState.value, diceHeight, diceWidth);
  }
};

const onPlayerTurnStart = () : void => {
  const nextPlayerIndex = ludoState.currentPlayerIndex + 1;
  if (nextPlayerIndex >= ludoState.players.length) {
    ludoState.currentPlayerIndex = 0;
  }

  const currentPlayer = ludoState.players[ludoState.currentPlayerIndex];
  const otherPlayers = ludoState.players.filter((player, index) => index !== ludoState.currentPlayerIndex);

  const allOtherPlayersHaveWon = otherPlayers.every(player => player.state === PlayerState.WON);

  if (allOtherPlayersHaveWon) {
    currentPlayer.state = PlayerState.LOST;
    return;
  }

  if (currentPlayer.state !== PlayerState.INACTIVE) {
    // onPlayerTurnEnd();
  } else {
    currentPlayer.state = PlayerState.WAITING_ROLL;
  }
};

const onPlayerRoll = () : void => {
  const currentPlayer = ludoState.players[ludoState.currentPlayerIndex];
  currentPlayer.state = PlayerState.ROLLING;

  const diceValue = getRandomDiceValue();
  ludoState.diceState.lastValue = ludoState.diceState.value;
  ludoState.diceState.value = diceValue;
  currentPlayer.state = PlayerState.THINKING;
};

const onRoll = () : void => {
  if (ludoState.canvas.dice.context && canRollDice()) {
    const diceValue = getRandomDiceValue();
    
    ludoState.diceState.lastValue = ludoState.diceState.value;
    ludoState.diceState.value = diceValue;
    log(LogType.DICE_STATE);
    renderDiceFace(
      ludoState.canvas.dice.context,
      ludoState.diceState.value,
      ludoState.canvas.dice.height,
      ludoState.canvas.dice.width
    );
    setNextPlayer();
  }
}

export {
  initGame,
  ludoState,
  onRoll,
}
import { renderLudo } from "./renderer/ludoRenderer";
import { getRandomDiceValue, renderDiceFace } from "./renderer/diceRenderer";
import { LudoGameState } from "./data/derivedTypes";
import { log, LogType } from "./logger";
import { CellType, PlayerState } from "./data/enums";
import { getCurrentPlayer, setNextPlayer } from "./stateManagement/player.helpers";
import { getInitialState } from "./stateManagement/state.helpers";
import { getCoinCell, getCoinOriginatingCell, getPlayableCoins, getPlayerCoins } from "./stateManagement/coin.helpers";
import { cellToPathIndex, pathToCell } from "./stateManagement/path.helpers";
import { Coin } from "./data/baseTypes";
import { getClickedCell } from "./data/data.helpers";

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
    
    setInterval(() => {
      renderLudo(ludoCanvasCtx, ludoState, 1, [], 0, () => {});
    }, 30);
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
  console.log(ludoState.players[ludoState.currentPlayerIndex]);
};

const onPlayerTurnEnd = () : void => {
  const currentPlayer = getCurrentPlayer();

  if (currentPlayer.state === PlayerState.WON || currentPlayer.state === PlayerState.LOST) {
    onPlayerTurnStart();
  } else {
    currentPlayer.state = PlayerState.INACTIVE;
    setNextPlayer();
  }
};

const onPlayerRoll = () : void => {
  const currentPlayer = getCurrentPlayer();
  currentPlayer.state = PlayerState.ROLLING;

  const diceValue = getRandomDiceValue();
  ludoState.diceState.lastValue = ludoState.diceState.value;
  ludoState.diceState.value = diceValue;
  if (ludoState.canvas.dice.context) {
    renderDiceFace(ludoState.canvas.dice.context, diceValue, ludoState.canvas.dice.height, ludoState.canvas.dice.width);
  }

  currentPlayer.state = PlayerState.THINKING;

  const playableCoins = getPlayableCoins(diceValue);
  if (playableCoins.length === 0) {
    onPlayerTurnEnd();
  } else if (playableCoins.length === 1) {
    onPlayerMove(playableCoins[0]);
  } else {
    currentPlayer.state = PlayerState.SELECTING_COIN;
  }
};

const onPlayerMove = (coin: Coin) : void => {
  const currentPlayer = getCurrentPlayer();
  currentPlayer.state = PlayerState.MOVING;

  const cell = getCoinCell(coin);
  const pathIndex = cellToPathIndex(cell, currentPlayer);

  let nextPosition = -1;

  if (pathIndex === -1) {
    nextPosition = 0;
  } else {
    nextPosition = pathIndex + ludoState.diceState.value;
  }

  const path = ludoState.playerPaths[currentPlayer.id];

  const nextCell = pathToCell(path[nextPosition]);

  coin.position = nextCell.position;
  nextCell.coins.push(coin);
  cell.coins = cell.coins.filter(c => c.id !== coin.id);

  if (nextCell.type === CellType.SAFE || nextCell.type === CellType.HOME) {
    if (ludoState.diceState.value === 6) {
      currentPlayer.state = PlayerState.WAITING_ROLL;
    } else {
      onPlayerTurnEnd();
    }
  } else if (nextCell.type === CellType.FINISH) {
    const playerCoins = getPlayerCoins(currentPlayer.id);
    const playerCoinCells = playerCoins.map(coin => getCoinCell(coin));
    if (playerCoinCells.every(cell => cell.type === CellType.FINISH)) {
      currentPlayer.state = PlayerState.WON;
    }
    onPlayerTurnEnd();
  } else {
    const otherCoins = cell.coins.filter(c => c.id !== coin.id);

    if (otherCoins.length > 1) {
      const otherPlayersCoins = otherCoins.filter(c => c.playerId !== currentPlayer.id);
      if (otherPlayersCoins.length) {
        otherPlayersCoins[0].position = getCoinOriginatingCell(otherPlayersCoins[0]).position;
        const cell = ludoState.board[otherPlayersCoins[0].position.row][otherPlayersCoins[0].position.col];
        cell.coins.push(otherPlayersCoins[0]);
      }
    }

    if (ludoState.diceState.value === 6) {
      currentPlayer.state = PlayerState.WAITING_ROLL;
    } else {
      onPlayerTurnEnd();
    }
  }
};

const onDiceClick = () : void => {
  const currentPlayer = getCurrentPlayer();
  if (currentPlayer.state === PlayerState.WAITING_ROLL) {
    onPlayerRoll();
  }
}

const onBoardClick = (event: MouseEvent) : void => {
  const cell = getClickedCell(event, ludoState.canvas.board.height, ludoState.board);
  if (!cell) {
    return;
  }

  const currentPlayer = getCurrentPlayer();

  if (currentPlayer.state === PlayerState.SELECTING_COIN) {
    const coin = cell.coins.find(c => c.playerId === currentPlayer.id);
    if (coin) {
      onPlayerMove(coin);
    }
  };
}

export {
  initGame,
  ludoState,
  onDiceClick,
  onBoardClick,
}
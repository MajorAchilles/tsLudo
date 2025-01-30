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
import { animateDice } from "./renderer/diceAnimator";

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
  
  if (ludoCanvasCtx && diceCanvasCtx) {
    ludoCanvasCtx.fillStyle = 'red';
    ludoCanvasCtx.fillRect(0, 0, ludoWidth, ludoHeight);

    let lastStamp = 0;
    let div: HTMLDivElement | null = null;

    const document = ludoCanvas.ownerDocument;
    if (!document) {
      throw new Error('Document not found');
    } else if (ludoState.debug.fpsCounter) {
      div = document.createElement('div')
      div.innerText = 'FPS: 0. Frame Time: 0ms';
      document.body.appendChild(div);
    }

    const animHandler = (timestamp: number) => {
      const elapsed = timestamp - lastStamp;
      lastStamp = timestamp;
      const fps = 1000 / elapsed;
      if (div) {
        div.innerText = `FPS: ${Math.ceil(fps)}. Frame Time: ${elapsed}ms`;
      }
      // console.log(`FPS: ${Math.ceil(fps)}, time per frame: ${elapsed}ms`);
      renderLudo(ludoCanvasCtx, ludoState, 1, [], 0, () => {});
      renderDiceFace(diceCanvasCtx, ludoState.diceState.value, diceHeight, diceWidth);
      window.requestAnimationFrame(animHandler);
    };

    window.requestAnimationFrame(animHandler);
  }

  attachMoveDebugFunction(ludoState);
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

const onPlayerRoll = async () : Promise<void> => {
  const currentPlayer = getCurrentPlayer();
  currentPlayer.state = PlayerState.ROLLING;

  const diceValue = getRandomDiceValue();
  ludoState.diceState.lastValue = ludoState.diceState.value;
  ludoState.diceState.value = diceValue;
  if (ludoState.canvas.dice.context) {
    await animateDice(ludoState.canvas.dice.context, ludoState.canvas.dice.height, ludoState.canvas.dice.width, ludoState.diceState.lastValue, ludoState.diceState.value);
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
  return Promise.resolve();
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

  if (nextCell.type === CellType.SAFE || nextCell.type === CellType.HOME || nextCell.type === CellType.START) {
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
    } else if (ludoState.diceState.value === 6) {
      currentPlayer.state = PlayerState.WAITING_ROLL;
    }
    onPlayerTurnEnd();
  } else {
    const otherCoins = nextCell.coins.filter(c => c.id !== coin.id);

    if (otherCoins.length >= 1) {
      const otherPlayersCoins = otherCoins.filter(c => c.playerId !== currentPlayer.id);
      if (otherPlayersCoins.length) {
        const originatingCell = getCoinOriginatingCell(otherPlayersCoins[0]);
        otherPlayersCoins[0].position = originatingCell.position;
        originatingCell.coins.push(otherPlayersCoins[0]);
        nextCell.coins = nextCell.coins.filter(c => c.id !== otherPlayersCoins[0].id);
      }
    }

    if (ludoState.diceState.value === 6) {
      currentPlayer.state = PlayerState.WAITING_ROLL;
    } else {
      onPlayerTurnEnd();
    }
  }
  nextCell.coins.push(coin);
  cell.coins = cell.coins.filter(c => c.id !== coin.id);
};

const onDiceClick = () : void => {
  const currentPlayer = getCurrentPlayer();
  if (currentPlayer.state === PlayerState.WAITING_ROLL) {
    onPlayerRoll();
  }
}

const onBoardClick = (event: MouseEvent) : void => {
  if (event.ctrlKey) {
    debugClick(event);
    return;
  }

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

const debugClick = (event: MouseEvent) : void => {
  const cell = getClickedCell(event, ludoState.canvas.board.height, ludoState.board);
  if (!cell) {
    return;
  } else if (ludoState.debug.heap.fromCol && ludoState.debug.heap.fromRow) {
    ludoState.debug.heap.toCol = cell.position.col;
    ludoState.debug.heap.toRow = cell.position.row;
    if (ludoState.debug.move) {
      ludoState.debug.move(ludoState.debug.heap.fromRow, ludoState.debug.heap.fromCol, ludoState.debug.heap.toRow, ludoState.debug.heap.toCol);
      ludoState.debug.heap.fromRow = undefined;
      ludoState.debug.heap.fromCol = undefined;
      ludoState.debug.heap.toRow = undefined;
      ludoState.debug.heap.toCol = undefined;
    }
  } else {
    ludoState.debug.heap.fromCol = cell.position.col;
    ludoState.debug.heap.fromRow = cell.position.row;
  }
}

const attachMoveDebugFunction = (ludoState: LudoGameState) : void => {
  ludoState.debug.move = (fromRow: number, fromCol: number, toRow: number, toCol: number) => {
    const cell = ludoState.board[fromRow][fromCol];

    if (cell.coins.length === 0) {
      console.debug('No coins to move');
      return;
    } else {
      const coin : Coin = cell.coins.shift()!;

      const nextCell = ludoState.board[toRow][toCol];
      coin.position = nextCell.position;
      nextCell.coins.push(coin);
    }
  };
}

export {
  initGame,
  ludoState,
  onDiceClick,
  onBoardClick,
}
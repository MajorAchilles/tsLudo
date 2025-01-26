import { Cell, Coin, DiceValue } from "../data/baseTypes";
import { ludoState } from "./initialState";
import { cellToPathIndex } from "./path.helpers";
import { getCurrentPlayer } from "./player.helpers";

const getPlayerCoins = (playerId: string) : Array<Coin> => {
  return ludoState.coins.filter(coin => coin.playerId === playerId);
};

const getCurrentPlayerCoins = () : Array<Coin> => {
  return getPlayerCoins(getCurrentPlayer().id);
};

const isCoinPlayable = (coin: Coin, diceValue: DiceValue) : boolean => {
  const cell = ludoState.board[coin.position.row][coin.position.col];
  const pathIndex = cellToPathIndex(cell, ludoState.players.find(player => player.id === coin.playerId)!);

  // Check if the coin is in the home row
  if (pathIndex === -1) {
    return true;
  } else {
    return pathIndex + diceValue <= ludoState.playerPaths[coin.playerId].length;
  }
}

const getPlayableCoins = (diceValue: DiceValue) : Array<Coin> => {
  const allCoins = getCurrentPlayerCoins();

  return allCoins.filter((coin) => isCoinPlayable(coin, diceValue));
}

const getCoinCell = (coin: Coin) : Cell => {
  return ludoState.board[coin.position.row][coin.position.col];
}

const getCoinOriginatingCell = (coin: Coin) : Cell => {
  const [coinRowString, coinColString] = coin.id.split('-');
  const coinRow = parseInt(coinRowString, 10);
  const coinCol = parseInt(coinColString, 10);

  return ludoState.board[coinRow][coinCol];
}

export {
  getPlayerCoins,
  getCurrentPlayerCoins,
  getPlayableCoins,
  getCoinCell,
  getCoinOriginatingCell,
};

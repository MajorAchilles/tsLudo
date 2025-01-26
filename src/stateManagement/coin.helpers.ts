import { Coin } from "../data/baseTypes";
import { ludoState } from "./initialState";
import { getCurrentPlayer } from "./player.helpers";

const getPlayerCoins = (playerId: string) : Array<Coin> => {
  return ludoState.coins.filter(coin => coin.playerId === playerId);
};

const getCurrentPlayerCoins = () : Array<Coin> => {
  return getPlayerCoins(getCurrentPlayer().id);
};

export {
  getPlayerCoins,
  getCurrentPlayerCoins,
};

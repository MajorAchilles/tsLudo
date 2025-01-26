import { getCurrentPlayerCoins, getPlayerCoins } from "./coin.helpers";
import { canRollDice, getCurrentPlayer, setNextPlayer } from "./player.helpers";
import { getInitialState } from "./state.helpers";

const player = {
  getCurrentPlayer,
  setNextPlayer,
  canRollDice,
};

const coin = {
  getPlayerCoins,
  getCurrentPlayerCoins,
};

const state = {
  getInitialState,
};

export default { player, coin, state };
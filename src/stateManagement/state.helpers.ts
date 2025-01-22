import { LudoGameState, Player } from "../data/derivedTypes";
import { PlayerState } from "../data/enums";
import { ludoState } from "./initialState";



const getCurrentPlayer = () : Player => {
  return ludoState.players[ludoState.currentPlayerIndex];
};

const setNextPlayer = () : void => {
  const currentPlayer = getCurrentPlayer();
  currentPlayer.state = PlayerState.INACTIVE;
  if (ludoState.currentPlayerIndex === ludoState.players.length - 1) {
    ludoState.currentPlayerIndex = 0;
  } else {
    ludoState.currentPlayerIndex++;
  }
  const nextPlayer = getCurrentPlayer();
  nextPlayer.state = PlayerState.WAITING_ROLL;

  // set next player depending on roll and board state
}

const canRollDice = () : boolean => {
  const currentPlayer : Player = getCurrentPlayer();
  if (currentPlayer.state === PlayerState.WAITING_ROLL) {
    return true;
  }
  return false;
};

const getInitialState = () : LudoGameState => {
  return ludoState;
};

export {
  getCurrentPlayer,
  setNextPlayer,
  canRollDice,
  getInitialState,
};

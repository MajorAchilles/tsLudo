import { ludoState } from "../stateManagement/initialState";

enum LogType {
  DICE_VALUE = 'LogType::DICE_VALUE',
  DICE_STATE = 'LogType::DICE_STATE',
  CURRENT_PLAYER_INDEX = 'LogType::CURRENT_PLAYER_INDEX',
  CURRENT_PLAYER = 'LogType::CURRENT_PLAYER',
  PLAYERS = 'LogType::PLAYERS',
};


const log = (type: LogType, message?: string) : void => {
  if (!ludoState.debug.logs) {
    return;
  }

  let value = null;

  if (type === LogType.DICE_VALUE) {
    value  = ludoState.diceState.value;
  }

  if (type === LogType.DICE_STATE) {
    value = ludoState.diceState;
  }

  if (type === LogType.CURRENT_PLAYER_INDEX) {
    value = ludoState.currentPlayerIndex;
  }

  if (type === LogType.CURRENT_PLAYER) {
    value = ludoState.players[ludoState.currentPlayerIndex];
  }

  if (type === LogType.PLAYERS) {
    value = ludoState.players;
  }

  if (message) {
    console.debug(`${message} : ${value}`);
  } else {
    console.debug(value);
  }
};

export {
  LogType,
  log,
};
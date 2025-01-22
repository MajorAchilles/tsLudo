import { getBoardMatrix } from "../data/data.helpers";
import { LudoGameState, Player } from "../data/derivedTypes";
import { PlayerId, PlayerState } from "../data/enums";

const createStartingPlayers = () : Player[] => {
  return [
    {
      id: PlayerId.RED,
      state: PlayerState.WAITING_ROLL,
      hasMovesLeft: true,
    },
    {
      id: PlayerId.BLUE,
      state: PlayerState.INACTIVE,
      hasMovesLeft: false,
    },
    {
      id: PlayerId.YELLOW,
      state: PlayerState.INACTIVE,
      hasMovesLeft: false,
    },
    {
      id: PlayerId.GREEN,
      state: PlayerState.INACTIVE,
      hasMovesLeft: false,
    },
  ];
};

const ludoState : LudoGameState = {
  board: getBoardMatrix(),
  diceState: {
    value: 6,
    lastValue: 6,
    rolling: false,
  },
  currentPlayerIndex: 0,
  players: createStartingPlayers(),
  started: false,
  canvas: {
    board: {
      canvas: null,
      context: null,
      height: 0,
      width: 0,
    },
    dice: {
      canvas: null,
      context: null,
      height: 0,
      width: 0,
    },
  },
  debug: {
    logs: true,
  }
};

export {
  ludoState,
};

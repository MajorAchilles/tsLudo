/**
 * @fileoverview Types for Ludo game
 */

import { Cell, DiceValue } from "./baseTypes";
import { PlayerId, PlayerState } from "./enums";

/**
 * Represents the props for the Ludo board component.
 */
type LudoBoardProps = {
  height: number; // The height of the board
  width: number; // The width of the board
  gameState: LudoGameState; // The state of the game
  onUpdateGameState: (state: LudoGameState) => void; // The callback to update the game state
};

/**
 * Represents the matrix of cells on the board.
 */
type BoardMatrix = Array<Array<Cell>>;


/**
 * Represents the state of the dice.
 */
type DiceState = {
  value: DiceValue; // The current value of the dice
  lastValue: DiceValue; // The last value of the dice
  rolling: boolean; // Whether the dice is rolling
};

/**
 * Represents a player in the game.
 */
type Player = {
  id: PlayerId;
  state: PlayerState; // The state of the player
  hasMovesLeft: boolean; // Whether the player has moves left
};

/**
 * Represents the state of the Ludo game.
 */
type LudoGameState = {
  currentPlayerIndex: 0|1|2|3; // The current player
  players: Player[]; // The players in the game
  board: BoardMatrix; // The matrix of cells on the board
  started: boolean; // Whether the game has started
  diceState: DiceState; // The state of the dice
  canvas: {
    board: {
      canvas: HTMLCanvasElement | null,
      context: CanvasRenderingContext2D | null,
      height: number,
      width: number,
    },
    dice: {
      canvas: HTMLCanvasElement | null,
      context: CanvasRenderingContext2D | null,
      height: number,
      width: number,
    }
  },
  debug: {
    logs: boolean, // Whether to log debug messages
  }
};

export {
  type BoardMatrix,
  type DiceState,
  type LudoBoardProps,
  type LudoGameState,
  type Player,
};

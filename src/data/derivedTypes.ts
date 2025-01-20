/**
 * @fileoverview Types for Ludo game
 */

import { Cell, Coin, DiceState } from "./baseTypes";
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
 * Represents a player in the game.
 */
type Player = {
  id: PlayerId;
  state: PlayerState; // The state of the player
  coins: Coin[]; // The coins of the player
  movesLeft: number; // The number of moves left for the player in case of a double dice
  nextPossibleStates: PlayerState[]; // The next possible states for the player given the current state
};

/**
 * Represents the state of the Ludo game.
 */
type LudoGameState = {
  currentPlayer: PlayerId; // The current player
  players: Player[]; // The players in the game
  boardMatrix: BoardMatrix; // The matrix of cells on the board
  started: boolean; // Whether the game has started
  diceState: DiceState | null; // The state of the dice
};

export {
  type BoardMatrix,
  type LudoBoardProps,
  type LudoGameState,
  type Player,
};

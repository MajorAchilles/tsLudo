/**
 * @fileoverview Types for Ludo game
 */

import { CellType, Colors, PlayerId, PlayerState } from "./enums";

/**
 * Represents the position of a cell on the board.
 */
type Position = {
  row: number;
  col: number;
};

/**
 * Represents a coin in the game.
 */
type Coin = {
  id: string;
  player: PlayerId; // The player to which this coin belongs
  position: Position; // In which cell this coin is present
};

/**
 * Represents a cell on the board.
 */
type Cell = {
  id: number;
  position: Position; // The position of the cell on the board
  type: CellType; // The type of the cell
  // player?: PlayerId; // The player to which this cell belongs
  color: Colors.WHITE | Colors.RED | Colors.GREEN | Colors.YELLOW | Colors.BLUE; // The color of the cell
  coins: Coin[]; // The coins present in this cell
};

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
  value: 1 | 2 | 3 | 4 | 5 | 6;
  rolling: boolean; // Whether the dice is rolling
};

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

/**
 * Represents a pixel on the rendered image.
 */
type Vertex = {
  x: number;
  y: number;
};

/**
 * Represents a path for an animation.
 */
type AnimationPath = Array<Vertex>;

export {
  type AnimationPath,
  type BoardMatrix,
  type Cell,
  type Coin,
  type DiceState,
  type LudoBoardProps,
  type LudoGameState,
  type Player,
  type Vertex,
};

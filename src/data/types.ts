/**
 * @fileoverview Types for Ludo game
 */

import { CellType, PlayerId, PlayerState } from "./enums";

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
  player: PlayerId;
  position: Position;
};

/**
 * Represents a cell on the board.
 */
type Cell = {
  id: number;
  position: Position;
  type: CellType;
  player?: PlayerId;
  color: string;
  coins: Coin[];
};

/**
 * Represents the props for the Ludo board component.
 */
type LudoBoardProps = {
  height: number;
  width: number;
  gameState: LudoGameState;
  onUpdateGameState: (state: LudoGameState) => void;
};

/**
 * Represents the matrix of cells on the board.
 */
type BoardMatrix = Array<Array<Cell>>;

/**
 * Represents the state of the dice.
 */
type DiceState = {
  value: number;
  rolling: boolean;
};

/**
 * Represents a player in the game.
 */
type Player = {
  id: PlayerId;
  state: PlayerState;
  coins: Coin[];
  movesLeft: number;
  nextPossibleStates: PlayerState[];
};

/**
 * Represents the state of the Ludo game.
 */
type LudoGameState = {
  currentPlayer: PlayerId;
  players: Player[];
  boardMatrix: BoardMatrix;
  started: boolean;
  diceState: DiceState;
};

/**
 * Represents a vertex on the board.
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

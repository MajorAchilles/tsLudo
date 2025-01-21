/**
 * @fileoverview Types for Ludo game
 */

import { CellType, Colors, PlayerId } from "./enums";

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
  playerId: PlayerId; // The player to which this coin belongs
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
 * Represents the state of the dice.
 */
type DiceState = {
  value: 1 | 2 | 3 | 4 | 5 | 6;
  lastValue: 1 | 2 | 3 | 4 | 5 | 6;
  rolling: boolean; // Whether the dice is rolling
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
  type Cell,
  type Coin,
  type DiceState,
  type Vertex,
};

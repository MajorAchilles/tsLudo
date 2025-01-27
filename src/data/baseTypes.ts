/**
 * @fileoverview Types for Ludo game
 */

import { CellType, Colors, PlayerId } from "./enums";

/**
 * Represents the position of a cell on the board.
 * @typedef {Object} Position
 * @property {number} row - The row of the cell. 0 based index
 * @property {number} col - The column of the cell. 0 based index
 */
type Position = {
  row: number;
  col: number;
};

/**
 * Represents a coin in the game.
 * @typedef {Object} Coin
 * @property {string} id - The id of the coin
 * @property {PlayerId} playerId - The player to which this coin belongs
 * @property {Position} position - In which cell this coin is present
 */
type Coin = {
  id: string;
  playerId: PlayerId; // The player to which this coin belongs
  position: Position; // In which cell this coin is present
};

/**
 * Represents a cell on the board.
 * @typedef {Object} Cell
 * @property {string} id - The id of the cell
 * @property {Position} position - The position of the cell on the board
 * @property {CellType} type - The type of the cell
 * @property {Colors.WHITE | Colors.RED | Colors.GREEN | Colors.YELLOW | Colors.BLUE} color - The color of the cell
 * @property {Coin[]} coins - The coins present in this cell
 */
type Cell = {
  id: string;
  position: Position; // The position of the cell on the board
  type: CellType; // The type of the cell
  // player?: PlayerId; // The player to which this cell belongs
  color: Colors.WHITE | Colors.RED | Colors.GREEN | Colors.YELLOW | Colors.BLUE; // The color of the cell
  coins: Coin[]; // The coins present in this cell
};

/**
 * Represents the value of a dice.
 * @typedef {1|2|3|4|5|6} DiceValue
 */
type DiceValue = 1 | 2 | 3 | 4 | 5 | 6;

/**
 * Represents a pixel on the rendered image.
 * @typedef {Object} Vertex
 * @property {number} x - The x coordinate of the pixel
 * @property {number} y - The y coordinate of the pixel
 */
type Vertex = {
  x: number;
  y: number;
};

/**
 * Represents a path for an animation.
 * @typedef {Vertex[]} AnimationPath
 * @description An array of vertices representing the path of an animation.
 * The first vertex is the starting point and the last vertex is the ending point.
 * The vertices in between represent the path of the animation.
 * The path should be continuous and should not have any gaps.
 * The path should not have any sharp turns or loops.
 * The path should not intersect itself.
 * The path should not intersect any other path.
 * The path should not go outside the bounds of the canvas.
 * The path should not go through any obstacles.
 */
type AnimationPath = Array<Vertex>;

export {
  type Position,
  type AnimationPath,
  type Cell,
  type Coin,
  type DiceValue,
  type Vertex,
};

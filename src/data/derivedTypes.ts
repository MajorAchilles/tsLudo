/**
 * @fileoverview Types for Ludo game
 */

import { Cell, Coin, DiceValue, Position } from "./baseTypes";
import { PlayerId, PlayerState } from "./enums";

/**
 * Represents the props for the Ludo board component.
 * @typedef {Object} LudoBoardProps
 * @property {number} height - The height of the board
 * @property {number} width - The width of the board
 * @property {LudoGameState} gameState - The state of the game
 * @property {(state: LudoGameState) => void} onUpdateGameState - The callback to update the game state
 */
type LudoBoardProps = {
  height: number; // The height of the board
  width: number; // The width of the board
  gameState: LudoGameState; // The state of the game
  onUpdateGameState: (state: LudoGameState) => void; // The callback to update the game state
};

/**
 * Represents the matrix of cells on the board.
 * @typedef {Array<Array<Cell>>} BoardMatrix
 */
type BoardMatrix = Array<Array<Cell>>;


/**
 * Represents the state of the dice.
 * @typedef {Object} DiceState
 * @property {DiceValue} value - The current value of the dice
 * @property {DiceValue} lastValue - The last value of the dice
 * @property {boolean} rolling - Whether the dice is rolling
 */
type DiceState = {
  value: DiceValue; // The current value of the dice
  lastValue: DiceValue; // The last value of the dice
  rolling: boolean; // Whether the dice is rolling
};

/**
 * Represents a player in the game.
 * @typedef {Object} Player
 * @property {PlayerId} id - The id of the player
 * @property {PlayerState} state - The state of the player
 * @property {boolean} hasMovesLeft - Whether the player has moves left
 */
type Player = {
  id: PlayerId;
  state: PlayerState; // The state of the player
  hasMovesLeft: boolean; // Whether the player has moves left
};

/**
 * Represents the position of a cell on the board.
 * @typedef {Object} PlayerPaths
 * @property {Array<Position>} red - The path of the red player
 * @property {Array<Position>} blue - The path of the blue player
 * @property {Array<Position>} yellow - The path of the yellow player
 * @property {Array<Position>} green - The path of the green player
 */
type PlayerPaths = {
  [PlayerId.RED]: Array<Position>,
  [PlayerId.BLUE]: Array<Position>,
  [PlayerId.GREEN]: Array<Position>,
  [PlayerId.YELLOW]: Array<Position>,
};

/**
 * Represents the state of the Ludo game.
 * @typedef {Object} LudoGameState
 * @property {0|1|2|3} currentPlayerIndex - The current player
 * @property {Player[]} players - The players in the game
 * @property {BoardMatrix} board - The matrix of cells on the board
 * @property {Coin[]} coins - The coins on the board
 * @property {boolean} started - Whether the game has started
 * @property {DiceState} diceState - The state of the dice
 * @property {PlayerPaths} playerPaths - The paths of the players
 * @property {Object} canvas - The canvas elements
 * @property {Object} canvas.board - The canvas element for the board
 * @property {HTMLCanvasElement | null} canvas.board.canvas - The canvas element for the board
 * @property {CanvasRenderingContext2D | null} canvas.board.context - The context of the canvas element for the board
 * @property {number} canvas.board.height - The height of the canvas element for the board
 * @property {number} canvas.board.width - The width of the canvas element for the board
 * @property {Object} canvas.dice - The canvas element for the dice
 * @property {HTMLCanvasElement | null} canvas.dice.canvas - The canvas element for the dice
 * @property {CanvasRenderingContext2D | null} canvas.dice.context - The context of the canvas element for the dice
 * @property {number} canvas.dice.height - The height of the canvas element for the dice
 * @property {number} canvas.dice.width - The width of the canvas element for the dice
 * @property {Object} debug - The debug settings
 * @property {boolean} debug.logs - Whether to log debug messages
 */
type LudoGameState = {
  currentPlayerIndex: 0|1|2|3; // The current player
  players: Player[]; // The players in the game
  board: BoardMatrix; // The matrix of cells on the board
  coins: Coin[]; // The coins on the board
  started: boolean; // Whether the game has started
  diceState: DiceState; // The state of the dice
  playerPaths: PlayerPaths; // The paths of the players
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
    fpsCounter: boolean, // Whether to show the FPS counter
    move: undefined | ((fromRow: number, fromCol: number, toRow: number, toCol: number) => void),
    heap: {
      fromRow?: number,
      fromCol?: number,
      toRow?: number,
      toCol?: number,
    },
  }
};

export {
  type BoardMatrix,
  type DiceState,
  type LudoBoardProps,
  type LudoGameState,
  type Player,
  type PlayerPaths,
};

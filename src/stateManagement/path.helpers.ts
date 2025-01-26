import { Cell, Position } from "../data/baseTypes";
import { Player } from "../data/derivedTypes";
import { ludoState } from "./initialState";

const pathToCell = (pathElement: Position) : Cell => {
  return ludoState.board[pathElement.row][pathElement.col];
};

const cellToPath = (cell: Cell, player: Player): Position | undefined => {
  const playerPath = ludoState.playerPaths[player.id];
  return playerPath.find((pathElement) => pathElement.col === cell.position.col && pathElement.row === cell.position.row);
};

const pathIndexFromCell = (cell: Cell, player: Player): number => {
  const playerPath = ludoState.playerPaths[player.id];
  return playerPath.findIndex((pathElement) => pathElement.col === cell.position.col && pathElement.row === cell.position.row);
};

export {
  pathToCell,
  cellToPath,
  pathIndexFromCell,
};

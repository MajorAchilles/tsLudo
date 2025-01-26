import { LudoGameState } from "../data/derivedTypes";
import { ludoState } from "./initialState";

const getInitialState = () : LudoGameState => {
  return ludoState;
};

export {
  getInitialState,
};

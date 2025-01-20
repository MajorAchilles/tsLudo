/**
 * @fileoverview Types for Ludo game
 */

/**
 * Represents the type of cell on the board.
 */
enum CellType {
  HOME = 'CellType::Home', // Home point for player
  START = 'CellType::Start', // Starting point for player
  SAFE = 'CellType::Safe', // Safe zone for all players
  NORMAL = 'CellType::Normal', // Normal track
  FINISH = 'CellType::Finish', // Finish line for player
  WALL = 'CellType::Wall', // Wall
}

/**
 * Represents the possible player ids.
 */
enum PlayerId {
  RED = 'Player::Red',
  BLUE = 'Player::Blue',
  YELLOW = 'Player::Yellow',
  GREEN = 'Player::Green',
}

/**
 * Represents the possible states of a player.
 */
enum PlayerState {
  INACTIVE = 'PlayState::Inactive', // Not the current player
  ROLLING = 'PlayState::Rolling', // Rolling the dice
  THINKING = 'PlayState::Thinking', // Thinking about the next move
  MOVING = 'PlayState::Moving', // Game is rendering the coin movement animation
  WON = 'PlayState::Won', // Player has won the game
  LOST = 'PlayState::Lost', // Player has lost the game
}

/**
 * Represents the colors used in the game.
 */
enum Colors {
  BLACK = '#000000',
  WHITE = '#ffffff',
  TRANSPARENT_LITERAL = 'transparent',
  RED = '#ff0000',
  BLUE = '#0088ff',
  YELLOW = '#ffff00',
  GREEN = '#00ff00',
}

export {
  CellType,
  Colors,
  PlayerId,
  PlayerState,
};

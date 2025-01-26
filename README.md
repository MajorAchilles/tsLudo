<p align="center">
  <img src="https://github.com/MajorAchilles/tsludo/raw/rewrite-v1/public/tsludo_256x256.png" alt="Ludo Logo">
</p>

# tsludo
A TypeScript + HTML Canvas implementation of the game Ludo

## Todo
* ~~Export as a lib~~ Done
* ~~Building blocks - draw functions~~ Done
* ~~Define Game State~~ - Done
* Game logic to generate key frames - In Progress
* Interpolate animation frames between key frames - To do
* Configurability - To do but not urgent
* Player AI - Maybe?


## Export as a lib
Created a JS lib and published to npm

## Building blocks
Copied draw function from previous version of the react based attempt

## Define Game State

### Entities

#### Board - `Array<Array<Cells>>` - Done

#### DiceState - Done
* value: `1|2|3|4|5|6`
* lastValue: `1|2|3|4|5|6`

_Might just need to only generate the next random value and leave the interpolated frame to random values for the renderer._

#### Cells - Done
* id
* type - `HOME|START|SAFE|PATH|FINISH|WALL`
* position.row - `num`
* position.column - `num`
* color
* coins - `Array<Coin>`

#### Coins - Done
* id
* playerId - `Player`
* position.row - `num`
* position.column - `num`

#### Player: Done
* id - `RED|BLUE|GREEN|YELLOW`
* state - `INACTIVE|ROLLING|THINKING|MOVING|WON|LOST`
* hasMovesLeft - `boolean`

### Game State - Done
* board: `Board`
* players: `Array<Player>`
* currentPlayer: `Player`
* diceValue: `DiceValue`

## Game logic to generate key frames

### Initialize game state - Done

_Roll moves from red, to blue, to yellow to green and back to red (in anti-clockwise direction)._

### On Player turn start

* Get next player
* Set currentPlayer = next Player
* if player state is not INACTIVE
    * [End player turn](#on-player-turn-end)
* Else,
    * Set player state to WAITING_ROLL
    * Wait for player to click on the dice
    * Once clicked, [roll the dice](#on-player-roll)
    
### On Player Roll
* Set player state to ROLLING
* Get a new random dice value between 1 and 6
* Set player state to THINKING
* Get all coins that have path.end - path.current < diceValue
* If coins count is 0,
  * [End player turn](#on-player-turn-end)
* If coint count is 1,
  * [Move the coin](#on-player-move)
* If coin count is more than 1,
  * Set player state to SELECTING_COIN
  * Wait for user to click on any one of the valid coins that the user wants to move
  * Once clicked, [Move the coin](#on-player-move)


### On player move

* Set player state to MOVING
* Move coin to path.[path.current + diceValue]
* Set path.current = path[path.current + diceValue]
* Get the type of the cell at position path.current
* If cell type is SAFE or START
  * If dice value is 6
      * Set player state to WAITING_ROLL
  * Else,
      * [End player turn](#on-player-turn-end)
* If cell type is FINISH
  * Get all coins for the current player
  * Get the cells for the coins
  * If all the cells are in FINISH
    * Set player state to WON
  * [End player turn](#on-player-turn-end)
* If cell type is NORMAL
  * Get all the coins present in that cell
  * If there are more than 2 coins in that cell
    * Get the players of the other cell
    * If the player != current player
      * Move that coin to it's home position
  * If dice value is 6
      * Set player state to WAITING_ROLL
  * Else,
      * [End player turn](#on-player-turn-end)

### On player turn end

* If current player state is WON or LOST
    * [Start player turn for next player](#on-player-turn-start)
* Else,
    * Set current player state to INACTIVE
    * [Start player turn for next player](#on-player-turn-start)
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

### On Roll
Roll moves from red, to blue, to yellow to green and back to red (in anti-clockwise direction).

#### If player doesn't have any coin in play and has no coins in home
Player doesn't get to roll. They have won the game already. This roll is invalid and shouldn't have been allowed.

#### If player doesn't have any coin in play and has at least one coin in home.

* If player rolls a 6
  * Move a coin from home to start.
  * Set player state to waiting roll
* else
  * play moves to next player.

#### If player has coins in play and doesn't have any coin in home.

On player roll
* Check if player has a coin that can move steps equal to dice value
  * If exists, get valid coin count
    * If coin count is 1, move that coin
    * If more than one such coin exists
      * set player state to thinking.
      * Once player selects a coin to move, move that coin by dice value
      * If dice value is 6, set player state to waiting to roll
      * else, move play to next player
  * If no such coin exists
    * move play to next player
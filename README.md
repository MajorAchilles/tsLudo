# tsludo
A TypeScript + HTML Canvas implementation of the game Ludo

## Todo
* ~~Export as a lib~~ Done
* ~~Building blocks - draw functions~~ Done
* Define Game State  - In Progress
* Interpolate animation frames between key frames - To do
* Game logic to generate key frames - To do
* Configurability - To do but not urgent
* Player AI - Maybe?


### Export as a lib
Created a JS lib and published to npm

### Building blocks
Copied draw function from previous version of the react based attempt

### Define Game State

#### Entities

##### Board - `Array<Array<Cells>>` - Done

##### DiceState - Done
* value: `1|2|3|4|5|6`
* lastValue: `1|2|3|4|5|6`

_Might just need to only generate the next random value and leave the interpolated frame to random values for the renderer._

##### Cells - Done
* id
* type - `HOME|START|SAFE|PATH|FINISH|WALL`
* position.row - `num`
* position.column - `num`
* color
* coins - `Array<Coin>`

##### Coins - Done
* id
* playerId - `Player`
* position.row - `num`
* position.column - `num`

##### Player: Done
* id - `RED|BLUE|GREEN|YELLOW`
* state - `INACTIVE|ROLLING|THINKING|MOVING|WON|LOST`
* hasMovesLeft - `boolean`

#### Game State - Done
* board: `Board`
* players: `Array<Player>`
* currentPlayer: `Player`
* diceValue: `DiceValue`

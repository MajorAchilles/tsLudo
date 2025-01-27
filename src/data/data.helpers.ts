import { Cell, Coin, Position, Vertex } from './baseTypes';
import { BoardMatrix, PlayerPaths } from './derivedTypes';
import { CellType, Colors, PlayerId } from './enums';

const BOARD_SIZE = 15;

/**
 * Calculates the center coordinates of a given cell on a game board.
 *
 * @param cell - An object representing a cell on the game board.
 * @param cellSize - The size of each cell on the game board.
 * @returns An object containing the x and y coordinates of the center of the cell.
 */
const getCellCenter = (cell: Cell, cellSize: number): Vertex => {
  const center = {
    x: cell.position.col * cellSize + cellSize / 2,
    y: cell.position.row * cellSize + cellSize / 2,
  };

  return center as Vertex;
};

/**
 * Returns the color associated with a given player type.
 *
 * @param player - An optional value of type `PlayerId` representing the player type. If not provided, the default color 'white' will be returned.
 * @returns A string representing the color associated with the given player type.
 *
 * @example
 * const color = getPlayerColor(PlayerId.RED);
 * console.log(color); // Output: 'red'
 */
const getPlayerColor = (player?: PlayerId): Colors.RED | Colors.BLUE | Colors.YELLOW | Colors.GREEN | Colors.WHITE => {
  switch (player) {
    case PlayerId.RED:
      return Colors.RED;
    case PlayerId.BLUE:
      return Colors.BLUE;
    case PlayerId.YELLOW:
      return Colors.YELLOW;
    case PlayerId.GREEN:
      return Colors.GREEN;
    default:
      return Colors.WHITE;
  }
};

/**
 * Creates instances of the `Coin` type based on the given row and column values.
 *
 * @param row - The row value of the cell.
 * @param col - The column value of the cell.
 * @returns An array of coin instances based on the given row and column values.
 */
const createCoinInstance = (row: number, col: number): Coin | undefined => {
  let playerId: PlayerId | undefined;

  if (row === 2) {
    if (col === 2 || col === 3) {
      playerId = PlayerId.RED;
    }

    if (col === 11 || col === 12) {
      playerId = PlayerId.GREEN;
    }
  }
  if (row === 3) {
    if (col === 2 || col === 3) {
      playerId = PlayerId.RED;
    }

    if (col === 11 || col === 12) {
      playerId = PlayerId.GREEN;
    }
  }

  if (row === 11) {
    if (col === 2 || col === 3) {
      playerId = PlayerId.BLUE;
    }

    if (col === 11 || col === 12) {
      playerId = PlayerId.YELLOW;
    }
  }
  if (row === 12) {
    if (col === 2 || col === 3) {
      playerId = PlayerId.BLUE;
    }

    if (col === 11 || col === 12) {
      playerId = PlayerId.YELLOW;
    }
  }
  if (playerId) {
    return {
      id: `${row}-${col}`,
      playerId,
      position: { row, col },
    };
  }
  return undefined;
};

/**
 * Determines the cell that was clicked on a canvas based on the mouse event, canvas height, and the board matrix.
 * @param event - The mouse event object that contains information about the click event.
 * @param canvasHeight - The height of the canvas element.
 * @param board - The matrix representing the game board, where each element is a cell object.
 * @returns The cell object that corresponds to the clicked position on the canvas. If the clicked position is outside the valid range of the board matrix, undefined is returned.
 */
const getClickedCell = (
  event: Event,
  canvasHeight: number,
  board: BoardMatrix
): Cell | undefined => {
  const canvas = event.currentTarget as HTMLCanvasElement;
  const mouseEvent = event as MouseEvent;
  const rect = canvas.getBoundingClientRect();
  const x = mouseEvent.clientX - rect.left;
  const y = mouseEvent.clientY - rect.top;
  // get the cell index
  const cellSize = canvasHeight / BOARD_SIZE;
  const cellRow = Math.floor(y / cellSize);
  const cellCol = Math.floor(x / cellSize);

  if (
    cellRow < 0 ||
    cellRow >= BOARD_SIZE ||
    cellCol < 0 ||
    cellCol >= BOARD_SIZE
  )
    return undefined;

  const cell = board![cellRow]![cellCol];
  return cell;
};

/**
 * Generates a matrix representing the game board based on predefined masks for cell types, players, and colors.
 *
 * @returns {Array<Array<Cell>>} The matrix representing the game board, where each element is an object with properties for the cell's position, type, color, and coins.
 *
 * @example
 * import { getBoardMatrix } from './boardUtils';
 *
 * const matrix = getBoardMatrix();
 * console.log(matrix);
 * // Output:
 * // [
 * //   [
 * //     { row: 0, col: 0, id: 0, type: 'WALL', color: 'RED', coins: [] },
 * //     ...
 * //   ],
 * //   ...
 * // ]
 */
const getBoardMatrix = (): BoardMatrix => {
  const matrix: BoardMatrix = [];
  // 0 = wall
  // 1 = track
  // 2 = safe
  // 3 = safe + home
  // 4 = safe + finish
  const cellTypeMask: number[][] = [
  // 0  1  2  3  4  5  6  7  8  9 10 11 12 13 14
    [0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0], // 0
    [0, 0, 0, 0, 0, 0, 1, 2, 3, 0, 0, 0, 0, 0, 0], // 1
    [0, 0, 5, 5, 0, 0, 2, 2, 1, 0, 0, 5, 5, 0, 0], // 2
    [0, 0, 5, 5, 0, 0, 1, 2, 1, 0, 0, 5, 5, 0, 0], // 3
    [0, 0, 0, 0, 0, 0, 1, 2, 1, 0, 0, 0, 0, 0, 0], // 4
    [0, 0, 0, 0, 0, 0, 1, 2, 1, 0, 0, 0, 0, 0, 0], // 5
    [1, 3, 1, 1, 1, 1, 0, 4, 0, 1, 1, 1, 2, 1, 1], // 6
    [1, 2, 2, 2, 2, 2, 4, 0, 4, 2, 2, 2, 2, 2, 1], // 7
    [1, 1, 2, 1, 1, 1, 0, 4, 0, 1, 1, 1, 1, 3, 1], // 8
    [0, 0, 0, 0, 0, 0, 1, 2, 1, 0, 0, 0, 0, 0, 0], // 9
    [0, 0, 0, 0, 0, 0, 1, 2, 1, 0, 0, 0, 0, 0, 0], // 10
    [0, 0, 5, 5, 0, 0, 1, 2, 1, 0, 0, 5, 5, 0, 0], // 11
    [0, 0, 5, 5, 0, 0, 1, 2, 3, 0, 0, 5, 5, 0, 0], // 12
    [0, 0, 0, 0, 0, 0, 3, 2, 1, 0, 0, 0, 0, 0, 0], // 13
    [0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0], // 14
  ];

  const colorMask: number[][] = [
  // 0  1  2  3  4  5  6  7  8  9 10 11 12 13 14
    [1, 1, 1, 1, 1, 1, 0, 0, 0, 2, 2, 2, 2, 2, 2], // 0
    [1, 0, 0, 0, 0, 1, 0, 2, 2, 2, 0, 0, 0, 0, 2], // 1
    [1, 0, 1, 1, 0, 1, 0, 2, 0, 2, 0, 2, 2, 0, 2], // 2
    [1, 0, 1, 1, 0, 1, 0, 2, 0, 2, 0, 2, 2, 0, 2], // 3
    [1, 0, 0, 0, 0, 1, 0, 2, 0, 2, 0, 0, 0, 0, 2], // 4
    [1, 1, 1, 1, 1, 1, 0, 2, 0, 2, 2, 2, 2, 2, 2], // 5
    [0, 1, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0], // 6
    [0, 1, 1, 1, 1, 1, 1, 0, 3, 3, 3, 3, 3, 3, 0], // 7
    [0, 0, 0, 0, 0, 0, 0, 4, 0, 0, 0, 0, 0, 3, 0], // 8
    [4, 4, 4, 4, 4, 4, 0, 4, 0, 3, 3, 3, 3, 3, 3], // 9
    [4, 0, 0, 0, 0, 4, 0, 4, 0, 3, 0, 0, 0, 0, 3], // 10
    [4, 0, 4, 4, 0, 4, 0, 4, 0, 3, 0, 3, 3, 0, 3], // 11
    [4, 0, 4, 4, 0, 4, 0, 4, 0, 3, 0, 3, 3, 0, 3], // 12
    [4, 0, 0, 0, 0, 4, 4, 4, 0, 3, 0, 0, 0, 0, 3], // 13
    [4, 4, 4, 4, 4, 4, 0, 0, 0, 3, 3, 3, 3, 3, 3], // 14
  ];

  for (let i = 0; i < BOARD_SIZE; i++) {
    const row = [] as Array<Cell>;
    for (let j = 0; j < BOARD_SIZE; j++) {
      const cellType = cellTypeMask[i]![j];
      const color = colorMask[i]![j];

      const coin = createCoinInstance(i, j);
      const cell: Cell = {
        id: `${j}-${i}`,
        position: { row: i, col: j },
        type: CellType.WALL,
        color: getPlayerColor(),
        coins: coin ? [coin] : [],
      };

      switch (cellType) {
        case 1:
          cell.type = CellType.NORMAL;
          break;
        case 2:
          cell.type = CellType.SAFE;
          break;
        case 3:
          cell.type = CellType.START;
          break;
        case 4:
          cell.type = CellType.FINISH;
          break;
        case 5:
          cell.type = CellType.HOME;
          break;
        default:
          cell.type = CellType.WALL;
          break;
      }

      switch (color) {
        case 1:
          cell.color = getPlayerColor(PlayerId.RED);
          break;
        case 2:
          cell.color = getPlayerColor(PlayerId.GREEN);
          break;
        case 3:
          cell.color = getPlayerColor(PlayerId.YELLOW);
          break;
        case 4:
          cell.color = getPlayerColor(PlayerId.BLUE);
          break;
        default:
          cell.color = getPlayerColor();
          break;
      }

      row.push(cell);
    }
    matrix.push(row);
  }

  return matrix;
};

/**
 * Returns an array of coins present on the board.
 *
 * @param board - The matrix representing the game board, where each element is an object with properties for the cell's position, type, color, and coins.
 * @returns An array of coin objects present on the board.
 */
const getCoinsFromBoard = (board: BoardMatrix): Coin[] => {
  return board
    .map((row) => row.filter((cell) => cell.coins.length > 0))
    .flat()
    .map((cell) => cell.coins)
    .flat();
};

const getPlayerPaths = () : PlayerPaths => {
  /*
              section1 top section section 2
  section8                                   section 3 
  leftSection                                right section
  section7                                   section 4
              section6 bottom section section 5
  */


  const section1 = [
    // Bottom to top
    { row: 5, col: 6},
    { row: 4, col: 6},
    { row: 3, col: 6},
    { row: 2, col: 6},
    { row: 1, col: 6},
    { row: 0, col: 6},
  ];
  const topSection = [
    // Left to right
    { row: 0, col: 7},
  ];
  const section2 = [
    // Top to bottom
    { row: 0, col: 8},
    { row: 1, col: 8},
    { row: 2, col: 8},
    { row: 3, col: 8},
    { row: 4, col: 8},
    { row: 5, col: 8},
  ];

  const section3 = [
    // Left to right
    { row: 6, col: 9},
    { row: 6, col: 10},
    { row: 6, col: 11},
    { row: 6, col: 12},
    { row: 6, col: 13},
    { row: 6, col: 14},
  ];
  const rightSection = [
    // Top to bottom
    { row: 7, col: 14},
  ];
  const section4 = [
    // Right to left
    { row: 8, col: 14},
    { row: 8, col: 13},
    { row: 8, col: 12},
    { row: 8, col: 11},
    { row: 8, col: 10},
    { row: 8, col: 9},
  ];

  const section5 = [
    // Top to bottom
    { row: 9, col: 8},
    { row: 10, col: 8},
    { row: 11, col: 8},
    { row: 12, col: 8},
    { row: 13, col: 8},
    { row: 14, col: 8},
  ];
  const bottomSection = [
    // Right to left
    { row: 14, col: 7},
  ];
  const section6 = [
    // Bottom to top
    { row: 14, col: 6},
    { row: 13, col: 6},
    { row: 12, col: 6},
    { row: 11, col: 6},
    { row: 10, col: 6},
    { row: 9, col: 6},
  ];

  const section7 = [
    // Right to left
    { row: 8, col: 5},
    { row: 8, col: 4},
    { row: 8, col: 3},
    { row: 8, col: 2},
    { row: 8, col: 1},
    { row: 8, col: 0},
  ];
  const leftSection = [
    // Bottom to top
    { row: 7, col: 0},
  ];
  const section8 = [
    { row: 6, col: 0}, // Start
    { row: 6, col: 1}, // Start
    { row: 6, col: 2},
    { row: 6, col: 3},
    { row: 6, col: 4},
    { row: 6, col: 5},
  ];

  const redStart = section8.slice(1);
  const redFinish = [
    { row: 7, col: 1},
    { row: 7, col: 2},
    { row: 7, col: 3},
    { row: 7, col: 4},
    { row: 7, col: 5},
    { row: 7, col: 6},
  ];
  const redPositions : Array<Position> = [
    ...redStart,
    ...section1,
    ...topSection,
    ...section2,
    ...section3,
    ...rightSection,
    ...section4,
    ...section5,
    ...bottomSection,
    ...section6,
    ...section7,
    ...leftSection,
    ...redFinish,
  ]

  const greenStart = section2.slice(1);
  const greenFinish = [
    { row: 1, col: 7},
    { row: 2, col: 7},
    { row: 3, col: 7},
    { row: 4, col: 7},
    { row: 5, col: 7},
    { row: 6, col: 7},
  ]
  const greenPositions: Array<Position> = [
    ...greenStart,
    ...section3,
    ...rightSection,
    ...section4,
    ...section5,
    ...bottomSection,
    ...section6,
    ...section7,
    ...leftSection,
    ...section8,
    ...section1,
    ...topSection,
    ...greenFinish,
  ];

  const yellowStart = section4.slice(1);
  const yellowFinish = [
    { row: 7, col: 13},
    { row: 7, col: 12},
    { row: 7, col: 11},
    { row: 7, col: 10},
    { row: 7, col: 9},
    { row: 7, col: 8},
  ];
  const yellowPositions: Array<Position> = [
    ...yellowStart,
    ...section5,
    ...bottomSection,
    ...section6,
    ...section7,
    ...leftSection,
    ...section8,
    ...section1,
    ...topSection,
    ...section2,
    ...section3,
    ...rightSection,
    ...yellowFinish,
  ];

  const blueStart = section6.slice(1);
  const blueFinish = [
    { row: 13, col: 7},
    { row: 12, col: 7},
    { row: 11, col: 7},
    { row: 10, col: 7},
    { row: 9, col: 7},
    { row: 8, col: 7},
  ];
  const bluePositions: Array<Position> = [
    ...blueStart,
    ...section7,
    ...leftSection,
    ...section8,
    ...section1,
    ...topSection,
    ...section2,
    ...section3,
    ...rightSection,
    ...section4,
    ...section5,
    ...bottomSection,
    ...blueFinish,
  ];


  return {
    [PlayerId.RED]: redPositions,
    [PlayerId.GREEN]: greenPositions,
    [PlayerId.YELLOW]: yellowPositions,
    [PlayerId.BLUE]: bluePositions,
  };
}

export {
  BOARD_SIZE,
  createCoinInstance,
  getBoardMatrix,
  getCellCenter,
  getClickedCell,
  getPlayerColor,
  getCoinsFromBoard,
  getPlayerPaths,
};

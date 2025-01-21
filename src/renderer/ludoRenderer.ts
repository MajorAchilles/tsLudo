import { BOARD_SIZE, getCellCenter, getPlayerColor } from "../data/data.helpers";
import { CellType, Colors, PlayerId } from "../data/enums";
import { Vertex } from "../data/baseTypes";
import { easeInOut, fillCircle, fillTriangle, strokeCircle, strokeTriangle } from "./helper";
import { LudoGameState } from "../data/derivedTypes";

declare global {
  interface Window {
    TS_LUDO_ANIMATION_START_TIME?: number;
  }
}

/**
 * Renders a coin on the canvas.
 * @param context - The 2D rendering context of the canvas.
 * @param positionCenter - The center coordinates of the coin.
 * @param playerType - The type of player associated with the coin.
 * @param cellSize - The size of the cell on the game board.
 */
const renderCoin = (
  context: CanvasRenderingContext2D,
  positionCenter: Vertex,
  playerType: PlayerId,
  cellSize: number
) => {
  context.shadowColor = Colors.BLACK;
  context.shadowBlur = 10;
  fillCircle(
    positionCenter,
    cellSize / 2.6,
    getPlayerColor(playerType),
    context
  );
  strokeCircle(positionCenter, cellSize / 2.6, 1, Colors.BLACK, context);
  strokeCircle(positionCenter, cellSize / 3, 1, Colors.BLACK, context);
  strokeCircle(positionCenter, cellSize / 10, 1, Colors.BLACK, context);
  strokeCircle(positionCenter, cellSize / 20, 1, Colors.BLACK, context);
  context.shadowColor = Colors.TRANSPARENT_LITERAL;
  context.shadowBlur = 0;
};

/**
 * Renders the game board on the canvas.
 * @param context - The 2D rendering context of the canvas.
 * @param boardSize - The size of the game board.
 * @param gameState - The current state of the game.
 * @param cellSize - The size of each cell on the game board.
 */
const renderBoard = async (
  context: CanvasRenderingContext2D,
  boardSize: number,
  gameState: LudoGameState,
  cellSize: number
) => {
  context.fillStyle = Colors.WHITE;
  context.fillRect(0, 0, boardSize, boardSize);
  const { board } = gameState;

  // Render the cells, home, and track
  for (let i = 0; i < BOARD_SIZE; i++) {
    for (let j = 0; j < BOARD_SIZE; j++) {
      const cell = board![i]![j];

      if (!cell) continue;

      context.fillStyle = cell.color;
      context.fillRect(j * cellSize, i * cellSize, cellSize, cellSize);
      context.strokeStyle = Colors.BLACK;
      context.lineWidth = 0.3;
      context.strokeRect(j * cellSize, i * cellSize, cellSize, cellSize);

      if (
        cell.type === CellType.START ||
        (cell.type === CellType.SAFE)
      ) {
        const center = {
          x: j * cellSize + cellSize / 2,
          y: i * cellSize + cellSize / 2,
        };
        strokeCircle(center, cellSize / 2.5, 2.5, Colors.BLACK, context);
        strokeCircle(center, cellSize / 3, 1, Colors.BLACK, context);
        strokeCircle(center, cellSize / 3.7, 1, Colors.BLACK, context);
        strokeCircle(center, cellSize / 5, 1, Colors.BLACK, context);
        strokeCircle(center, cellSize / 9, 1, Colors.BLACK, context);
        strokeCircle(center, cellSize / 30, 1, Colors.BLACK, context);
        strokeCircle(center, cellSize / 50, 5, Colors.BLACK, context);
      }
    }
  }

  // Render the finish zone
  const [r1, r2, r3] = [
    { x: cellSize * 6, y: cellSize * 6 },
    { x: cellSize * 6, y: cellSize * 9 },
    { x: cellSize * 7.5, y: cellSize * 7.5 },
  ];
  const [g1, g2, g3] = [
    { x: cellSize * 6, y: cellSize * 6 },
    { x: cellSize * 9, y: cellSize * 6 },
    { x: cellSize * 7.5, y: cellSize * 7.5 },
  ];
  const [b1, b2, b3] = [
    { x: cellSize * 9, y: cellSize * 6 },
    { x: cellSize * 9, y: cellSize * 9 },
    { x: cellSize * 7.5, y: cellSize * 7.5 },
  ];
  const [y1, y2, y3] = [
    { x: cellSize * 6, y: cellSize * 9 },
    { x: cellSize * 9, y: cellSize * 9 },
    { x: cellSize * 7.5, y: cellSize * 7.5 },
  ];
  fillTriangle(r1, r2, r3, getPlayerColor(PlayerId.RED), context);
  fillTriangle(g1, g2, g3, getPlayerColor(PlayerId.GREEN), context);
  fillTriangle(b1, b2, b3, getPlayerColor(PlayerId.YELLOW), context);
  fillTriangle(y1, y2, y3, getPlayerColor(PlayerId.BLUE), context);

  strokeTriangle(r1, r2, r3, 0.3, Colors.BLACK, context);
  strokeTriangle(g1, g2, g3, 0.3, Colors.BLACK, context);
  strokeTriangle(b1, b2, b3, 0.3, Colors.BLACK, context);
  strokeTriangle(y1, y2, y3, 0.3, Colors.BLACK, context);

  // Render the board outline
  context.strokeStyle = Colors.BLACK;
  context.lineWidth = 5;
  context.strokeRect(0, 0, boardSize, boardSize);

  // Render the cells, home, and track
  for (let i = 0; i < BOARD_SIZE; i++) {
    for (let j = 0; j < BOARD_SIZE; j++) {
      const cell = board![i]![j];

      if (!cell) continue;

      cell.coins?.forEach((coin) => {
        const center = getCellCenter(cell, cellSize);
        renderCoin(context, center, coin.playerId, cellSize);
      });
    }
  }
};

/**
 * Renders an animation path on the canvas.
 * @param context - The 2D rendering context of the canvas.
 * @param start - The starting vertex of the path.
 * @param end - The ending vertex of the path.
 */
const renderAnimationPath = async (
  context: CanvasRenderingContext2D,
  start: Vertex,
  end: Vertex
) => {
  context.beginPath();
  context.moveTo(start.x, start.y);
  context.lineTo(end.x, end.y);
  context.lineWidth = 5;
  context.strokeStyle = Colors.BLACK;
  context.stroke();
  context.closePath();

  context.beginPath();
  context.moveTo(start.x, start.y);
  context.lineTo(end.x, end.y);
  context.lineWidth = 2;
  context.strokeStyle = 'white';
  context.stroke();
  context.closePath();
};


const animateCoins = async (
  context: CanvasRenderingContext2D,
  animationPath: Vertex[],
  _gameState: LudoGameState,
  cellSize: number,
  _frameCount: number,
  renderPath: boolean,
  animationDuration: number,
  onAnimationComplete: () => void
) => {
  if (animationPath.length < 2) return;
  const start = animationPath[0]!;
  const end = animationPath[1]!;

  if (renderPath) {
    renderAnimationPath(context, start, end);
  }

  if (!window.TS_LUDO_ANIMATION_START_TIME) {
    window.TS_LUDO_ANIMATION_START_TIME = performance.now();
  } else {
    const currentTime = performance.now();
    const timeElapsed = currentTime - window.TS_LUDO_ANIMATION_START_TIME;
    if (timeElapsed > animationDuration) {
      window.TS_LUDO_ANIMATION_START_TIME = undefined;
      onAnimationComplete();
      return;
    }

    const easeOutFactor = easeInOut(timeElapsed / animationDuration);

    const nextPosition = {
      x: start.x + (end.x - start.x) * easeOutFactor,
      y: start.y + (end.y - start.y) * easeOutFactor,
    };
    renderCoin(context, nextPosition, PlayerId.RED, cellSize);
  }
};

const renderLudo = (
  context: CanvasRenderingContext2D,
  gameState: LudoGameState,
  height: number,
  width: number,
  frameCount: number,
  animationPath: Vertex[],
  animationTime: number,
  onAnimationComplete: () => void
) => {
  const side = Math.min(height, width);
  const cellSize: number = side / BOARD_SIZE;
  const boardSize: number = cellSize * BOARD_SIZE;
  context.imageSmoothingEnabled = true;
  context.imageSmoothingQuality = 'high';

  // Clear canvas
  renderBoard(context, boardSize, gameState, cellSize);

  if (animationPath.length > 0 && gameState.started) {
    animateCoins(
      context,
      animationPath,
      gameState,
      cellSize,
      frameCount,
      true,
      animationTime,
      onAnimationComplete
    );
  }
};

export {
  renderBoard,
  renderLudo,
};

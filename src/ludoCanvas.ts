const initGame = (
  canvas: HTMLCanvasElement,
  width: number,
  height: number,
) : void => {
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.fillStyle = 'red';
    ctx.fillRect(0, 0, width, height);
  }
};

export {
  initGame,
}
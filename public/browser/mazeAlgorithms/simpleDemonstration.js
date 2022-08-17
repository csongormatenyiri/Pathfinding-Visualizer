const simpleDemonstration = (board) => {
  const currentIdY = board.width - 10;
  for (let counter = 0; counter < 7; counter++) {
    const currentIdXOne = Math.floor(board.height / 2) - counter;
    const currentIdXTwo = Math.floor(board.height / 2) + counter;
    const currentIdOne = `${currentIdXOne}-${currentIdY}`;
    const currentIdTwo = `${currentIdXTwo}-${currentIdY}`;
    const currentElementOne = document.getElementById(currentIdOne);
    const currentElementTwo = document.getElementById(currentIdTwo);
    board.wallsToAnimate.push(currentElementOne);
    board.wallsToAnimate.push(currentElementTwo);
    const currentNodeOne = board.nodes[currentIdOne];
    const currentNodeTwo = board.nodes[currentIdTwo];
    currentNodeOne.status = 'wall';
    currentNodeOne.weight = 0;
    currentNodeTwo.status = 'wall';
    currentNodeTwo.weight = 0;
  }
};

module.exports = simpleDemonstration;

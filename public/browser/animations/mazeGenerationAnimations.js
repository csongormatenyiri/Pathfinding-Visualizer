const mazeGenerationAnimations = (board) => {
  const nodes = board.wallsToAnimate.slice(0);
  const speed = board.speed === 'fast' ? 5 : board.speed === 'average' ? 25 : 75;

  const timeout = (index) => {
    setTimeout(() => {
      if (index === nodes.length) {
        board.wallsToAnimate = [];
        board.toggleButtons();
        return;
      }
      nodes[index].className = board.nodes[nodes[index].id].weight === 15 ? 'unvisited weight' : 'wall';
      timeout(index + 1);
    }, speed);
  };

  timeout(0);
};

module.exports = mazeGenerationAnimations;

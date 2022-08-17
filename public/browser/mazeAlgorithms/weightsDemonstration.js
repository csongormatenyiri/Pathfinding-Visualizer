const weightsDemonstration = (board) => {
  let currentIdX = board.height - 1;
  const currentIdY = 35;
  while (currentIdX > 5) {
    const currentId = `${currentIdX}-${currentIdY}`;
    const currentElement = document.getElementById(currentId);
    board.wallsToAnimate.push(currentElement);
    const currentNode = board.nodes[currentId];
    currentNode.status = 'wall';
    currentNode.weight = 0;
    currentIdX--;
  }
  for (let currentIdX = board.height - 2; currentIdX > board.height - 11; currentIdX--) {
    for (let currentIdY = 1; currentIdY < 35; currentIdY++) {
      const currentId = `${currentIdX}-${currentIdY}`;
      const currentElement = document.getElementById(currentId);
      board.wallsToAnimate.push(currentElement);
      const currentNode = board.nodes[currentId];
      if (currentIdX === board.height - 2 && currentIdY < 35 && currentIdY > 26) {
        currentNode.status = 'wall';
        currentNode.weight = 0;
      } else {
        currentNode.status = 'unvisited';
        currentNode.weight = 15;
      }
    }
  }
};

module.exports = weightsDemonstration;

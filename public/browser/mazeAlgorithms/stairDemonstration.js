const stairDemonstration = (board) => {
  let currentIdX = board.height - 1;
  let currentIdY = 0;
  const relevantStatuses = ['start', 'target', 'object'];
  while (currentIdX > 0 && currentIdY < board.width) {
    const currentId = `${currentIdX}-${currentIdY}`;
    const currentNode = board.nodes[currentId];
    const currentHTMLNode = document.getElementById(currentId);
    if (!relevantStatuses.includes(currentNode.status)) {
      currentNode.status = 'wall';
      board.wallsToAnimate.push(currentHTMLNode);
    }
    currentIdX--;
    currentIdY++;
  }
  while (currentIdX < board.height - 2 && currentIdY < board.width) {
    const currentId = `${currentIdX}-${currentIdY}`;
    const currentNode = board.nodes[currentId];
    const currentHTMLNode = document.getElementById(currentId);
    if (!relevantStatuses.includes(currentNode.status)) {
      currentNode.status = 'wall';
      board.wallsToAnimate.push(currentHTMLNode);
    }
    currentIdX++;
    currentIdY++;
  }
  while (currentIdX > 0 && currentIdY < board.width - 1) {
    const currentId = `${currentIdX}-${currentIdY}`;
    const currentNode = board.nodes[currentId];
    const currentHTMLNode = document.getElementById(currentId);
    if (!relevantStatuses.includes(currentNode.status)) {
      currentNode.status = 'wall';
      board.wallsToAnimate.push(currentHTMLNode);
    }
    currentIdX--;
    currentIdY++;
  }
};

module.exports = stairDemonstration;

const getNeighbors = (id, nodes, boardArray, name) => {
  const coordinates = id.split('-');
  const x = parseInt(coordinates[0]);
  const y = parseInt(coordinates[1]);
  const neighbors = [];
  let potentialNeighbor;
  if (boardArray[x - 1] && boardArray[x - 1][y]) {
    potentialNeighbor = `${(x - 1).toString()}-${y.toString()}`;
    if (nodes[potentialNeighbor].status !== 'wall') {
      if (name === 'bfs') {
        neighbors.push(potentialNeighbor);
      } else {
        neighbors.unshift(potentialNeighbor);
      }
    }
  }
  if (boardArray[x][y + 1]) {
    potentialNeighbor = `${x.toString()}-${(y + 1).toString()}`;
    if (nodes[potentialNeighbor].status !== 'wall') {
      if (name === 'bfs') {
        neighbors.push(potentialNeighbor);
      } else {
        neighbors.unshift(potentialNeighbor);
      }
    }
  }
  if (boardArray[x + 1] && boardArray[x + 1][y]) {
    potentialNeighbor = `${(x + 1).toString()}-${y.toString()}`;
    if (nodes[potentialNeighbor].status !== 'wall') {
      if (name === 'bfs') {
        neighbors.push(potentialNeighbor);
      } else {
        neighbors.unshift(potentialNeighbor);
      }
    }
  }
  if (boardArray[x][y - 1]) {
    potentialNeighbor = `${x.toString()}-${(y - 1).toString()}`;
    if (nodes[potentialNeighbor].status !== 'wall') {
      if (name === 'bfs') {
        neighbors.push(potentialNeighbor);
      } else {
        neighbors.unshift(potentialNeighbor);
      }
    }
  }
  return neighbors;
};

const unweightedSearchAlgorithm = (nodes, start, target, nodesToAnimate, boardArray, name) => {
  if (!start || !target || start === target) {
    return false;
  }
  const structure = [nodes[start]];
  const exploredNodes = { start: true };
  while (structure.length) {
    const currentNode = name === 'bfs' ? structure.shift() : structure.pop();
    nodesToAnimate.push(currentNode);
    if (name === 'dfs') exploredNodes[currentNode.id] = true;
    currentNode.status = 'visited';
    if (currentNode.id === target) {
      return 'success';
    }
    const currentNeighbors = getNeighbors(currentNode.id, nodes, boardArray, name);
    currentNeighbors.forEach((neighbor) => {
      if (!exploredNodes[neighbor]) {
        if (name === 'bfs') exploredNodes[neighbor] = true;
        nodes[neighbor].previousNode = currentNode.id;
        structure.push(nodes[neighbor]);
      }
    });
  }
  return false;
};

module.exports = unweightedSearchAlgorithm;

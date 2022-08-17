const astar = require('./astar');

const getDistance = (nodeOne, nodeTwo) => {
  const currentCoordinates = nodeOne.id.split('-');
  const targetCoordinates = nodeTwo.id.split('-');
  const x1 = parseInt(currentCoordinates[0]);
  const y1 = parseInt(currentCoordinates[1]);
  const x2 = parseInt(targetCoordinates[0]);
  const y2 = parseInt(targetCoordinates[1]);
  if (x2 < x1) {
    if (nodeOne.direction === 'up') {
      return [1, ['f'], 'up'];
    } else if (nodeOne.direction === 'right') {
      return [2, ['l', 'f'], 'up'];
    } else if (nodeOne.direction === 'left') {
      return [2, ['r', 'f'], 'up'];
    } else if (nodeOne.direction === 'down') {
      return [3, ['r', 'r', 'f'], 'up'];
    }
  } else if (x2 > x1) {
    if (nodeOne.direction === 'up') {
      return [3, ['r', 'r', 'f'], 'down'];
    } else if (nodeOne.direction === 'right') {
      return [2, ['r', 'f'], 'down'];
    } else if (nodeOne.direction === 'left') {
      return [2, ['l', 'f'], 'down'];
    } else if (nodeOne.direction === 'down') {
      return [1, ['f'], 'down'];
    }
  }
  if (y2 < y1) {
    if (nodeOne.direction === 'up') {
      return [2, ['l', 'f'], 'left'];
    } else if (nodeOne.direction === 'right') {
      return [3, ['l', 'l', 'f'], 'left'];
    } else if (nodeOne.direction === 'left') {
      return [1, ['f'], 'left'];
    } else if (nodeOne.direction === 'down') {
      return [2, ['r', 'f'], 'left'];
    }
  } else if (y2 > y1) {
    if (nodeOne.direction === 'up') {
      return [2, ['r', 'f'], 'right'];
    } else if (nodeOne.direction === 'right') {
      return [1, ['f'], 'right'];
    } else if (nodeOne.direction === 'left') {
      return [3, ['r', 'r', 'f'], 'right'];
    } else if (nodeOne.direction === 'down') {
      return [2, ['l', 'f'], 'right'];
    }
  }
};

const manhattanDistance = (nodeOne, nodeTwo) => {
  const nodeOneCoordinates = nodeOne.id.split('-').map((ele) => parseInt(ele));
  const nodeTwoCoordinates = nodeTwo.id.split('-').map((ele) => parseInt(ele));
  const xChange = Math.abs(nodeOneCoordinates[0] - nodeTwoCoordinates[0]);
  const yChange = Math.abs(nodeOneCoordinates[1] - nodeTwoCoordinates[1]);
  return xChange + yChange;
};

const getNeighbors = (id, nodes, boardArray) => {
  const coordinates = id.split('-');
  const x = parseInt(coordinates[0]);
  const y = parseInt(coordinates[1]);
  const neighbors = [];
  let potentialNeighbor;
  if (boardArray[x - 1] && boardArray[x - 1][y]) {
    potentialNeighbor = `${(x - 1).toString()}-${y.toString()}`;
    if (nodes[potentialNeighbor].status !== 'wall') neighbors.push(potentialNeighbor);
  }
  if (boardArray[x + 1] && boardArray[x + 1][y]) {
    potentialNeighbor = `${(x + 1).toString()}-${y.toString()}`;
    if (nodes[potentialNeighbor].status !== 'wall') neighbors.push(potentialNeighbor);
  }
  if (boardArray[x][y - 1]) {
    potentialNeighbor = `${x.toString()}-${(y - 1).toString()}`;
    if (nodes[potentialNeighbor].status !== 'wall') neighbors.push(potentialNeighbor);
  }
  if (boardArray[x][y + 1]) {
    potentialNeighbor = `${x.toString()}-${(y + 1).toString()}`;
    if (nodes[potentialNeighbor].status !== 'wall') neighbors.push(potentialNeighbor);
  }
  return neighbors;
};

const closestNode = (nodes, unvisitedNodes) => {
  let currentClosest;
  let index;
  for (let i = 0; i < unvisitedNodes.length; i++) {
    if (!currentClosest || currentClosest.distance > nodes[unvisitedNodes[i]].distance) {
      currentClosest = nodes[unvisitedNodes[i]];
      index = i;
    }
  }
  unvisitedNodes.splice(index, 1);
  return currentClosest;
};

const updateNode = (currentNode, targetNode, actualTargetNode, name, heuristic) => {
  const distance = getDistance(currentNode, targetNode);
  let distanceToCompare;
  if (actualTargetNode && name === 'CLA') {
    const weight = targetNode.weight === 15 ? 15 : 1;
    if (heuristic === 'manhattanDistance') {
      distanceToCompare = currentNode.distance + (distance[0] + weight) * manhattanDistance(targetNode, actualTargetNode);
    } else if (heuristic === 'poweredManhattanDistance') {
      distanceToCompare = currentNode.distance + targetNode.weight + distance[0] + Math.pow(manhattanDistance(targetNode, actualTargetNode), 2);
    } else if (heuristic === 'extraPoweredManhattanDistance') {
      distanceToCompare = currentNode.distance + (distance[0] + weight) * Math.pow(manhattanDistance(targetNode, actualTargetNode), 7);
    }
  } else if (actualTargetNode && name === 'greedy') {
    distanceToCompare = targetNode.weight + distance[0] + manhattanDistance(targetNode, actualTargetNode);
  } else {
    distanceToCompare = currentNode.distance + targetNode.weight + distance[0];
  }
  if (distanceToCompare < targetNode.distance) {
    targetNode.distance = distanceToCompare;
    targetNode.previousNode = currentNode.id;
    targetNode.path = distance[1];
    targetNode.direction = distance[2];
  }
};

const updateNeighbors = (nodes, node, boardArray, target, name, heuristic) => {
  const neighbors = getNeighbors(node.id, nodes, boardArray);
  for (const neighbor of neighbors) {
    if (target) {
      updateNode(node, nodes[neighbor], nodes[target], name, heuristic);
    } else {
      updateNode(node, nodes[neighbor]);
    }
  }
};

const weightedSearchAlgorithm = (nodes, start, target, nodesToAnimate, boardArray, name, heuristic) => {
  if (name === 'astar') return astar(nodes, start, target, nodesToAnimate, boardArray);
  if (!start || !target || start === target) {
    return false;
  }
  nodes[start].distance = 0;
  nodes[start].direction = 'right';
  const unvisitedNodes = Object.keys(nodes);
  while (unvisitedNodes.length) {
    let currentNode = closestNode(nodes, unvisitedNodes);
    while (currentNode.status === 'wall' && unvisitedNodes.length) {
      currentNode = closestNode(nodes, unvisitedNodes);
    }
    if (currentNode.distance === Infinity) {
      return false;
    }
    nodesToAnimate.push(currentNode);
    currentNode.status = 'visited';
    if (currentNode.id === target) return 'success!';
    if (name === 'CLA' || name === 'greedy') {
      updateNeighbors(nodes, currentNode, boardArray, target, name, heuristic);
    } else if (name === 'dijkstra') {
      updateNeighbors(nodes, currentNode, boardArray);
    }
  }
};

module.exports = weightedSearchAlgorithm;

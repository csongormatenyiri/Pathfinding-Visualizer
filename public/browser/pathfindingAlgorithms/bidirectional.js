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

const getDistanceTwo = (nodeOne, nodeTwo) => {
  const currentCoordinates = nodeOne.id.split('-');
  const targetCoordinates = nodeTwo.id.split('-');
  const x1 = parseInt(currentCoordinates[0]);
  const y1 = parseInt(currentCoordinates[1]);
  const x2 = parseInt(targetCoordinates[0]);
  const y2 = parseInt(targetCoordinates[1]);
  if (x2 < x1) {
    if (nodeOne.otherdirection === 'up') {
      return [1, ['f'], 'up'];
    } else if (nodeOne.otherdirection === 'right') {
      return [2, ['l', 'f'], 'up'];
    } else if (nodeOne.otherdirection === 'left') {
      return [2, ['r', 'f'], 'up'];
    } else if (nodeOne.otherdirection === 'down') {
      return [3, ['r', 'r', 'f'], 'up'];
    }
  } else if (x2 > x1) {
    if (nodeOne.otherdirection === 'up') {
      return [3, ['r', 'r', 'f'], 'down'];
    } else if (nodeOne.otherdirection === 'right') {
      return [2, ['r', 'f'], 'down'];
    } else if (nodeOne.otherdirection === 'left') {
      return [2, ['l', 'f'], 'down'];
    } else if (nodeOne.otherdirection === 'down') {
      return [1, ['f'], 'down'];
    }
  }
  if (y2 < y1) {
    if (nodeOne.otherdirection === 'up') {
      return [2, ['l', 'f'], 'left'];
    } else if (nodeOne.otherdirection === 'right') {
      return [3, ['l', 'l', 'f'], 'left'];
    } else if (nodeOne.otherdirection === 'left') {
      return [1, ['f'], 'left'];
    } else if (nodeOne.otherdirection === 'down') {
      return [2, ['r', 'f'], 'left'];
    }
  } else if (y2 > y1) {
    if (nodeOne.otherdirection === 'up') {
      return [2, ['r', 'f'], 'right'];
    } else if (nodeOne.otherdirection === 'right') {
      return [1, ['f'], 'right'];
    } else if (nodeOne.otherdirection === 'left') {
      return [3, ['r', 'r', 'f'], 'right'];
    } else if (nodeOne.otherdirection === 'down') {
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

const closestNodeTwo = (nodes, unvisitedNodes) => {
  let currentClosest;
  let index;
  for (let i = 0; i < unvisitedNodes.length; i++) {
    if (!currentClosest || currentClosest.otherdistance > nodes[unvisitedNodes[i]].otherdistance) {
      currentClosest = nodes[unvisitedNodes[i]];
      index = i;
    }
  }
  unvisitedNodes.splice(index, 1);
  return currentClosest;
};

const updateNode = (currentNode, targetNode, actualTargetNode) => {
  const distance = getDistance(currentNode, targetNode);
  const weight = targetNode.weight === 15 ? 15 : 1;
  const distanceToCompare = currentNode.distance + (weight + distance[0]) * manhattanDistance(targetNode, actualTargetNode);
  if (distanceToCompare < targetNode.distance) {
    targetNode.distance = distanceToCompare;
    targetNode.previousNode = currentNode.id;
    targetNode.path = distance[1];
    targetNode.direction = distance[2];
  }
};

const updateNodeTwo = (currentNode, targetNode, actualTargetNode) => {
  const distance = getDistanceTwo(currentNode, targetNode);
  const weight = targetNode.weight === 15 ? 15 : 1;
  const distanceToCompare = currentNode.otherdistance + (weight + distance[0]) * manhattanDistance(targetNode, actualTargetNode);
  if (distanceToCompare < targetNode.otherdistance) {
    targetNode.otherdistance = distanceToCompare;
    targetNode.otherpreviousNode = currentNode.id;
    targetNode.path = distance[1];
    targetNode.otherdirection = distance[2];
  }
};

const updateNeighbors = (nodes, node, boardArray, target) => {
  const neighbors = getNeighbors(node.id, nodes, boardArray);
  for (const neighbor of neighbors) {
    updateNode(node, nodes[neighbor], nodes[target]);
  }
};

const updateNeighborsTwo = (nodes, node, boardArray, target) => {
  const neighbors = getNeighbors(node.id, nodes, boardArray);
  for (const neighbor of neighbors) {
    updateNodeTwo(node, nodes[neighbor], nodes[target]);
  }
};

const bidirectional = (nodes, start, target, nodesToAnimate, boardArray, name, board) => {
  if (name === 'astar') return astar(nodes, start, target, nodesToAnimate, boardArray, name);
  if (!start || !target || start === target) {
    return false;
  }
  nodes[start].distance = 0;
  nodes[start].direction = 'right';
  nodes[target].otherdistance = 0;
  nodes[target].otherdirection = 'left';
  const visitedNodes = {};
  const unvisitedNodesOne = Object.keys(nodes);
  const unvisitedNodesTwo = Object.keys(nodes);
  while (unvisitedNodesOne.length && unvisitedNodesTwo.length) {
    let currentNode = closestNode(nodes, unvisitedNodesOne);
    let secondCurrentNode = closestNodeTwo(nodes, unvisitedNodesTwo);
    while ((currentNode.status === 'wall' || secondCurrentNode.status === 'wall') && unvisitedNodesOne.length && unvisitedNodesTwo.length) {
      if (currentNode.status === 'wall') currentNode = closestNode(nodes, unvisitedNodesOne);
      if (secondCurrentNode.status === 'wall') secondCurrentNode = closestNodeTwo(nodes, unvisitedNodesTwo);
    }
    if (currentNode.distance === Infinity || secondCurrentNode.otherdistance === Infinity) {
      return false;
    }
    nodesToAnimate.push(currentNode);
    nodesToAnimate.push(secondCurrentNode);
    currentNode.status = 'visited';
    secondCurrentNode.status = 'visited';
    if (visitedNodes[currentNode.id]) {
      board.middleNode = currentNode.id;
      return 'success';
    } else if (visitedNodes[secondCurrentNode.id]) {
      board.middleNode = secondCurrentNode.id;
      return 'success';
    } else if (currentNode === secondCurrentNode) {
      board.middleNode = secondCurrentNode.id;
      return 'success';
    }
    visitedNodes[currentNode.id] = true;
    visitedNodes[secondCurrentNode.id] = true;
    updateNeighbors(nodes, currentNode, boardArray, target);
    updateNeighborsTwo(nodes, secondCurrentNode, boardArray, start);
  }
};

module.exports = bidirectional;

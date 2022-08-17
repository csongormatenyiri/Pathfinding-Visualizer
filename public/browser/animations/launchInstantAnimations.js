const weightedSearchAlgorithm = require('../pathfindingAlgorithms/weightedSearchAlgorithm');
const unweightedSearchAlgorithm = require('../pathfindingAlgorithms/unweightedSearchAlgorithm');

const launchInstantAnimations = (board, success, type, object, algorithm, heuristic) => {
  const change = (node) => {
    const relevantClassNames = ['start', 'shortest-path', 'instantshortest-path', 'instantshortest-path weight'];
    const previousHTMLNode = document.getElementById(node.id);
    if (!relevantClassNames.includes(previousHTMLNode.className)) {
      if (object) {
        previousHTMLNode.className = node.weight === 15 ? 'instantvisitedobject weight' : 'instantvisitedobject';
      } else {
        previousHTMLNode.className = node.weight === 15 ? 'instantvisited weight' : 'instantvisited';
      }
    }
  };

  const shortestPathChange = (currentNode, previousNode) => {
    const currentHTMLNode = document.getElementById(currentNode.id);
    if (type === 'unweighted') {
      currentHTMLNode.className = 'shortest-path-unweighted';
    } else {
      if (currentNode.direction === 'up') {
        currentHTMLNode.className = 'shortest-path-up';
      } else if (currentNode.direction === 'down') {
        currentHTMLNode.className = 'shortest-path-down';
      } else if (currentNode.direction === 'right') {
        currentHTMLNode.className = 'shortest-path-right';
      } else if (currentNode.direction === 'left') {
        currentHTMLNode.className = 'shortest-path-left';
      }
    }
    if (previousNode) {
      const previousHTMLNode = document.getElementById(previousNode.id);
      previousHTMLNode.className = previousNode.weight === 15 ? 'instantshortest-path weight' : 'instantshortest-path';
    } else {
      const element = document.getElementById(board.start);
      element.className = 'startTransparent';
    }
  };

  const nodes = object ? board.objectNodesToAnimate.slice(0) : board.nodesToAnimate.slice(0);
  let shortestNodes;
  for (let i = 0; i < nodes.length; i++) {
    if (i !== 0) {
      change(nodes[i - 1]);
    }
  }
  if (object) {
    board.objectNodesToAnimate = [];
    if (success) {
      board.drawShortestPath(board.object, board.start, 'object');
      board.clearNodeStatuses();
      let newSuccess;
      if (type === 'weighted') {
        newSuccess = weightedSearchAlgorithm(board.nodes, board.object, board.target, board.nodesToAnimate, board.boardArray, algorithm, heuristic);
      } else {
        newSuccess = unweightedSearchAlgorithm(board.nodes, board.object, board.target, board.nodesToAnimate, board.boardArray, algorithm);
      }
      launchInstantAnimations(board, newSuccess, type);
      shortestNodes = board.objectShortestPathNodesToAnimate.concat(board.shortestPathNodesToAnimate);
    } else {
      console.log('Failure.');
      board.reset();
      return;
    }
  } else {
    board.nodesToAnimate = [];
    if (success) {
      if (board.isObject) {
        board.drawShortestPath(board.target, board.object);
      } else {
        board.drawShortestPath(board.target, board.start);
      }
      shortestNodes = board.objectShortestPathNodesToAnimate.concat(board.shortestPathNodesToAnimate);
    } else {
      console.log('Failure');
      board.reset();
      return;
    }
  }

  let j;
  for (j = 0; j < shortestNodes.length; j++) {
    if (j === 0) {
      shortestPathChange(shortestNodes[j]);
    } else {
      shortestPathChange(shortestNodes[j], shortestNodes[j - 1]);
    }
  }
  board.reset();
  if (object) {
    shortestPathChange(board.nodes[board.target], shortestNodes[j - 1]);
    board.objectShortestPathNodesToAnimate = [];
    board.shortestPathNodesToAnimate = [];
    board.clearNodeStatuses();
    let newSuccess;
    if (type === 'weighted') {
      newSuccess = weightedSearchAlgorithm(board.nodes, board.object, board.target, board.nodesToAnimate, board.boardArray, algorithm);
    } else {
      newSuccess = unweightedSearchAlgorithm(board.nodes, board.object, board.target, board.nodesToAnimate, board.boardArray, algorithm);
    }
    launchInstantAnimations(board, newSuccess, type);
  } else {
    shortestPathChange(board.nodes[board.target], shortestNodes[j - 1]);
    board.objectShortestPathNodesToAnimate = [];
    board.shortestPathNodesToAnimate = [];
  }
};

module.exports = launchInstantAnimations;

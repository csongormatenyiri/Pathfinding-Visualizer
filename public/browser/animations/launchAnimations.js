const weightedSearchAlgorithm = require('../pathfindingAlgorithms/weightedSearchAlgorithm');
const unweightedSearchAlgorithm = require('../pathfindingAlgorithms/unweightedSearchAlgorithm');

const launchAnimations = (board, success, type, object, algorithm, heuristic) => {
  const nodes = object ? board.objectNodesToAnimate.slice(0) : board.nodesToAnimate.slice(0);
  const speed = board.speed === 'fast' ? 0 : board.speed === 'average' ? 100 : 500;

  const change = (currentNode, previousNode, bidirectional) => {
    const currentHTMLNode = document.getElementById(currentNode.id);
    const relevantClassNames = ['start', 'target', 'object', 'visitedStartNodeBlue', 'visitedStartNodePurple', 'visitedObjectNode', 'visitedTargetNodePurple', 'visitedTargetNodeBlue'];
    if (!relevantClassNames.includes(currentHTMLNode.className)) {
      currentHTMLNode.className = !bidirectional ? 'current' : currentNode.weight === 15 ? 'visited weight' : 'visited';
    }
    if (currentHTMLNode.className === 'visitedStartNodePurple' && !object) {
      currentHTMLNode.className = 'visitedStartNodeBlue';
    }
    if (currentHTMLNode.className === 'target' && object) {
      currentHTMLNode.className = 'visitedTargetNodePurple';
    }
    if (previousNode) {
      const previousHTMLNode = document.getElementById(previousNode.id);
      if (!relevantClassNames.includes(previousHTMLNode.className)) {
        if (object) {
          previousHTMLNode.className = previousNode.weight === 15 ? 'visitedobject weight' : 'visitedobject';
        } else {
          previousHTMLNode.className = previousNode.weight === 15 ? 'visited weight' : 'visited';
        }
      }
    }
  };

  const timeout = (index) => {
    setTimeout(() => {
      if (index === nodes.length) {
        if (object) {
          board.objectNodesToAnimate = [];
          if (success) {
            board.addShortestPath(board.object, board.start, 'object');
            board.clearNodeStatuses();
            let newSuccess;
            if (board.currentAlgorithm === 'bidirectional') {
            } else {
              if (type === 'weighted') {
                newSuccess = weightedSearchAlgorithm(board.nodes, board.object, board.target, board.nodesToAnimate, board.boardArray, algorithm, heuristic);
              } else {
                newSuccess = unweightedSearchAlgorithm(board.nodes, board.object, board.target, board.nodesToAnimate, board.boardArray, algorithm);
              }
            }
            document.getElementById(board.object).className = 'visitedObjectNode';
            launchAnimations(board, newSuccess, type);
            return;
          } else {
            console.log('Failure.');
            board.reset();
            board.toggleButtons();
            return;
          }
        } else {
          board.nodesToAnimate = [];
          if (success) {
            if (document.getElementById(board.target).className !== 'visitedTargetNodeBlue') {
              document.getElementById(board.target).className = 'visitedTargetNodeBlue';
            }
            if (board.isObject) {
              board.addShortestPath(board.target, board.object);
              board.drawShortestPathTimeout(board.target, board.object, type, 'object');
              board.objectShortestPathNodesToAnimate = [];
              board.shortestPathNodesToAnimate = [];
              board.reset('objectNotTransparent');
            } else {
              board.drawShortestPathTimeout(board.target, board.start, type);
              board.objectShortestPathNodesToAnimate = [];
              board.shortestPathNodesToAnimate = [];
              board.reset();
            }
            shortestNodes = board.objectShortestPathNodesToAnimate.concat(board.shortestPathNodesToAnimate);
            return;
          } else {
            console.log('Failure.');
            board.reset();
            board.toggleButtons();
            return;
          }
        }
      } else if (index === 0) {
        if (object) {
          document.getElementById(board.start).className = 'visitedStartNodePurple';
        } else {
          if (document.getElementById(board.start).className !== 'visitedStartNodePurple') {
            document.getElementById(board.start).className = 'visitedStartNodeBlue';
          }
        }
        if (board.currentAlgorithm === 'bidirectional') {
          document.getElementById(board.target).className = 'visitedTargetNodeBlue';
        }
        change(nodes[index]);
      } else if (index === nodes.length - 1 && board.currentAlgorithm === 'bidirectional') {
        change(nodes[index], nodes[index - 1], 'bidirectional');
      } else {
        change(nodes[index], nodes[index - 1]);
      }
      timeout(index + 1);
    }, speed);
  };

  timeout(0);
};

module.exports = launchAnimations;

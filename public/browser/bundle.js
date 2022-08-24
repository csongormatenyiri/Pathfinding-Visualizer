(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
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

},{"../pathfindingAlgorithms/unweightedSearchAlgorithm":13,"../pathfindingAlgorithms/weightedSearchAlgorithm":14}],2:[function(require,module,exports){
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

},{"../pathfindingAlgorithms/unweightedSearchAlgorithm":13,"../pathfindingAlgorithms/weightedSearchAlgorithm":14}],3:[function(require,module,exports){
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

},{}],4:[function(require,module,exports){
const Node = require('./node');
const launchAnimations = require('./animations/launchAnimations');
const launchInstantAnimations = require('./animations/launchInstantAnimations');
const mazeGenerationAnimations = require('./animations/mazeGenerationAnimations');
const weightedSearchAlgorithm = require('./pathfindingAlgorithms/weightedSearchAlgorithm');
const unweightedSearchAlgorithm = require('./pathfindingAlgorithms/unweightedSearchAlgorithm');
const recursiveDivisionMaze = require('./mazeAlgorithms/recursiveDivisionMaze');
const otherMaze = require('./mazeAlgorithms/otherMaze');
const otherOtherMaze = require('./mazeAlgorithms/otherOtherMaze');
const stairDemonstration = require('./mazeAlgorithms/stairDemonstration');
const bidirectional = require('./pathfindingAlgorithms/bidirectional');
const getDistance = require('./getDistance');

class Board {
  constructor(height, width) {
    this.height = height;
    this.width = width;
    this.start = null;
    this.target = null;
    this.object = null;
    this.boardArray = [];
    this.nodes = {};
    this.nodesToAnimate = [];
    this.objectNodesToAnimate = [];
    this.shortestPathNodesToAnimate = [];
    this.objectShortestPathNodesToAnimate = [];
    this.wallsToAnimate = [];
    this.mouseDown = false;
    this.pressedNodeStatus = 'normal';
    this.previouslyPressedNodeStatus = null;
    this.previouslySwitchedNode = null;
    this.previouslySwitchedNodeWeight = 0;
    this.keyDown = false;
    this.algoDone = false;
    this.currentAlgorithm = null;
    this.currentHeuristic = null;
    this.numberOfObjects = 0;
    this.isObject = false;
    this.buttonsOn = false;
    this.speed = 'fast';
  }

  initialise() {
    this.createGrid();
    this.addEventListeners();
    this.toggleTutorialButtons();
  }

  createGrid() {
    let tableHTML = '';
    for (let r = 0; r < this.height; r++) {
      const currentArrayRow = [];
      let currentHTMLRow = `<tr id="row ${r}">`;
      for (let c = 0; c < this.width; c++) {
        const newNodeId = `${r}-${c}`;
        let newNodeClass;
        let newNode;
        if (r === Math.floor(this.height / 2) && c === Math.floor(this.width / 4)) {
          newNodeClass = 'start';
          this.start = `${newNodeId}`;
        } else if (r === Math.floor(this.height / 2) && c === Math.floor((3 * this.width) / 4)) {
          newNodeClass = 'target';
          this.target = `${newNodeId}`;
        } else {
          newNodeClass = 'unvisited';
        }
        newNode = new Node(newNodeId, newNodeClass);
        currentArrayRow.push(newNode);
        currentHTMLRow += `<td id="${newNodeId}" class="${newNodeClass}"></td>`;
        this.nodes[`${newNodeId}`] = newNode;
      }
      this.boardArray.push(currentArrayRow);
      tableHTML += `${currentHTMLRow}</tr>`;
    }
    const board = document.getElementById('board');
    board.innerHTML = tableHTML;
  }

  addEventListeners() {
    const board = this;
    for (let r = 0; r < board.height; r++) {
      for (let c = 0; c < board.width; c++) {
        const currentId = `${r}-${c}`;
        const currentNode = board.getNode(currentId);
        const currentElement = document.getElementById(currentId);
        currentElement.onmousedown = (e) => {
          e.preventDefault();
          if (this.buttonsOn) {
            board.mouseDown = true;
            if (currentNode.status === 'start' || currentNode.status === 'target' || currentNode.status === 'object') {
              board.pressedNodeStatus = currentNode.status;
            } else {
              board.pressedNodeStatus = 'normal';
              board.changeNormalNode(currentNode);
            }
          }
        };
        currentElement.onmouseup = () => {
          if (this.buttonsOn) {
            board.mouseDown = false;
            if (board.pressedNodeStatus === 'target') {
              board.target = currentId;
            } else if (board.pressedNodeStatus === 'start') {
              board.start = currentId;
            } else if (board.pressedNodeStatus === 'object') {
              board.object = currentId;
            }
            board.pressedNodeStatus = 'normal';
          }
        };
        currentElement.onmouseenter = () => {
          if (this.buttonsOn) {
            if (board.mouseDown && board.pressedNodeStatus !== 'normal') {
              board.changeSpecialNode(currentNode);
              if (board.pressedNodeStatus === 'target') {
                board.target = currentId;
                if (board.algoDone) {
                  board.redoAlgorithm();
                }
              } else if (board.pressedNodeStatus === 'start') {
                board.start = currentId;
                if (board.algoDone) {
                  board.redoAlgorithm();
                }
              } else if (board.pressedNodeStatus === 'object') {
                board.object = currentId;
                if (board.algoDone) {
                  board.redoAlgorithm();
                }
              }
            } else if (board.mouseDown) {
              board.changeNormalNode(currentNode);
            }
          }
        };
        currentElement.onmouseleave = () => {
          if (this.buttonsOn) {
            if (board.mouseDown && board.pressedNodeStatus !== 'normal') {
              board.changeSpecialNode(currentNode);
            }
          }
        };
      }
    }
  }

  getNode(id) {
    const coordinates = id.split('-');
    const r = parseInt(coordinates[0]);
    const c = parseInt(coordinates[1]);
    return this.boardArray[r][c];
  }

  changeSpecialNode(currentNode) {
    const element = document.getElementById(currentNode.id);
    let previousElement;
    if (this.previouslySwitchedNode) previousElement = document.getElementById(this.previouslySwitchedNode.id);
    if (currentNode.status !== 'target' && currentNode.status !== 'start' && currentNode.status !== 'object') {
      if (this.previouslySwitchedNode) {
        this.previouslySwitchedNode.status = this.previouslyPressedNodeStatus;
        previousElement.className = this.previouslySwitchedNodeWeight === 15 ? 'unvisited weight' : this.previouslyPressedNodeStatus;
        this.previouslySwitchedNode.weight = this.previouslySwitchedNodeWeight === 15 ? 15 : 0;
        this.previouslySwitchedNode = null;
        this.previouslySwitchedNodeWeight = currentNode.weight;

        this.previouslyPressedNodeStatus = currentNode.status;
        element.className = this.pressedNodeStatus;
        currentNode.status = this.pressedNodeStatus;

        currentNode.weight = 0;
      }
    } else if (currentNode.status !== this.pressedNodeStatus && !this.algoDone) {
      this.previouslySwitchedNode.status = this.pressedNodeStatus;
      previousElement.className = this.pressedNodeStatus;
    } else if (currentNode.status === this.pressedNodeStatus) {
      this.previouslySwitchedNode = currentNode;
      element.className = this.previouslyPressedNodeStatus;
      currentNode.status = this.previouslyPressedNodeStatus;
    }
  }

  changeNormalNode(currentNode) {
    const element = document.getElementById(currentNode.id);
    const relevantStatuses = ['start', 'target', 'object'];
    const unweightedAlgorithms = ['dfs', 'bfs'];
    if (!this.keyDown) {
      if (!relevantStatuses.includes(currentNode.status)) {
        element.className = currentNode.status !== 'wall' ? 'wall' : 'unvisited';
        currentNode.status = element.className !== 'wall' ? 'unvisited' : 'wall';
        currentNode.weight = 0;
      }
    } else if (this.keyDown === 87 && !unweightedAlgorithms.includes(this.currentAlgorithm)) {
      if (!relevantStatuses.includes(currentNode.status)) {
        element.className = currentNode.weight !== 15 ? 'unvisited weight' : 'unvisited';
        currentNode.weight = element.className !== 'unvisited weight' ? 0 : 15;
        currentNode.status = 'unvisited';
      }
    }
  }

  drawShortestPath(targetNodeId, startNodeId, object) {
    let currentNode;
    if (this.currentAlgorithm !== 'bidirectional') {
      currentNode = this.nodes[this.nodes[targetNodeId].previousNode];
      if (object) {
        while (currentNode.id !== startNodeId) {
          this.objectShortestPathNodesToAnimate.unshift(currentNode);
          currentNode = this.nodes[currentNode.previousNode];
        }
      } else {
        while (currentNode.id !== startNodeId) {
          this.shortestPathNodesToAnimate.unshift(currentNode);
          document.getElementById(currentNode.id).className = `shortest-path`;
          currentNode = this.nodes[currentNode.previousNode];
        }
      }
    } else {
      if (this.middleNode !== this.target && this.middleNode !== this.start) {
        currentNode = this.nodes[this.nodes[this.middleNode].previousNode];
        secondCurrentNode = this.nodes[this.nodes[this.middleNode].otherpreviousNode];
        if (secondCurrentNode.id === this.target) {
          this.nodes[this.target].direction = getDistance(this.nodes[this.middleNode], this.nodes[this.target])[2];
        }
        if (this.nodes[this.middleNode].weight === 0) {
          document.getElementById(this.middleNode).className = `shortest-path`;
        } else {
          document.getElementById(this.middleNode).className = `shortest-path weight`;
        }
        while (currentNode.id !== startNodeId) {
          this.shortestPathNodesToAnimate.unshift(currentNode);
          document.getElementById(currentNode.id).className = `shortest-path`;
          currentNode = this.nodes[currentNode.previousNode];
        }
        while (secondCurrentNode.id !== targetNodeId) {
          this.shortestPathNodesToAnimate.unshift(secondCurrentNode);
          document.getElementById(secondCurrentNode.id).className = `shortest-path`;
          if (secondCurrentNode.otherpreviousNode === targetNodeId) {
            if (secondCurrentNode.otherdirection === 'left') {
              secondCurrentNode.direction = 'right';
            } else if (secondCurrentNode.otherdirection === 'right') {
              secondCurrentNode.direction = 'left';
            } else if (secondCurrentNode.otherdirection === 'up') {
              secondCurrentNode.direction = 'down';
            } else if (secondCurrentNode.otherdirection === 'down') {
              secondCurrentNode.direction = 'up';
            }
            this.nodes[this.target].direction = getDistance(secondCurrentNode, this.nodes[this.target])[2];
          }
          secondCurrentNode = this.nodes[secondCurrentNode.otherpreviousNode];
        }
      } else {
        document.getElementById(this.nodes[this.target].previousNode).className = `shortest-path`;
      }
    }
  }

  addShortestPath(targetNodeId, startNodeId, object) {
    let currentNode = this.nodes[this.nodes[targetNodeId].previousNode];
    if (object) {
      while (currentNode.id !== startNodeId) {
        this.objectShortestPathNodesToAnimate.unshift(currentNode);
        currentNode.relatesToObject = true;
        currentNode = this.nodes[currentNode.previousNode];
      }
    } else {
      while (currentNode.id !== startNodeId) {
        this.shortestPathNodesToAnimate.unshift(currentNode);
        currentNode = this.nodes[currentNode.previousNode];
      }
    }
  }

  drawShortestPathTimeout(targetNodeId, startNodeId, type, object) {
    const board = this;
    let currentNode;
    let secondCurrentNode;
    let currentNodesToAnimate;

    const shortestPathChange = (currentNode, previousNode, isActualTarget) => {
      if (currentNode === 'object') {
        const element = document.getElementById(board.object);
        element.className = 'objectTransparent';
      } else if (currentNode.id !== board.start) {
        if (currentNode.id !== board.target || (currentNode.id === board.target && isActualTarget)) {
          const currentHTMLNode = document.getElementById(currentNode.id);
          if (type === 'unweighted') {
            currentHTMLNode.className = 'shortest-path-unweighted';
          } else {
            let direction;
            if (currentNode.relatesToObject && !currentNode.overwriteObjectRelation && currentNode.id !== board.target) {
              direction = 'storedDirection';
              currentNode.overwriteObjectRelation = true;
            } else {
              direction = 'direction';
            }
            if (currentNode[direction] === 'up') {
              currentHTMLNode.className = 'shortest-path-up';
            } else if (currentNode[direction] === 'down') {
              currentHTMLNode.className = 'shortest-path-down';
            } else if (currentNode[direction] === 'right') {
              currentHTMLNode.className = 'shortest-path-right';
            } else if (currentNode[direction] === 'left') {
              currentHTMLNode.className = 'shortest-path-left';
            } else {
              currentHTMLNode.className = 'shortest-path';
            }
          }
        }
      }
      if (previousNode) {
        if (previousNode !== 'object' && previousNode.id !== board.target && previousNode.id !== board.start) {
          const previousHTMLNode = document.getElementById(previousNode.id);
          previousHTMLNode.className = previousNode.weight === 15 ? 'shortest-path weight' : 'shortest-path';
        }
      } else {
        const element = document.getElementById(board.start);
        element.className = 'startTransparent';
      }
    };

    const timeout = (index) => {
      if (!currentNodesToAnimate.length) currentNodesToAnimate.push(board.nodes[board.start]);
      setTimeout(() => {
        if (index === 0) {
          shortestPathChange(currentNodesToAnimate[index]);
        } else if (index < currentNodesToAnimate.length) {
          shortestPathChange(currentNodesToAnimate[index], currentNodesToAnimate[index - 1]);
        } else if (index === currentNodesToAnimate.length) {
          shortestPathChange(board.nodes[board.target], currentNodesToAnimate[index - 1], 'isActualTarget');
        }
        if (index > currentNodesToAnimate.length) {
          board.toggleButtons();
          return;
        }
        timeout(index + 1);
      }, 40);
    };

    if (board.currentAlgorithm !== 'bidirectional') {
      currentNode = board.nodes[board.nodes[targetNodeId].previousNode];
      if (object) {
        board.objectShortestPathNodesToAnimate.push('object');
        currentNodesToAnimate = board.objectShortestPathNodesToAnimate.concat(board.shortestPathNodesToAnimate);
      } else {
        currentNodesToAnimate = [];
        while (currentNode.id !== startNodeId) {
          currentNodesToAnimate.unshift(currentNode);
          currentNode = board.nodes[currentNode.previousNode];
        }
      }
    } else {
      if (board.middleNode !== board.target && board.middleNode !== board.start) {
        currentNode = board.nodes[board.nodes[board.middleNode].previousNode];
        secondCurrentNode = board.nodes[board.nodes[board.middleNode].otherpreviousNode];
        if (secondCurrentNode.id === board.target) {
          board.nodes[board.target].direction = getDistance(board.nodes[board.middleNode], board.nodes[board.target])[2];
        }
        if (object) {
        } else {
          currentNodesToAnimate = [];
          board.nodes[board.middleNode].direction = getDistance(currentNode, board.nodes[board.middleNode])[2];
          while (currentNode.id !== startNodeId) {
            currentNodesToAnimate.unshift(currentNode);
            currentNode = board.nodes[currentNode.previousNode];
          }
          currentNodesToAnimate.push(board.nodes[board.middleNode]);
          while (secondCurrentNode.id !== targetNodeId) {
            if (secondCurrentNode.otherdirection === 'left') {
              secondCurrentNode.direction = 'right';
            } else if (secondCurrentNode.otherdirection === 'right') {
              secondCurrentNode.direction = 'left';
            } else if (secondCurrentNode.otherdirection === 'up') {
              secondCurrentNode.direction = 'down';
            } else if (secondCurrentNode.otherdirection === 'down') {
              secondCurrentNode.direction = 'up';
            }
            currentNodesToAnimate.push(secondCurrentNode);
            if (secondCurrentNode.otherpreviousNode === targetNodeId) {
              board.nodes[board.target].direction = getDistance(secondCurrentNode, board.nodes[board.target])[2];
            }
            secondCurrentNode = board.nodes[secondCurrentNode.otherpreviousNode];
          }
        }
      } else {
        currentNodesToAnimate = [];
        const target = board.nodes[board.target];
        currentNodesToAnimate.push(board.nodes[target.previousNode], target);
      }
    }

    timeout(0);
  }

  createMazeOne(type) {
    Object.keys(this.nodes).forEach((node) => {
      const random = Math.random();
      const currentHTMLNode = document.getElementById(node);
      const relevantClassNames = ['start', 'target', 'object'];
      const randomTwo = type === 'wall' ? 0.25 : 0.35;
      if (random < randomTwo && !relevantClassNames.includes(currentHTMLNode.className)) {
        if (type === 'wall') {
          currentHTMLNode.className = 'wall';
          this.nodes[node].status = 'wall';
          this.nodes[node].weight = 0;
        } else if (type === 'weight') {
          currentHTMLNode.className = 'unvisited weight';
          this.nodes[node].status = 'unvisited';
          this.nodes[node].weight = 15;
        }
      }
    });
  }

  clearPath(clickedButton) {
    if (clickedButton) {
      const start = this.nodes[this.start];
      const target = this.nodes[this.target];
      const object = this.numberOfObjects ? this.nodes[this.object] : null;
      start.status = 'start';
      document.getElementById(start.id).className = 'start';
      target.status = 'target';
      document.getElementById(target.id).className = 'target';
      if (object) {
        object.status = 'object';
        document.getElementById(object.id).className = 'object';
      }
    }

    document.getElementById('startButtonStart').onclick = () => {
      if (!this.currentAlgorithm) {
        document.getElementById('startButtonStart').innerHTML = '<button class="btn btn-default navbar-btn" type="button">Pick an Algorithm!</button>';
      } else {
        this.clearPath('clickedButton');
        this.toggleButtons();
        const weightedAlgorithms = ['dijkstra', 'CLA', 'greedy'];
        const unweightedAlgorithms = ['dfs', 'bfs'];
        let success;
        if (this.currentAlgorithm === 'bidirectional') {
          if (!this.numberOfObjects) {
            success = bidirectional(this.nodes, this.start, this.target, this.nodesToAnimate, this.boardArray, this.currentAlgorithm, this);
            launchAnimations(this, success, 'weighted');
          } else {
            this.isObject = true;
          }
          this.algoDone = true;
        } else if (this.currentAlgorithm === 'astar') {
          if (!this.numberOfObjects) {
            success = weightedSearchAlgorithm(this.nodes, this.start, this.target, this.nodesToAnimate, this.boardArray, this.currentAlgorithm, this.currentHeuristic);
            launchAnimations(this, success, 'weighted');
          } else {
            this.isObject = true;
            success = weightedSearchAlgorithm(this.nodes, this.start, this.object, this.objectNodesToAnimate, this.boardArray, this.currentAlgorithm, this.currentHeuristic);
            launchAnimations(this, success, 'weighted', 'object', this.currentAlgorithm, this.currentHeuristic);
          }
          this.algoDone = true;
        } else if (weightedAlgorithms.includes(this.currentAlgorithm)) {
          if (!this.numberOfObjects) {
            success = weightedSearchAlgorithm(this.nodes, this.start, this.target, this.nodesToAnimate, this.boardArray, this.currentAlgorithm, this.currentHeuristic);
            launchAnimations(this, success, 'weighted');
          } else {
            this.isObject = true;
            success = weightedSearchAlgorithm(this.nodes, this.start, this.object, this.objectNodesToAnimate, this.boardArray, this.currentAlgorithm, this.currentHeuristic);
            launchAnimations(this, success, 'weighted', 'object', this.currentAlgorithm, this.currentHeuristic);
          }
          this.algoDone = true;
        } else if (unweightedAlgorithms.includes(this.currentAlgorithm)) {
          if (!this.numberOfObjects) {
            success = unweightedSearchAlgorithm(this.nodes, this.start, this.target, this.nodesToAnimate, this.boardArray, this.currentAlgorithm);
            launchAnimations(this, success, 'unweighted');
          } else {
            this.isObject = true;
            success = unweightedSearchAlgorithm(this.nodes, this.start, this.object, this.objectNodesToAnimate, this.boardArray, this.currentAlgorithm);
            launchAnimations(this, success, 'unweighted', 'object', this.currentAlgorithm);
          }
          this.algoDone = true;
        }
      }
    };

    this.algoDone = false;
    Object.keys(this.nodes).forEach((id) => {
      const currentNode = this.nodes[id];
      currentNode.previousNode = null;
      currentNode.distance = Infinity;
      currentNode.totalDistance = Infinity;
      currentNode.heuristicDistance = null;
      currentNode.direction = null;
      currentNode.storedDirection = null;
      currentNode.relatesToObject = false;
      currentNode.overwriteObjectRelation = false;
      currentNode.otherpreviousNode = null;
      currentNode.otherdistance = Infinity;
      currentNode.otherdirection = null;
      const currentHTMLNode = document.getElementById(id);
      const relevantStatuses = ['wall', 'start', 'target', 'object'];
      if ((!relevantStatuses.includes(currentNode.status) || currentHTMLNode.className === 'visitedobject') && currentNode.weight !== 15) {
        currentNode.status = 'unvisited';
        currentHTMLNode.className = 'unvisited';
      } else if (currentNode.weight === 15) {
        currentNode.status = 'unvisited';
        currentHTMLNode.className = 'unvisited weight';
      }
    });
  }

  clearWalls() {
    this.clearPath('clickedButton');
    Object.keys(this.nodes).forEach((id) => {
      const currentNode = this.nodes[id];
      const currentHTMLNode = document.getElementById(id);
      if (currentNode.status === 'wall' || currentNode.weight === 15) {
        currentNode.status = 'unvisited';
        currentNode.weight = 0;
        currentHTMLNode.className = 'unvisited';
      }
    });
  }

  clearWeights() {
    Object.keys(this.nodes).forEach((id) => {
      const currentNode = this.nodes[id];
      const currentHTMLNode = document.getElementById(id);
      if (currentNode.weight === 15) {
        currentNode.status = 'unvisited';
        currentNode.weight = 0;
        currentHTMLNode.className = 'unvisited';
      }
    });
  }

  clearNodeStatuses() {
    Object.keys(this.nodes).forEach((id) => {
      const currentNode = this.nodes[id];
      currentNode.previousNode = null;
      currentNode.distance = Infinity;
      currentNode.totalDistance = Infinity;
      currentNode.heuristicDistance = null;
      currentNode.storedDirection = currentNode.direction;
      currentNode.direction = null;
      const relevantStatuses = ['wall', 'start', 'target', 'object'];
      if (!relevantStatuses.includes(currentNode.status)) {
        currentNode.status = 'unvisited';
      }
    });
  }

  instantAlgorithm() {
    const weightedAlgorithms = ['dijkstra', 'CLA', 'greedy'];
    const unweightedAlgorithms = ['dfs', 'bfs'];
    let success;
    if (this.currentAlgorithm === 'bidirectional') {
      if (!this.numberOfObjects) {
        success = bidirectional(this.nodes, this.start, this.target, this.nodesToAnimate, this.boardArray, this.currentAlgorithm, this);
        launchInstantAnimations(this, success, 'weighted');
      } else {
        this.isObject = true;
      }
      this.algoDone = true;
    } else if (this.currentAlgorithm === 'astar') {
      if (!this.numberOfObjects) {
        success = weightedSearchAlgorithm(this.nodes, this.start, this.target, this.nodesToAnimate, this.boardArray, this.currentAlgorithm, this.currentHeuristic);
        launchInstantAnimations(this, success, 'weighted');
      } else {
        this.isObject = true;
        success = weightedSearchAlgorithm(this.nodes, this.start, this.object, this.objectNodesToAnimate, this.boardArray, this.currentAlgorithm, this.currentHeuristic);
        launchInstantAnimations(this, success, 'weighted', 'object', this.currentAlgorithm);
      }
      this.algoDone = true;
    }
    if (weightedAlgorithms.includes(this.currentAlgorithm)) {
      if (!this.numberOfObjects) {
        success = weightedSearchAlgorithm(this.nodes, this.start, this.target, this.nodesToAnimate, this.boardArray, this.currentAlgorithm, this.currentHeuristic);
        launchInstantAnimations(this, success, 'weighted');
      } else {
        this.isObject = true;
        success = weightedSearchAlgorithm(this.nodes, this.start, this.object, this.objectNodesToAnimate, this.boardArray, this.currentAlgorithm, this.currentHeuristic);
        launchInstantAnimations(this, success, 'weighted', 'object', this.currentAlgorithm, this.currentHeuristic);
      }
      this.algoDone = true;
    } else if (unweightedAlgorithms.includes(this.currentAlgorithm)) {
      if (!this.numberOfObjects) {
        success = unweightedSearchAlgorithm(this.nodes, this.start, this.target, this.nodesToAnimate, this.boardArray, this.currentAlgorithm);
        launchInstantAnimations(this, success, 'unweighted');
      } else {
        this.isObject = true;
        success = unweightedSearchAlgorithm(this.nodes, this.start, this.object, this.objectNodesToAnimate, this.boardArray, this.currentAlgorithm);
        launchInstantAnimations(this, success, 'unweighted', 'object', this.currentAlgorithm);
      }
      this.algoDone = true;
    }
  }

  redoAlgorithm() {
    this.clearPath();
    this.instantAlgorithm();
  }

  reset(objectNotTransparent) {
    this.nodes[this.start].status = 'start';
    document.getElementById(this.start).className = 'startTransparent';
    this.nodes[this.target].status = 'target';
    if (this.object) {
      this.nodes[this.object].status = 'object';
      if (objectNotTransparent) {
        document.getElementById(this.object).className = 'visitedObjectNode';
      } else {
        document.getElementById(this.object).className = 'objectTransparent';
      }
    }
  }

  resetHTMLNodes() {
    const start = document.getElementById(this.start);
    const target = document.getElementById(this.target);
    start.className = 'start';
    target.className = 'target';
  }

  changeStartNodeImages() {
    const unweighted = ['bfs', 'dfs'];
    const guaranteed = ['dijkstra', 'astar'];
    let name = '';
    if (this.currentAlgorithm === 'bfs') {
      name = 'Breath-first Search';
    } else if (this.currentAlgorithm === 'dfs') {
      name = 'Depth-first Search';
    } else if (this.currentAlgorithm === 'dijkstra') {
      name = "Dijkstra's Algorithm";
    } else if (this.currentAlgorithm === 'astar') {
      name = 'A* Search';
    } else if (this.currentAlgorithm === 'greedy') {
      name = 'Greedy Best-first Search';
    } else if (this.currentAlgorithm === 'CLA' && this.currentHeuristic !== 'extraPoweredManhattanDistance') {
      name = 'Swarm Algorithm';
    } else if (this.currentAlgorithm === 'CLA' && this.currentHeuristic === 'extraPoweredManhattanDistance') {
      name = 'Convergent Swarm Algorithm';
    } else if (this.currentAlgorithm === 'bidirectional') {
      name = 'Bidirectional Swarm Algorithm';
    }
    if (unweighted.includes(this.currentAlgorithm)) {
      if (this.currentAlgorithm === 'dfs') {
        document.getElementById('algorithmDescriptor').innerHTML = `${name} is <i><b>unweighted</b></i> and <i><b>does not guarantee</b></i> the shortest path!`;
      } else {
        document.getElementById('algorithmDescriptor').innerHTML = `${name} is <i><b>unweighted</b></i> and <i><b>guarantees</b></i> the shortest path!`;
      }
      document.getElementById('weightLegend').className = 'strikethrough';
      for (let i = 0; i < 14; i++) {
        const j = i.toString();
        const backgroundImage = document.styleSheets['1'].rules[j].style.backgroundImage;
        document.styleSheets['1'].rules[j].style.backgroundImage = backgroundImage.replace('triangle', 'spaceship');
      }
    } else {
      if (this.currentAlgorithm === 'greedy' || this.currentAlgorithm === 'CLA') {
        document.getElementById('algorithmDescriptor').innerHTML = `${name} is <i><b>weighted</b></i> and <i><b>does not guarantee</b></i> the shortest path!`;
      }
      document.getElementById('weightLegend').className = '';
      for (let i = 0; i < 14; i++) {
        const j = i.toString();
        const backgroundImage = document.styleSheets['1'].rules[j].style.backgroundImage;
        document.styleSheets['1'].rules[j].style.backgroundImage = backgroundImage.replace('spaceship', 'triangle');
      }
    }
    if (this.currentAlgorithm === 'bidirectional') {
      document.getElementById('algorithmDescriptor').innerHTML = `${name} is <i><b>weighted</b></i> and <i><b>does not guarantee</b></i> the shortest path!`;
      document.getElementById('bombLegend').className = 'strikethrough';
      document.getElementById('startButtonAddObject').className = 'navbar-inverse navbar-nav disabledA';
    } else {
      document.getElementById('bombLegend').className = '';
      document.getElementById('startButtonAddObject').className = 'navbar-inverse navbar-nav';
    }
    if (guaranteed.includes(this.currentAlgorithm)) {
      document.getElementById('algorithmDescriptor').innerHTML = `${name} is <i><b>weighted</b></i> and <i><b>guarantees</b></i> the shortest path!`;
    }
  }

  toggleTutorialButtons() {
    const board = this;

    const nextPreviousClick = () => {
      if (counter === 1) {
        document.getElementById('tutorial').innerHTML = `<h3>Welcome to Pathfinding Visualizer!</h3><h6>This short tutorial will walk you through all of the features of this application.</h6><p>If you want to dive right in, feel free to press the "Skip Tutorial" button below. Otherwise, press "Next"!</p><div id="tutorialCounter">1/9</div><img id="mainTutorialImage" src="/styling/c_icon.png"><button id="nextButton" class="btn btn-default navbar-btn" type="button">Next</button><button id="previousButton" class="btn btn-default navbar-btn" type="button">Previous</button><button id="skipButton" class="btn btn-default navbar-btn" type="button">Skip Tutorial</button>`;
      } else if (counter === 2) {
        document.getElementById('tutorial').innerHTML = `<h3>What is a pathfinding algorithm?</h3><h6>At its core, a pathfinding algorithm seeks to find the shortest path between two points. This application visualizes various pathfinding algorithms in action, and more!</h6><p>All of the algorithms on this application are adapted for a 2D grid, where 90 degree turns have a "cost" of 1 and movements from a node to another have a "cost" of 1.</p><div id="tutorialCounter">${counter}/9</div><img id="mainTutorialImage" src="/styling/path.png"><button id="nextButton" class="btn btn-default navbar-btn" type="button">Next</button><button id="previousButton" class="btn btn-default navbar-btn" type="button">Previous</button><button id="skipButton" class="btn btn-default navbar-btn" type="button">Skip Tutorial</button>`;
      } else if (counter === 3) {
        document.getElementById('tutorial').innerHTML = `<h3>Picking an algorithm</h3><h6>Choose an algorithm from the "Algorithms" drop-down menu.</h6><p>Note that some algorithms are <i><b>unweighted</b></i>, while others are <i><b>weighted</b></i>. Unweighted algorithms do not take turns or weight nodes into account, whereas weighted ones do. Additionally, not all algorithms guarantee the shortest path. </p><img id="secondTutorialImage" src="/styling/algorithms.png"><div id="tutorialCounter">${counter}/9</div><button id="nextButton" class="btn btn-default navbar-btn" type="button">Next</button><button id="previousButton" class="btn btn-default navbar-btn" type="button">Previous</button><button id="skipButton" class="btn btn-default navbar-btn" type="button">Skip Tutorial</button>`;
      } else if (counter === 4) {
        document.getElementById('tutorial').innerHTML = `<h3>Meet the algorithms</h3><h6>Not all algorithms are created equal.</h6><ul><li><b>Dijkstra's Algorithm</b> (weighted): the father of pathfinding algorithms; guarantees the shortest path</li><li><b>A* Search</b> (weighted): arguably the best pathfinding algorithm; uses heuristics to guarantee the shortest path much faster than Dijkstra's Algorithm</li><li><b>Greedy Best-first Search</b> (weighted): a faster, more heuristic-heavy version of A*; does not guarantee the shortest path</li><li><b>Swarm Algorithm</b> (weighted): a mixture of Dijkstra's Algorithm and A*; does not guarantee the shortest-path</li><li><b>Convergent Swarm Algorithm</b> (weighted): the faster, more heuristic-heavy version of Swarm; does not guarantee the shortest path</li><li><b>Bidirectional Swarm Algorithm</b> (weighted): Swarm from both sides; does not guarantee the shortest path</li><li><b>Breath-first Search</b> (unweighted): a great algorithm; guarantees the shortest path</li><li><b>Depth-first Search</b> (unweighted): a very bad algorithm for pathfinding; does not guarantee the shortest path</li></ul><div id="tutorialCounter">${counter}/9</div><button id="nextButton" class="btn btn-default navbar-btn" type="button">Next</button><button id="previousButton" class="btn btn-default navbar-btn" type="button">Previous</button><button id="skipButton" class="btn btn-default navbar-btn" type="button">Skip Tutorial</button>`;
      } else if (counter === 5) {
        document.getElementById('tutorial').innerHTML = `<h3>Adding walls and weights</h3><h6>Click on the grid to add a wall. Click on the grid while pressing W to add a weight. Generate mazes and patterns from the "Mazes & Patterns" drop-down menu.</h6><p>Walls are impenetrable, meaning that a path cannot cross through them. Weights, however, are not impassable. They are simply more "costly" to move through. In this application, moving through a weight node has a "cost" of 15.</p><img id="secondTutorialImage" src="/styling/walls.gif"><div id="tutorialCounter">${counter}/9</div><button id="nextButton" class="btn btn-default navbar-btn" type="button">Next</button><button id="previousButton" class="btn btn-default navbar-btn" type="button">Previous</button><button id="skipButton" class="btn btn-default navbar-btn" type="button">Skip Tutorial</button>`;
      } else if (counter === 6) {
        document.getElementById('tutorial').innerHTML = `<h3>Adding a bomb</h3><h6>Click the "Add Bomb" button.</h6><p>Adding a bomb will change the course of the chosen algorithm. In other words, the algorithm will first look for the bomb (in an effort to diffuse it) and will then look for the target node. Note that the Bidirectional Swarm Algorithm does not support adding a bomb.</p><img id="secondTutorialImage" src="/styling/bomb.png"><div id="tutorialCounter">${counter}/9</div><button id="nextButton" class="btn btn-default navbar-btn" type="button">Next</button><button id="previousButton" class="btn btn-default navbar-btn" type="button">Previous</button><button id="skipButton" class="btn btn-default navbar-btn" type="button">Skip Tutorial</button>`;
      } else if (counter === 7) {
        document.getElementById('tutorial').innerHTML = `<h3>Dragging nodes</h3><h6>Click and drag the start, bomb, and target nodes to move them.</h6><p>Note that you can drag nodes even after an algorithm has finished running. This will allow you to instantly see different paths.</p><img src="/styling/dragging.gif"><div id="tutorialCounter">${counter}/9</div><button id="nextButton" class="btn btn-default navbar-btn" type="button">Next</button><button id="previousButton" class="btn btn-default navbar-btn" type="button">Previous</button><button id="skipButton" class="btn btn-default navbar-btn" type="button">Skip Tutorial</button>`;
      } else if (counter === 8) {
        document.getElementById('tutorial').innerHTML = `<h3>Visualizing and more</h3><h6>Use the navbar buttons to visualize algorithms and to do other stuff!</h6><p>You can clear the current path, clear walls and weights, clear the entire board, and adjust the visualization speed, all from the navbar. If you want to access this tutorial again, click on "Pathfinding Visualizer" in the top left corner of your screen.</p><img id="secondTutorialImage" src="/styling/navbar.png"><div id="tutorialCounter">${counter}/9</div><button id="nextButton" class="btn btn-default navbar-btn" type="button">Next</button><button id="previousButton" class="btn btn-default navbar-btn" type="button">Previous</button><button id="skipButton" class="btn btn-default navbar-btn" type="button">Skip Tutorial</button>`;
      } else if (counter === 9) {
        document.getElementById('tutorial').innerHTML = `<h3>Enjoy!</h3><h6>I hope you have just as much fun playing around with this visualization tool as I had building it!</h6><p>If you want to see the source code for this application, check out my <a href="https://github.com/csongormatenyiri/Pathfinding-Visualizer">github</a>.</p><div id="tutorialCounter">${counter}/9</div><button id="finishButton" class="btn btn-default navbar-btn" type="button">Finish</button><button id="previousButton" class="btn btn-default navbar-btn" type="button">Previous</button><button id="skipButton" class="btn btn-default navbar-btn" type="button">Skip Tutorial</button>`;
        document.getElementById('finishButton').onclick = () => {
          document.getElementById('tutorial').style.display = 'none';
          board.toggleButtons();
        };
      }
    };

    document.getElementById('skipButton').onclick = () => {
      document.getElementById('tutorial').style.display = 'none';
      this.toggleButtons();
    };

    if (document.getElementById('nextButton')) {
      document.getElementById('nextButton').onclick = () => {
        if (counter < 9) counter++;
        nextPreviousClick();
        this.toggleTutorialButtons();
      };
    }

    document.getElementById('previousButton').onclick = () => {
      if (counter > 1) counter--;
      nextPreviousClick();
      this.toggleTutorialButtons();
    };
  }

  toggleButtons() {
    document.getElementById('refreshButton').onclick = () => {
      window.location.reload(true);
    };

    if (!this.buttonsOn) {
      this.buttonsOn = true;

      document.getElementById('startButtonStart').onclick = () => {
        if (!this.currentAlgorithm) {
          document.getElementById('startButtonStart').innerHTML = '<button class="btn btn-default navbar-btn" type="button">Pick an Algorithm!</button>';
        } else {
          this.clearPath('clickedButton');
          this.toggleButtons();
          const weightedAlgorithms = ['dijkstra', 'CLA', 'CLA', 'greedy'];
          const unweightedAlgorithms = ['dfs', 'bfs'];
          let success;
          if (this.currentAlgorithm === 'bidirectional') {
            if (!this.numberOfObjects) {
              success = bidirectional(this.nodes, this.start, this.target, this.nodesToAnimate, this.boardArray, this.currentAlgorithm, this);
              launchAnimations(this, success, 'weighted');
            } else {
              this.isObject = true;
              success = bidirectional(this.nodes, this.start, this.object, this.nodesToAnimate, this.boardArray, this.currentAlgorithm, this);
              launchAnimations(this, success, 'weighted');
            }
            this.algoDone = true;
          } else if (this.currentAlgorithm === 'astar') {
            if (!this.numberOfObjects) {
              success = weightedSearchAlgorithm(this.nodes, this.start, this.target, this.nodesToAnimate, this.boardArray, this.currentAlgorithm, this.currentHeuristic);
              launchAnimations(this, success, 'weighted');
            } else {
              this.isObject = true;
              success = weightedSearchAlgorithm(this.nodes, this.start, this.object, this.objectNodesToAnimate, this.boardArray, this.currentAlgorithm, this.currentHeuristic);
              launchAnimations(this, success, 'weighted', 'object', this.currentAlgorithm);
            }
            this.algoDone = true;
          } else if (weightedAlgorithms.includes(this.currentAlgorithm)) {
            if (!this.numberOfObjects) {
              success = weightedSearchAlgorithm(this.nodes, this.start, this.target, this.nodesToAnimate, this.boardArray, this.currentAlgorithm, this.currentHeuristic);
              launchAnimations(this, success, 'weighted');
            } else {
              this.isObject = true;
              success = weightedSearchAlgorithm(this.nodes, this.start, this.object, this.objectNodesToAnimate, this.boardArray, this.currentAlgorithm, this.currentHeuristic);
              launchAnimations(this, success, 'weighted', 'object', this.currentAlgorithm, this.currentHeuristic);
            }
            this.algoDone = true;
          } else if (unweightedAlgorithms.includes(this.currentAlgorithm)) {
            if (!this.numberOfObjects) {
              success = unweightedSearchAlgorithm(this.nodes, this.start, this.target, this.nodesToAnimate, this.boardArray, this.currentAlgorithm);
              launchAnimations(this, success, 'unweighted');
            } else {
              this.isObject = true;
              success = unweightedSearchAlgorithm(this.nodes, this.start, this.object, this.objectNodesToAnimate, this.boardArray, this.currentAlgorithm);
              launchAnimations(this, success, 'unweighted', 'object', this.currentAlgorithm);
            }
            this.algoDone = true;
          }
        }
      };

      document.getElementById('adjustFast').onclick = () => {
        this.speed = 'fast';
        document.getElementById('adjustSpeed').innerHTML = 'Speed: Fast<span class="caret"></span>';
      };

      document.getElementById('adjustAverage').onclick = () => {
        this.speed = 'average';
        document.getElementById('adjustSpeed').innerHTML = 'Speed: Average<span class="caret"></span>';
      };

      document.getElementById('adjustSlow').onclick = () => {
        this.speed = 'slow';
        document.getElementById('adjustSpeed').innerHTML = 'Speed: Slow<span class="caret"></span>';
      };

      document.getElementById('startStairDemonstration').onclick = () => {
        this.clearWalls();
        this.clearPath('clickedButton');
        this.toggleButtons();
        stairDemonstration(this);
        mazeGenerationAnimations(this);
      };

      document.getElementById('startButtonBidirectional').onclick = () => {
        document.getElementById('startButtonStart').innerHTML = '<button id="actualStartButton" class="btn btn-default navbar-btn" type="button">Visualize Bidirectional Swarm!</button>';
        this.currentAlgorithm = 'bidirectional';
        this.currentHeuristic = 'manhattanDistance';
        if (this.numberOfObjects) {
          const objectNodeId = this.object;
          document.getElementById('startButtonAddObject').innerHTML = '<a href="#">Add a Bomb</a></li>';
          document.getElementById(objectNodeId).className = 'unvisited';
          this.object = null;
          this.numberOfObjects = 0;
          this.nodes[objectNodeId].status = 'unvisited';
          this.isObject = false;
        }
        this.clearPath('clickedButton');
        this.changeStartNodeImages();
      };

      document.getElementById('startButtonDijkstra').onclick = () => {
        document.getElementById('startButtonStart').innerHTML = '<button id="actualStartButton" class="btn btn-default navbar-btn" type="button">Visualize Dijkstra\'s!</button>';
        this.currentAlgorithm = 'dijkstra';
        this.changeStartNodeImages();
      };

      document.getElementById('startButtonAStar').onclick = () => {
        document.getElementById('startButtonStart').innerHTML = '<button id="actualStartButton" class="btn btn-default navbar-btn" type="button">Visualize Swarm!</button>';
        this.currentAlgorithm = 'CLA';
        this.currentHeuristic = 'manhattanDistance';
        this.changeStartNodeImages();
      };

      document.getElementById('startButtonAStar2').onclick = () => {
        document.getElementById('startButtonStart').innerHTML = '<button id="actualStartButton" class="btn btn-default navbar-btn" type="button">Visualize A*!</button>';
        this.currentAlgorithm = 'astar';
        this.currentHeuristic = 'poweredManhattanDistance';
        this.changeStartNodeImages();
      };

      document.getElementById('startButtonAStar3').onclick = () => {
        document.getElementById('startButtonStart').innerHTML = '<button id="actualStartButton" class="btn btn-default navbar-btn" type="button">Visualize Convergent Swarm!</button>';
        this.currentAlgorithm = 'CLA';
        this.currentHeuristic = 'extraPoweredManhattanDistance';
        this.changeStartNodeImages();
      };

      document.getElementById('startButtonGreedy').onclick = () => {
        document.getElementById('startButtonStart').innerHTML = '<button id="actualStartButton" class="btn btn-default navbar-btn" type="button">Visualize Greedy!</button>';
        this.currentAlgorithm = 'greedy';
        this.changeStartNodeImages();
      };

      document.getElementById('startButtonBFS').onclick = () => {
        document.getElementById('startButtonStart').innerHTML = '<button id="actualStartButton" class="btn btn-default navbar-btn" type="button">Visualize BFS!</button>';
        this.currentAlgorithm = 'bfs';
        this.clearWeights();
        this.changeStartNodeImages();
      };

      document.getElementById('startButtonDFS').onclick = () => {
        document.getElementById('startButtonStart').innerHTML = '<button id="actualStartButton" class="btn btn-default navbar-btn" type="button">Visualize DFS!</button>';
        this.currentAlgorithm = 'dfs';
        this.clearWeights();
        this.changeStartNodeImages();
      };

      document.getElementById('startButtonCreateMazeOne').onclick = () => {
        this.clearWalls();
        this.clearPath('clickedButton');
        this.createMazeOne('wall');
      };

      document.getElementById('startButtonCreateMazeTwo').onclick = () => {
        this.clearWalls();
        this.clearPath('clickedButton');
        this.toggleButtons();
        recursiveDivisionMaze(this, 2, this.height - 3, 2, this.width - 3, 'horizontal', false, 'wall');
        mazeGenerationAnimations(this);
      };

      document.getElementById('startButtonCreateMazeWeights').onclick = () => {
        this.clearWalls();
        this.clearPath('clickedButton');
        this.createMazeOne('weight');
      };

      document.getElementById('startButtonClearBoard').onclick = () => {
        document.getElementById('startButtonAddObject').innerHTML = '<a href="#">Add Bomb</a></li>';

        const navbarHeight = document.getElementById('navbarDiv').clientHeight;
        const textHeight = document.getElementById('mainText').clientHeight + document.getElementById('algorithmDescriptor').clientHeight;
        const height = Math.floor((document.documentElement.clientHeight - navbarHeight - textHeight) / 28);
        const width = Math.floor(document.documentElement.clientWidth / 25);
        const start = Math.floor(height / 2).toString() + '-' + Math.floor(width / 4).toString();
        const target = Math.floor(height / 2).toString() + '-' + Math.floor((3 * width) / 4).toString();

        Object.keys(this.nodes).forEach((id) => {
          const currentNode = this.nodes[id];
          const currentHTMLNode = document.getElementById(id);
          if (id === start) {
            currentHTMLNode.className = 'start';
            currentNode.status = 'start';
          } else if (id === target) {
            currentHTMLNode.className = 'target';
            currentNode.status = 'target';
          } else {
            currentHTMLNode.className = 'unvisited';
            currentNode.status = 'unvisited';
          }
          currentNode.previousNode = null;
          currentNode.path = null;
          currentNode.direction = null;
          currentNode.storedDirection = null;
          currentNode.distance = Infinity;
          currentNode.totalDistance = Infinity;
          currentNode.heuristicDistance = null;
          currentNode.weight = 0;
          currentNode.relatesToObject = false;
          currentNode.overwriteObjectRelation = false;
        });
        this.start = start;
        this.target = target;
        this.object = null;
        this.nodesToAnimate = [];
        this.objectNodesToAnimate = [];
        this.shortestPathNodesToAnimate = [];
        this.objectShortestPathNodesToAnimate = [];
        this.wallsToAnimate = [];
        this.mouseDown = false;
        this.pressedNodeStatus = 'normal';
        this.previouslyPressedNodeStatus = null;
        this.previouslySwitchedNode = null;
        this.previouslySwitchedNodeWeight = 0;
        this.keyDown = false;
        this.algoDone = false;
        this.numberOfObjects = 0;
        this.isObject = false;
      };

      document.getElementById('startButtonClearWalls').onclick = () => {
        this.clearWalls();
      };

      document.getElementById('startButtonClearPath').onclick = () => {
        this.clearPath('clickedButton');
      };

      document.getElementById('startButtonCreateMazeThree').onclick = () => {
        this.clearWalls();
        this.clearPath('clickedButton');
        this.toggleButtons();
        otherMaze(this, 2, this.height - 3, 2, this.width - 3, 'vertical', false);
        mazeGenerationAnimations(this);
      };

      document.getElementById('startButtonCreateMazeFour').onclick = () => {
        this.clearWalls();
        this.clearPath('clickedButton');
        this.toggleButtons();
        otherOtherMaze(this, 2, this.height - 3, 2, this.width - 3, 'horizontal', false);
        mazeGenerationAnimations(this);
      };

      document.getElementById('startButtonAddObject').onclick = () => {
        const innerHTML = document.getElementById('startButtonAddObject').innerHTML;
        if (this.currentAlgorithm !== 'bidirectional') {
          if (innerHTML.includes('Add')) {
            const r = Math.floor(this.height / 2);
            const c = Math.floor((2 * this.width) / 4);
            const objectNodeId = `${r}-${c}`;
            if (this.target === objectNodeId || this.start === objectNodeId || this.numberOfObjects === 1) {
              console.log('Failure to place object.');
            } else {
              document.getElementById('startButtonAddObject').innerHTML = '<a href="#">Remove Bomb</a></li>';
              this.clearPath('clickedButton');
              this.object = objectNodeId;
              this.numberOfObjects = 1;
              this.nodes[objectNodeId].status = 'object';
              document.getElementById(objectNodeId).className = 'object';
            }
          } else {
            const objectNodeId = this.object;
            document.getElementById('startButtonAddObject').innerHTML = '<a href="#">Add Bomb</a></li>';
            document.getElementById(objectNodeId).className = 'unvisited';
            this.object = null;
            this.numberOfObjects = 0;
            this.nodes[objectNodeId].status = 'unvisited';
            this.isObject = false;
            this.clearPath('clickedButton');
          }
        }
      };

      document.getElementById('startButtonClearPath').className = 'navbar-inverse navbar-nav';
      document.getElementById('startButtonClearWalls').className = 'navbar-inverse navbar-nav';
      document.getElementById('startButtonClearBoard').className = 'navbar-inverse navbar-nav';
      if (this.currentAlgorithm !== 'bidirectional') {
        document.getElementById('startButtonAddObject').className = 'navbar-inverse navbar-nav';
      }
      document.getElementById('startButtonCreateMazeOne').className = 'navbar-inverse navbar-nav';
      document.getElementById('startButtonCreateMazeTwo').className = 'navbar-inverse navbar-nav';
      document.getElementById('startButtonCreateMazeThree').className = 'navbar-inverse navbar-nav';
      document.getElementById('startButtonCreateMazeFour').className = 'navbar-inverse navbar-nav';
      document.getElementById('startButtonCreateMazeWeights').className = 'navbar-inverse navbar-nav';
      document.getElementById('startStairDemonstration').className = 'navbar-inverse navbar-nav';
      document.getElementById('startButtonDFS').className = 'navbar-inverse navbar-nav';
      document.getElementById('startButtonBFS').className = 'navbar-inverse navbar-nav';
      document.getElementById('startButtonDijkstra').className = 'navbar-inverse navbar-nav';
      document.getElementById('startButtonAStar').className = 'navbar-inverse navbar-nav';
      document.getElementById('startButtonAStar2').className = 'navbar-inverse navbar-nav';
      document.getElementById('startButtonAStar3').className = 'navbar-inverse navbar-nav';
      document.getElementById('adjustFast').className = 'navbar-inverse navbar-nav';
      document.getElementById('adjustAverage').className = 'navbar-inverse navbar-nav';
      document.getElementById('adjustSlow').className = 'navbar-inverse navbar-nav';
      document.getElementById('startButtonBidirectional').className = 'navbar-inverse navbar-nav';
      document.getElementById('startButtonGreedy').className = 'navbar-inverse navbar-nav';
      document.getElementById('actualStartButton').style.backgroundColor = '';
    } else {
      this.buttonsOn = false;
      document.getElementById('startButtonDFS').onclick = null;
      document.getElementById('startButtonBFS').onclick = null;
      document.getElementById('startButtonDijkstra').onclick = null;
      document.getElementById('startButtonAStar').onclick = null;
      document.getElementById('startButtonGreedy').onclick = null;
      document.getElementById('startButtonAddObject').onclick = null;
      document.getElementById('startButtonAStar2').onclick = null;
      document.getElementById('startButtonAStar3').onclick = null;
      document.getElementById('startButtonBidirectional').onclick = null;
      document.getElementById('startButtonCreateMazeOne').onclick = null;
      document.getElementById('startButtonCreateMazeTwo').onclick = null;
      document.getElementById('startButtonCreateMazeThree').onclick = null;
      document.getElementById('startButtonCreateMazeFour').onclick = null;
      document.getElementById('startButtonCreateMazeWeights').onclick = null;
      document.getElementById('startStairDemonstration').onclick = null;
      document.getElementById('startButtonClearPath').onclick = null;
      document.getElementById('startButtonClearWalls').onclick = null;
      document.getElementById('startButtonClearBoard').onclick = null;
      document.getElementById('startButtonStart').onclick = null;
      document.getElementById('adjustFast').onclick = null;
      document.getElementById('adjustAverage').onclick = null;
      document.getElementById('adjustSlow').onclick = null;

      document.getElementById('adjustFast').className = 'navbar-inverse navbar-nav disabledA';
      document.getElementById('adjustAverage').className = 'navbar-inverse navbar-nav disabledA';
      document.getElementById('adjustSlow').className = 'navbar-inverse navbar-nav disabledA';
      document.getElementById('startButtonClearPath').className = 'navbar-inverse navbar-nav disabledA';
      document.getElementById('startButtonClearWalls').className = 'navbar-inverse navbar-nav disabledA';
      document.getElementById('startButtonClearBoard').className = 'navbar-inverse navbar-nav disabledA';
      document.getElementById('startButtonAddObject').className = 'navbar-inverse navbar-nav disabledA';
      document.getElementById('startButtonCreateMazeOne').className = 'navbar-inverse navbar-nav disabledA';
      document.getElementById('startButtonCreateMazeTwo').className = 'navbar-inverse navbar-nav disabledA';
      document.getElementById('startButtonCreateMazeThree').className = 'navbar-inverse navbar-nav disabledA';
      document.getElementById('startButtonCreateMazeFour').className = 'navbar-inverse navbar-nav disabledA';
      document.getElementById('startButtonCreateMazeWeights').className = 'navbar-inverse navbar-nav disabledA';
      document.getElementById('startStairDemonstration').className = 'navbar-inverse navbar-nav disabledA';
      document.getElementById('startButtonDFS').className = 'navbar-inverse navbar-nav disabledA';
      document.getElementById('startButtonBFS').className = 'navbar-inverse navbar-nav disabledA';
      document.getElementById('startButtonDijkstra').className = 'navbar-inverse navbar-nav disabledA';
      document.getElementById('startButtonAStar').className = 'navbar-inverse navbar-nav disabledA';
      document.getElementById('startButtonGreedy').className = 'navbar-inverse navbar-nav disabledA';
      document.getElementById('startButtonAStar2').className = 'navbar-inverse navbar-nav disabledA';
      document.getElementById('startButtonAStar3').className = 'navbar-inverse navbar-nav disabledA';
      document.getElementById('startButtonBidirectional').className = 'navbar-inverse navbar-nav disabledA';

      document.getElementById('actualStartButton').style.backgroundColor = 'rgb(185, 15, 15)';
    }
  }
}

let counter = 1;

const navbarHeight = $('#navbarDiv').height();
const textHeight = $('#mainText').height() + $('#algorithmDescriptor').height();
const height = Math.floor(($(document).height() - navbarHeight - textHeight) / 28);
const width = Math.floor($(document).width() / 25);
const newBoard = new Board(height, width);
newBoard.initialise();

window.onkeydown = (e) => {
  newBoard.keyDown = e.keyCode;
};

window.onkeyup = (e) => {
  newBoard.keyDown = false;
};

},{"./animations/launchAnimations":1,"./animations/launchInstantAnimations":2,"./animations/mazeGenerationAnimations":3,"./getDistance":5,"./mazeAlgorithms/otherMaze":6,"./mazeAlgorithms/otherOtherMaze":7,"./mazeAlgorithms/recursiveDivisionMaze":8,"./mazeAlgorithms/stairDemonstration":9,"./node":10,"./pathfindingAlgorithms/bidirectional":12,"./pathfindingAlgorithms/unweightedSearchAlgorithm":13,"./pathfindingAlgorithms/weightedSearchAlgorithm":14}],5:[function(require,module,exports){
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

module.exports = getDistance;

},{}],6:[function(require,module,exports){
const recursiveDivisionMaze = (board, rowStart, rowEnd, colStart, colEnd, orientation, surroundingWalls) => {
  if (rowEnd < rowStart || colEnd < colStart) {
    return;
  }
  if (!surroundingWalls) {
    const relevantIds = [board.start, board.target];
    if (board.object) relevantIds.push(board.object);
    Object.keys(board.nodes).forEach((node) => {
      if (!relevantIds.includes(node)) {
        const r = parseInt(node.split('-')[0]);
        const c = parseInt(node.split('-')[1]);
        if (r === 0 || c === 0 || r === board.height - 1 || c === board.width - 1) {
          const currentHTMLNode = document.getElementById(node);
          board.wallsToAnimate.push(currentHTMLNode);
          board.nodes[node].status = 'wall';
        }
      }
    });
    surroundingWalls = true;
  }
  if (orientation === 'horizontal') {
    const possibleRows = [];
    for (let number = rowStart; number <= rowEnd; number += 2) {
      possibleRows.push(number);
    }
    const possibleCols = [];
    for (let number = colStart - 1; number <= colEnd + 1; number += 2) {
      possibleCols.push(number);
    }
    const randomRowIndex = Math.floor(Math.random() * possibleRows.length);
    const randomColIndex = Math.floor(Math.random() * possibleCols.length);
    const currentRow = possibleRows[randomRowIndex];
    const colRandom = possibleCols[randomColIndex];
    Object.keys(board.nodes).forEach((node) => {
      const r = parseInt(node.split('-')[0]);
      const c = parseInt(node.split('-')[1]);
      if (r === currentRow && c !== colRandom && c >= colStart - 1 && c <= colEnd + 1) {
        const currentHTMLNode = document.getElementById(node);
        if (currentHTMLNode.className !== 'start' && currentHTMLNode.className !== 'target' && currentHTMLNode.className !== 'object') {
          board.wallsToAnimate.push(currentHTMLNode);
          board.nodes[node].status = 'wall';
        }
      }
    });
    if (currentRow - 2 - rowStart > colEnd - colStart) {
      recursiveDivisionMaze(board, rowStart, currentRow - 2, colStart, colEnd, orientation, surroundingWalls);
    } else {
      recursiveDivisionMaze(board, rowStart, currentRow - 2, colStart, colEnd, 'vertical', surroundingWalls);
    }
    if (rowEnd - (currentRow + 2) > colEnd - colStart) {
      recursiveDivisionMaze(board, currentRow + 2, rowEnd, colStart, colEnd, 'vertical', surroundingWalls);
    } else {
      recursiveDivisionMaze(board, currentRow + 2, rowEnd, colStart, colEnd, 'vertical', surroundingWalls);
    }
  } else {
    const possibleCols = [];
    for (let number = colStart; number <= colEnd; number += 2) {
      possibleCols.push(number);
    }
    const possibleRows = [];
    for (let number = rowStart - 1; number <= rowEnd + 1; number += 2) {
      possibleRows.push(number);
    }
    const randomColIndex = Math.floor(Math.random() * possibleCols.length);
    const randomRowIndex = Math.floor(Math.random() * possibleRows.length);
    const currentCol = possibleCols[randomColIndex];
    const rowRandom = possibleRows[randomRowIndex];
    Object.keys(board.nodes).forEach((node) => {
      const r = parseInt(node.split('-')[0]);
      const c = parseInt(node.split('-')[1]);
      if (c === currentCol && r !== rowRandom && r >= rowStart - 1 && r <= rowEnd + 1) {
        const currentHTMLNode = document.getElementById(node);
        if (currentHTMLNode.className !== 'start' && currentHTMLNode.className !== 'target' && currentHTMLNode.className !== 'object') {
          board.wallsToAnimate.push(currentHTMLNode);
          board.nodes[node].status = 'wall';
        }
      }
    });
    if (rowEnd - rowStart > currentCol - 2 - colStart) {
      recursiveDivisionMaze(board, rowStart, rowEnd, colStart, currentCol - 2, 'vertical', surroundingWalls);
    } else {
      recursiveDivisionMaze(board, rowStart, rowEnd, colStart, currentCol - 2, orientation, surroundingWalls);
    }
    if (rowEnd - rowStart > colEnd - (currentCol + 2)) {
      recursiveDivisionMaze(board, rowStart, rowEnd, currentCol + 2, colEnd, 'horizontal', surroundingWalls);
    } else {
      recursiveDivisionMaze(board, rowStart, rowEnd, currentCol + 2, colEnd, orientation, surroundingWalls);
    }
  }
};

module.exports = recursiveDivisionMaze;

},{}],7:[function(require,module,exports){
const recursiveDivisionMaze = (board, rowStart, rowEnd, colStart, colEnd, orientation, surroundingWalls) => {
  if (rowEnd < rowStart || colEnd < colStart) {
    return;
  }
  if (!surroundingWalls) {
    const relevantIds = [board.start, board.target];
    if (board.object) relevantIds.push(board.object);
    Object.keys(board.nodes).forEach((node) => {
      if (!relevantIds.includes(node)) {
        const r = parseInt(node.split('-')[0]);
        const c = parseInt(node.split('-')[1]);
        if (r === 0 || c === 0 || r === board.height - 1 || c === board.width - 1) {
          const currentHTMLNode = document.getElementById(node);
          board.wallsToAnimate.push(currentHTMLNode);
          board.nodes[node].status = 'wall';
        }
      }
    });
    surroundingWalls = true;
  }
  if (orientation === 'horizontal') {
    const possibleRows = [];
    for (let number = rowStart; number <= rowEnd; number += 2) {
      possibleRows.push(number);
    }
    const possibleCols = [];
    for (let number = colStart - 1; number <= colEnd + 1; number += 2) {
      possibleCols.push(number);
    }
    const randomRowIndex = Math.floor(Math.random() * possibleRows.length);
    const randomColIndex = Math.floor(Math.random() * possibleCols.length);
    const currentRow = possibleRows[randomRowIndex];
    const colRandom = possibleCols[randomColIndex];
    Object.keys(board.nodes).forEach((node) => {
      const r = parseInt(node.split('-')[0]);
      const c = parseInt(node.split('-')[1]);
      if (r === currentRow && c !== colRandom && c >= colStart - 1 && c <= colEnd + 1) {
        const currentHTMLNode = document.getElementById(node);
        if (currentHTMLNode.className !== 'start' && currentHTMLNode.className !== 'target' && currentHTMLNode.className !== 'object') {
          board.wallsToAnimate.push(currentHTMLNode);
          board.nodes[node].status = 'wall';
        }
      }
    });
    if (currentRow - 2 - rowStart > colEnd - colStart) {
      recursiveDivisionMaze(board, rowStart, currentRow - 2, colStart, colEnd, orientation, surroundingWalls);
    } else {
      recursiveDivisionMaze(board, rowStart, currentRow - 2, colStart, colEnd, 'horizontal', surroundingWalls);
    }
    if (rowEnd - (currentRow + 2) > colEnd - colStart) {
      recursiveDivisionMaze(board, currentRow + 2, rowEnd, colStart, colEnd, orientation, surroundingWalls);
    } else {
      recursiveDivisionMaze(board, currentRow + 2, rowEnd, colStart, colEnd, 'vertical', surroundingWalls);
    }
  } else {
    const possibleCols = [];
    for (let number = colStart; number <= colEnd; number += 2) {
      possibleCols.push(number);
    }
    const possibleRows = [];
    for (let number = rowStart - 1; number <= rowEnd + 1; number += 2) {
      possibleRows.push(number);
    }
    const randomColIndex = Math.floor(Math.random() * possibleCols.length);
    const randomRowIndex = Math.floor(Math.random() * possibleRows.length);
    const currentCol = possibleCols[randomColIndex];
    const rowRandom = possibleRows[randomRowIndex];
    Object.keys(board.nodes).forEach((node) => {
      const r = parseInt(node.split('-')[0]);
      const c = parseInt(node.split('-')[1]);
      if (c === currentCol && r !== rowRandom && r >= rowStart - 1 && r <= rowEnd + 1) {
        const currentHTMLNode = document.getElementById(node);
        if (currentHTMLNode.className !== 'start' && currentHTMLNode.className !== 'target' && currentHTMLNode.className !== 'object') {
          board.wallsToAnimate.push(currentHTMLNode);
          board.nodes[node].status = 'wall';
        }
      }
    });
    if (rowEnd - rowStart > currentCol - 2 - colStart) {
      recursiveDivisionMaze(board, rowStart, rowEnd, colStart, currentCol - 2, 'horizontal', surroundingWalls);
    } else {
      recursiveDivisionMaze(board, rowStart, rowEnd, colStart, currentCol - 2, 'horizontal', surroundingWalls);
    }
    if (rowEnd - rowStart > colEnd - (currentCol + 2)) {
      recursiveDivisionMaze(board, rowStart, rowEnd, currentCol + 2, colEnd, 'horizontal', surroundingWalls);
    } else {
      recursiveDivisionMaze(board, rowStart, rowEnd, currentCol + 2, colEnd, orientation, surroundingWalls);
    }
  }
};

module.exports = recursiveDivisionMaze;

},{}],8:[function(require,module,exports){
const recursiveDivisionMaze = (board, rowStart, rowEnd, colStart, colEnd, orientation, surroundingWalls, type) => {
  if (rowEnd < rowStart || colEnd < colStart) {
    return;
  }
  if (!surroundingWalls) {
    const relevantIds = [board.start, board.target];
    if (board.object) relevantIds.push(board.object);
    Object.keys(board.nodes).forEach((node) => {
      if (!relevantIds.includes(node)) {
        const r = parseInt(node.split('-')[0]);
        const c = parseInt(node.split('-')[1]);
        if (r === 0 || c === 0 || r === board.height - 1 || c === board.width - 1) {
          const currentHTMLNode = document.getElementById(node);
          board.wallsToAnimate.push(currentHTMLNode);
          if (type === 'wall') {
            board.nodes[node].status = 'wall';
            board.nodes[node].weight = 0;
          } else if (type === 'weight') {
            board.nodes[node].status = 'unvisited';
            board.nodes[node].weight = 15;
          }
        }
      }
    });
    surroundingWalls = true;
  }
  if (orientation === 'horizontal') {
    const possibleRows = [];
    for (let number = rowStart; number <= rowEnd; number += 2) {
      possibleRows.push(number);
    }
    const possibleCols = [];
    for (let number = colStart - 1; number <= colEnd + 1; number += 2) {
      possibleCols.push(number);
    }
    const randomRowIndex = Math.floor(Math.random() * possibleRows.length);
    const randomColIndex = Math.floor(Math.random() * possibleCols.length);
    const currentRow = possibleRows[randomRowIndex];
    const colRandom = possibleCols[randomColIndex];
    Object.keys(board.nodes).forEach((node) => {
      const r = parseInt(node.split('-')[0]);
      const c = parseInt(node.split('-')[1]);
      if (r === currentRow && c !== colRandom && c >= colStart - 1 && c <= colEnd + 1) {
        const currentHTMLNode = document.getElementById(node);
        if (currentHTMLNode.className !== 'start' && currentHTMLNode.className !== 'target' && currentHTMLNode.className !== 'object') {
          board.wallsToAnimate.push(currentHTMLNode);
          if (type === 'wall') {
            board.nodes[node].status = 'wall';
            board.nodes[node].weight = 0;
          } else if (type === 'weight') {
            board.nodes[node].status = 'unvisited';
            board.nodes[node].weight = 15;
          }
        }
      }
    });
    if (currentRow - 2 - rowStart > colEnd - colStart) {
      recursiveDivisionMaze(board, rowStart, currentRow - 2, colStart, colEnd, orientation, surroundingWalls, type);
    } else {
      recursiveDivisionMaze(board, rowStart, currentRow - 2, colStart, colEnd, 'vertical', surroundingWalls, type);
    }
    if (rowEnd - (currentRow + 2) > colEnd - colStart) {
      recursiveDivisionMaze(board, currentRow + 2, rowEnd, colStart, colEnd, orientation, surroundingWalls, type);
    } else {
      recursiveDivisionMaze(board, currentRow + 2, rowEnd, colStart, colEnd, 'vertical', surroundingWalls, type);
    }
  } else {
    const possibleCols = [];
    for (let number = colStart; number <= colEnd; number += 2) {
      possibleCols.push(number);
    }
    const possibleRows = [];
    for (let number = rowStart - 1; number <= rowEnd + 1; number += 2) {
      possibleRows.push(number);
    }
    const randomColIndex = Math.floor(Math.random() * possibleCols.length);
    const randomRowIndex = Math.floor(Math.random() * possibleRows.length);
    const currentCol = possibleCols[randomColIndex];
    const rowRandom = possibleRows[randomRowIndex];
    Object.keys(board.nodes).forEach((node) => {
      const r = parseInt(node.split('-')[0]);
      const c = parseInt(node.split('-')[1]);
      if (c === currentCol && r !== rowRandom && r >= rowStart - 1 && r <= rowEnd + 1) {
        const currentHTMLNode = document.getElementById(node);
        if (currentHTMLNode.className !== 'start' && currentHTMLNode.className !== 'target' && currentHTMLNode.className !== 'object') {
          board.wallsToAnimate.push(currentHTMLNode);
          if (type === 'wall') {
            board.nodes[node].status = 'wall';
            board.nodes[node].weight = 0;
          } else if (type === 'weight') {
            board.nodes[node].status = 'unvisited';
            board.nodes[node].weight = 15;
          }
        }
      }
    });
    if (rowEnd - rowStart > currentCol - 2 - colStart) {
      recursiveDivisionMaze(board, rowStart, rowEnd, colStart, currentCol - 2, 'horizontal', surroundingWalls, type);
    } else {
      recursiveDivisionMaze(board, rowStart, rowEnd, colStart, currentCol - 2, orientation, surroundingWalls, type);
    }
    if (rowEnd - rowStart > colEnd - (currentCol + 2)) {
      recursiveDivisionMaze(board, rowStart, rowEnd, currentCol + 2, colEnd, 'horizontal', surroundingWalls, type);
    } else {
      recursiveDivisionMaze(board, rowStart, rowEnd, currentCol + 2, colEnd, orientation, surroundingWalls, type);
    }
  }
};

module.exports = recursiveDivisionMaze;

},{}],9:[function(require,module,exports){
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

},{}],10:[function(require,module,exports){
class Node {
  constructor(id, status) {
    this.id = id;
    this.status = status;
    this.previousNode = null;
    this.path = null;
    this.direction = null;
    this.storedDirection = null;
    this.distance = Infinity;
    this.totalDistance = Infinity;
    this.heuristicDistance = null;
    this.weight = 0;
    this.relatesToObject = false;
    this.overwriteObjectRelation = false;

    this.otherid = id;
    this.otherstatus = status;
    this.otherpreviousNode = null;
    this.otherpath = null;
    this.otherdirection = null;
    this.otherstoredDirection = null;
    this.otherdistance = Infinity;
    this.otherweight = 0;
    this.otherrelatesToObject = false;
    this.otheroverwriteObjectRelation = false;
  }
}

module.exports = Node;

},{}],11:[function(require,module,exports){
const getDistance = (nodeOne, nodeTwo) => {
  const currentCoordinates = nodeOne.id.split('-');
  const targetCoordinates = nodeTwo.id.split('-');
  const x1 = parseInt(currentCoordinates[0]);
  const y1 = parseInt(currentCoordinates[1]);
  const x2 = parseInt(targetCoordinates[0]);
  const y2 = parseInt(targetCoordinates[1]);
  if (x2 < x1 && y1 === y2) {
    if (nodeOne.direction === 'up') {
      return [1, ['f'], 'up'];
    } else if (nodeOne.direction === 'right') {
      return [2, ['l', 'f'], 'up'];
    } else if (nodeOne.direction === 'left') {
      return [2, ['r', 'f'], 'up'];
    } else if (nodeOne.direction === 'down') {
      return [3, ['r', 'r', 'f'], 'up'];
    } else if (nodeOne.direction === 'up-right') {
      return [1.5, null, 'up'];
    } else if (nodeOne.direction === 'down-right') {
      return [2.5, null, 'up'];
    } else if (nodeOne.direction === 'up-left') {
      return [1.5, null, 'up'];
    } else if (nodeOne.direction === 'down-left') {
      return [2.5, null, 'up'];
    }
  } else if (x2 > x1 && y1 === y2) {
    if (nodeOne.direction === 'up') {
      return [3, ['r', 'r', 'f'], 'down'];
    } else if (nodeOne.direction === 'right') {
      return [2, ['r', 'f'], 'down'];
    } else if (nodeOne.direction === 'left') {
      return [2, ['l', 'f'], 'down'];
    } else if (nodeOne.direction === 'down') {
      return [1, ['f'], 'down'];
    } else if (nodeOne.direction === 'up-right') {
      return [2.5, null, 'down'];
    } else if (nodeOne.direction === 'down-right') {
      return [1.5, null, 'down'];
    } else if (nodeOne.direction === 'up-left') {
      return [2.5, null, 'down'];
    } else if (nodeOne.direction === 'down-left') {
      return [1.5, null, 'down'];
    }
  }
  if (y2 < y1 && x1 === x2) {
    if (nodeOne.direction === 'up') {
      return [2, ['l', 'f'], 'left'];
    } else if (nodeOne.direction === 'right') {
      return [3, ['l', 'l', 'f'], 'left'];
    } else if (nodeOne.direction === 'left') {
      return [1, ['f'], 'left'];
    } else if (nodeOne.direction === 'down') {
      return [2, ['r', 'f'], 'left'];
    } else if (nodeOne.direction === 'up-right') {
      return [2.5, null, 'left'];
    } else if (nodeOne.direction === 'down-right') {
      return [2.5, null, 'left'];
    } else if (nodeOne.direction === 'up-left') {
      return [1.5, null, 'left'];
    } else if (nodeOne.direction === 'down-left') {
      return [1.5, null, 'left'];
    }
  } else if (y2 > y1 && x1 === x2) {
    if (nodeOne.direction === 'up') {
      return [2, ['r', 'f'], 'right'];
    } else if (nodeOne.direction === 'right') {
      return [1, ['f'], 'right'];
    } else if (nodeOne.direction === 'left') {
      return [3, ['r', 'r', 'f'], 'right'];
    } else if (nodeOne.direction === 'down') {
      return [2, ['l', 'f'], 'right'];
    } else if (nodeOne.direction === 'up-right') {
      return [1.5, null, 'right'];
    } else if (nodeOne.direction === 'down-right') {
      return [1.5, null, 'right'];
    } else if (nodeOne.direction === 'up-left') {
      return [2.5, null, 'right'];
    } else if (nodeOne.direction === 'down-left') {
      return [2.5, null, 'right'];
    }
  }
};

const manhattanDistance = (nodeOne, nodeTwo) => {
  const nodeOneCoordinates = nodeOne.id.split('-').map((ele) => parseInt(ele));
  const nodeTwoCoordinates = nodeTwo.id.split('-').map((ele) => parseInt(ele));
  const xOne = nodeOneCoordinates[0];
  const xTwo = nodeTwoCoordinates[0];
  const yOne = nodeOneCoordinates[1];
  const yTwo = nodeTwoCoordinates[1];

  const xChange = Math.abs(xOne - xTwo);
  const yChange = Math.abs(yOne - yTwo);

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
    if (!currentClosest || currentClosest.totalDistance > nodes[unvisitedNodes[i]].totalDistance) {
      currentClosest = nodes[unvisitedNodes[i]];
      index = i;
    } else if (currentClosest.totalDistance === nodes[unvisitedNodes[i]].totalDistance) {
      if (currentClosest.heuristicDistance > nodes[unvisitedNodes[i]].heuristicDistance) {
        currentClosest = nodes[unvisitedNodes[i]];
        index = i;
      }
    }
  }
  unvisitedNodes.splice(index, 1);
  return currentClosest;
};

const updateNode = (currentNode, targetNode, actualTargetNode) => {
  const distance = getDistance(currentNode, targetNode);
  if (!targetNode.heuristicDistance) targetNode.heuristicDistance = manhattanDistance(targetNode, actualTargetNode);
  const distanceToCompare = currentNode.distance + targetNode.weight + distance[0];
  if (distanceToCompare < targetNode.distance) {
    targetNode.distance = distanceToCompare;
    targetNode.totalDistance = targetNode.distance + targetNode.heuristicDistance;
    targetNode.previousNode = currentNode.id;
    targetNode.path = distance[1];
    targetNode.direction = distance[2];
  }
};

const updateNeighbors = (nodes, node, boardArray, target) => {
  const neighbors = getNeighbors(node.id, nodes, boardArray);
  for (const neighbor of neighbors) {
    if (target) {
      updateNode(node, nodes[neighbor], nodes[target]);
    } else {
      updateNode(node, nodes[neighbor]);
    }
  }
};

const astar = (nodes, start, target, nodesToAnimate, boardArray) => {
  if (!start || !target || start === target) {
    return false;
  }
  nodes[start].distance = 0;
  nodes[start].totalDistance = 0;
  nodes[start].direction = 'up';
  const unvisitedNodes = Object.keys(nodes);
  while (unvisitedNodes.length) {
    let currentNode = closestNode(nodes, unvisitedNodes);
    while (currentNode.status === 'wall' && unvisitedNodes.length) {
      currentNode = closestNode(nodes, unvisitedNodes);
    }
    if (currentNode.distance === Infinity) return false;
    nodesToAnimate.push(currentNode);
    currentNode.status = 'visited';
    if (currentNode.id === target) {
      return 'success!';
    }
    updateNeighbors(nodes, currentNode, boardArray, target);
  }
};

module.exports = astar;

},{}],12:[function(require,module,exports){
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

},{"./astar":11}],13:[function(require,module,exports){
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

},{}],14:[function(require,module,exports){
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

},{"./astar":11}]},{},[4]);

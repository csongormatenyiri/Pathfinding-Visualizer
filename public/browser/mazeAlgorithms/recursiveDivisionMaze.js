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

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

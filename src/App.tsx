import React, { useState, useEffect } from 'react';

type GridSize = {
  width: number;
  length: number;
};

type Cell = {
  x: number;
  y: number;
  isBomb: boolean;
  isRevealed: boolean;
  isFlagged: boolean;
  adjacentBombs: number;
};

type BoxProps = {
  cell: Cell;
  onClick: (x: number, y: number) => void;
  onRightClick: (x: number, y: number) => void;
};

const bombCount: number = 20;

const Box: React.FC<BoxProps> = ({ cell, onClick, onRightClick }) => {
  const { x, y, isRevealed, isBomb, adjacentBombs, isFlagged } = cell;

  let display = '';
  if (isFlagged) display = '🚩';
  else if (isRevealed) display = isBomb ? '💣' : adjacentBombs ? adjacentBombs.toString() : '';

  return (
    <div
      className={`w-10 h-10 border flex items-center justify-center text-xs cursor-pointer select-none ${
        isRevealed ? 'bg-gray-200' : 'bg-gray-400'
      }`}
      onClick={() => onClick(x, y)}
      onContextMenu={(e) => {
        e.preventDefault();
        onRightClick(x, y);
      }}
    >
      {display}
    </div>
  );
};

const App: React.FC = () => {
  const [gridSize] = useState<GridSize>({ width: 16, length: 16 });
  const [grid, setGrid] = useState<Cell[][]>([]);
  const [gameOver, setGameOver] = useState(false);
  const [gameWon, setGameWon] = useState(false);

  useEffect(() => {
    resetGame();
  }, []);

  const resetGame = () => {
    const newGrid: Cell[][] = [];
    for (let y = 0; y < gridSize.length; y++) {
      const row: Cell[] = [];
      for (let x = 0; x < gridSize.width; x++) {
        row.push({
          x,
          y,
          isBomb: false,
          isRevealed: false,
          isFlagged: false,
          adjacentBombs: 0,
        });
      }
      newGrid.push(row);
    }

    let bombsPlaced = 0;
    while (bombsPlaced < bombCount) {
      const x = Math.floor(Math.random() * gridSize.width);
      const y = Math.floor(Math.random() * gridSize.length);

      if (!newGrid[y][x].isBomb) {
        newGrid[y][x].isBomb = true;
        bombsPlaced++;
      }
    }

    for (let y = 0; y < gridSize.length; y++) {
      for (let x = 0; x < gridSize.width; x++) {
        if (!newGrid[y][x].isBomb) {
          let count = 0;
          for (let dy = -1; dy <= 1; dy++) {
            for (let dx = -1; dx <= 1; dx++) {
              const nx = x + dx;
              const ny = y + dy;
              if (
                nx >= 0 &&
                nx < gridSize.width &&
                ny >= 0 &&
                ny < gridSize.length &&
                newGrid[ny][nx].isBomb
              ) {
                count++;
              }
            }
          }
          newGrid[y][x].adjacentBombs = count;
        }
      }
    }

    setGrid(newGrid);
    setGameOver(false);
    setGameWon(false);
  };

  const revealCell = (updatedGrid: Cell[][], x: number, y: number) => {
    const cell = updatedGrid[y][x];
    if (cell.isRevealed || cell.isFlagged) return;

    cell.isRevealed = true;

    if (cell.isBomb) {
      setGameOver(true);
      updatedGrid.forEach(row => row.forEach(c => (c.isRevealed = true)));
      setGrid(updatedGrid);
      return;
    }

    if (cell.adjacentBombs === 0) {
      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          const nx = x + dx;
          const ny = y + dy;
          if (
            nx >= 0 &&
            nx < gridSize.width &&
            ny >= 0 &&
            ny < gridSize.length
          ) {
            if (!updatedGrid[ny][nx].isRevealed && !updatedGrid[ny][nx].isBomb) {
              revealCell(updatedGrid, nx, ny);
            }
          }
        }
      }
    }
  };

  const handleClick = (x: number, y: number) => {
    if (gameOver || gameWon) return;
    const updatedGrid = grid.map(row => row.map(cell => ({ ...cell })));
    revealCell(updatedGrid, x, y);
    setGrid(updatedGrid);
    checkWin(updatedGrid);
  };

  const handleRightClick = (x: number, y: number) => {
    if (gameOver || gameWon) return;
    const updatedGrid = grid.map(row => row.map(cell => ({ ...cell })));
    const cell = updatedGrid[y][x];
    if (!cell.isRevealed) cell.isFlagged = !cell.isFlagged;
    setGrid(updatedGrid);
    checkWin(updatedGrid);
  };

  const checkWin = (grid: Cell[][]) => {
    const hasWon = grid.every(row =>
      row.every(cell =>
        (cell.isBomb && !cell.isRevealed) || (!cell.isBomb && cell.isRevealed)
      )
    );
    if (hasWon) {
      setGameWon(true);
      setGrid(grid.map(row => row.map(cell => ({ ...cell, isRevealed: true }))));
    }
  };

  return (
    <main className="p-4 flex flex-col items-center gap-4">
      <h1 className="text-2xl font-bold">Minesweeper</h1>
      <div className="flex flex-col">
        {grid.map((row, rowIndex) => (
          <div key={rowIndex} className="flex">
            {row.map(cell => (
              <Box
                key={`${cell.x}-${cell.y}`}
                cell={cell}
                onClick={handleClick}
                onRightClick={handleRightClick}
              />
            ))}
          </div>
        ))}
      </div>
      {gameOver && <div className="text-red-600 font-semibold">Game Over 💥</div>}
      {gameWon && <div className="text-green-600 font-semibold">You Win! 🎉</div>}
      <button
        className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        onClick={resetGame}
      >
        Restart
      </button>
    </main>
  );
};

export default App;

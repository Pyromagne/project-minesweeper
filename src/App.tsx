import React, { useState, useEffect } from 'react';
import Board from './game/components/Board';
import type { t_cell } from './game/minesweeper';
import { bombCount, boardSize } from './game/minesweeper';
import useGameEngine from './hooks/useGameEngine';

const App: React.FC = () => {
  const [board, setBoard] = useState<t_cell[][]>([]);
  const {gameOver, setGameOver, gameWon, setGameWon} = useGameEngine();

  useEffect(() => {
    resetGame();
  }, []);

  const resetGame = () => {
    const newBoard: t_cell[][] = [];
    for (let y = 0; y < boardSize.length; y++) {
      const row: t_cell[] = [];
      for (let x = 0; x < boardSize.width; x++) {
        row.push({
          x,
          y,
          isBomb: false,
          isRevealed: false,
          isFlagged: false,
          adjacentBombs: 0,
        });
      }
      newBoard.push(row);
    }

    let bombsPlaced = 0;
    while (bombsPlaced < bombCount) {
      const x = Math.floor(Math.random() * boardSize.width);
      const y = Math.floor(Math.random() * boardSize.length);

      if (!newBoard[y][x].isBomb) {
        newBoard[y][x].isBomb = true;
        bombsPlaced++;
      }
    }

    for (let y = 0; y < boardSize.length; y++) {
      for (let x = 0; x < boardSize.width; x++) {
        if (!newBoard[y][x].isBomb) {
          let count = 0;
          for (let dy = -1; dy <= 1; dy++) {
            for (let dx = -1; dx <= 1; dx++) {
              const nx = x + dx;
              const ny = y + dy;
              if (
                nx >= 0 &&
                nx < boardSize.width &&
                ny >= 0 &&
                ny < boardSize.length &&
                newBoard[ny][nx].isBomb
              ) {
                count++;
              }
            }
          }
          newBoard[y][x].adjacentBombs = count;
        }
      }
    }

    setBoard(newBoard);
    setGameOver(false);
    setGameWon(false);
  };

  const revealCell = (updateBoard: t_cell[][], x: number, y: number) => {
    const cell = updateBoard[y][x];
    if (cell.isRevealed || cell.isFlagged) return;

    cell.isRevealed = true;

    if (cell.isBomb) {
      setGameOver(true);
      updateBoard.forEach(row => row.forEach(c => (c.isRevealed = true)));
      setBoard(updateBoard);
      return;
    }

    if (cell.adjacentBombs === 0) {
      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          const nx = x + dx;
          const ny = y + dy;
          if (
            nx >= 0 &&
            nx < boardSize.width &&
            ny >= 0 &&
            ny < boardSize.length
          ) {
            if (!updateBoard[ny][nx].isRevealed && !updateBoard[ny][nx].isBomb) {
              revealCell(updateBoard, nx, ny);
            }
          }
        }
      }
    }
  };

  const handleClick = (x: number, y: number) => {
    if (gameOver || gameWon) return;
    const updatedGrid = board.map(row => row.map(cell => ({ ...cell })));
    revealCell(updatedGrid, x, y);
    setBoard(updatedGrid);
    checkWin(updatedGrid);
  };

  const handleRightClick = (x: number, y: number) => {
    if (gameOver || gameWon) return;
    const updatedGrid = board.map(row => row.map(cell => ({ ...cell })));
    const cell = updatedGrid[y][x];
    if (!cell.isRevealed) cell.isFlagged = !cell.isFlagged;
    setBoard(updatedGrid);
    checkWin(updatedGrid);
  };

  const checkWin = (grid: t_cell[][]) => {
    const hasWon = grid.every(row =>
      row.every(cell =>
        (cell.isBomb && !cell.isRevealed) || (!cell.isBomb && cell.isRevealed)
      )
    );
    if (hasWon) {
      setGameWon(true);
      setBoard(grid.map(row => row.map(cell => ({ ...cell, isRevealed: true }))));
    }
  };

  return (
    <main className="p-4 flex flex-col items-center gap-4">
      <h1 className="text-2xl font-bold">Minesweeper</h1>
      <Board board={board} onClick={handleClick} onRightClick={handleRightClick} />
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

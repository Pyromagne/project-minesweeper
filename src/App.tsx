import { useEffect, useState } from 'react';
import Board from './game/components/Board';
import type { t_cell } from './game/minesweeper';
import useGameEngine from './hooks/useGameEngine';
import { useStopwatch } from './hooks/useStopWatch';
import { revealCell } from './game/revealCell';
import { pad } from './game/minesweeper';
import { difficultiesName } from './game/difficulties';
import { useStorage } from './hooks/useStorage';

const App = () => {
  const { board, setBoard, gameOver, setGameOver, gameWon, setGameWon, gameBoard, bombCount, setDifficulty } = useGameEngine();
  const { hours, minutes, seconds, milliseconds, start, pause, reset } = useStopwatch();
  const { name, setName } = useStorage();
  const [openMenuOverlay, setOpenMenuOverlay] = useState<boolean>(false);

  useEffect(() => {
    resetGame();
  }, [gameBoard]);

  const resetGame = () => {
    reset();
    const newBoard: t_cell[][] = [];
    for (let y = 0; y < gameBoard.height; y++) {
      const row: t_cell[] = [];
      for (let x = 0; x < gameBoard.width; x++) {
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
      const x = Math.floor(Math.random() * gameBoard.width);
      const y = Math.floor(Math.random() * gameBoard.height);

      if (!newBoard[y][x].isBomb) {
        newBoard[y][x].isBomb = true;
        bombsPlaced++;
      }
    }

    for (let y = 0; y < gameBoard.height; y++) {
      for (let x = 0; x < gameBoard.width; x++) {
        if (!newBoard[y][x].isBomb) {
          let count = 0;
          for (let dy = -1; dy <= 1; dy++) {
            for (let dx = -1; dx <= 1; dx++) {
              const nx = x + dx;
              const ny = y + dy;
              if (
                nx >= 0 &&
                nx < gameBoard.width &&
                ny >= 0 &&
                ny < gameBoard.height &&
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

  const handleLeftClick = (x: number, y: number) => {
    if (seconds === 0) {
      start();
    }
    if (gameOver || gameWon) return;

    const updatedBoard = board.map(row => row.map(cell => ({ ...cell })));
    const result = revealCell(updatedBoard, x, y, gameBoard);

    setBoard(result.board);

    if (result.gameOver) {
      setGameOver(true);
      setOpenMenuOverlay(true);
      pause();
    } else {
      checkWin(result.board);
    }
  };


  const handleRightClick = (x: number, y: number) => {
    if (gameOver || gameWon) return;
    const updatedBoard = board.map(row => row.map(cell => ({ ...cell })));
    const cell = updatedBoard[y][x];
    if (!cell.isRevealed) cell.isFlagged = !cell.isFlagged;
    setBoard(updatedBoard);
    checkWin(updatedBoard);
  };

  const checkWin = (board: t_cell[][]) => {
    const hasWon = board.every(row =>
      row.every(cell =>
        (cell.isBomb && !cell.isRevealed) || (!cell.isBomb && cell.isRevealed)
      )
    );
    if (hasWon) {
      setGameWon(true);
      setBoard(board.map(row => row.map(cell => ({ ...cell, isRevealed: true }))));
      pause();
    }
  };

  return (
    <div className="flex min-h-svh azeret-mono background-default">
      <aside className='w-1/5 h-svh flex flex-col items-center py-2 pl-2'>
        <h1 className="text-2xl font-bold">Project Minesweeper</h1>
        <div>
          {difficultiesName.map((diff, index) => {
            return <button key={index} onClick={() => setDifficulty(diff)} className={`m-1 p-2 rounded ${gameBoard.name === diff ? 'bg-amber-400' : ''}`}>{diff}</button>
          })}
        </div>

        <p className='mt-auto azeret-mono w-full'>Created by Pyromagne</p>
      </aside>

      <main className='w-3/5 h-svh relative flex flex-col items-center'>
        <p className='azeret-mono text-center mt-4 text-2xl'>{`${pad(hours)}:${pad(minutes)}:${pad(seconds)}:${pad(milliseconds)}`}</p>

        <div className='mt-6'>
          <Board board={board} onLeftClick={handleLeftClick} onRightClick={handleRightClick} />
        </div>

        {/* <div className={`absolute w-full h-full flex flex-col items-center justify-center backdrop-blur-sm ${openMenuOverlay ? 'block' : 'hidden'}`}>
          {gameOver && <div className="text-red-600 font-semibold text-4xl tracking-wider background-default w-full text-center py-10">Game Over</div>}
          {gameWon && <div className="text-green-600 font-semibold">You Win!</div>}
        </div> */}

        <div className='absolute bottom-0 right-0 mb-2 mr-2'>
          <input type="text"
            className='w-fit outline-none text-right'
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
      </main>

      <aside className='w-1/5 h-svh py-2 flex flex-col'>
        <p>Global Scoreboard</p>
        <p>Local ScoreBoard</p>

        <div className='mt-auto mr-2'>
          <button
            className="mt-2 px-4 py-2 bg-amber-400 rounded w-full"
            onClick={pause}
          >
            Pause
          </button>
          <button
            className="mt-2 px-4 py-2 bg-amber-400 rounded  w-full"
            onClick={resetGame}
          >
            {gameOver ? 'Retry' : 'Restart'}
          </button>
        </div>
      </aside>
    </div>
  );
};

export default App;

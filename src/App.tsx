import { useEffect } from 'react';
import Board from './game/components/Board';
import type { t_cell } from './game/minesweeper';
import useGameEngine from './hooks/useGameEngine';
import { useStopwatch } from './hooks/useStopWatch';
import { revealCell } from './game/revealCell';
import { pad } from './game/minesweeper';
import { difficultiesName } from './game/difficulties';
import { useStorage } from './hooks/useStorage';
import timestampToString from './game/utils/TimestampToString';
import timestampToMilliseconds from './game/utils/timestampToMilliseconds';

const App = () => {
  const { board, setBoard, gameOver, setGameOver, gameWon, setGameWon, gameBoard, bombCount, setDifficulty } = useGameEngine();
  const { hours, minutes, seconds, milliseconds, start, pause, reset, time } = useStopwatch();
  const { name, setName, scores, addScore } = useStorage();

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
    if (!gameOver) {
      start();
    }

    if (gameOver || gameWon) return;

    const updatedBoard = board.map(row => row.map(cell => ({ ...cell })));
    const result = revealCell(updatedBoard, x, y, gameBoard);

    setBoard(result.board);

    if (result.gameOver) {
      setGameOver(true);
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
      addScore({ name: name, difficulty: gameBoard.name, timestamp: timestampToString(time), date: new Date().toISOString() });
    }
  };

  return (
    <div className="flex min-h-svh azeret-mono background-default">
      <aside className='w-1/5 h-svh flex flex-col items-center py-2 pl-2'>
        <h1 className="text-xl font-bold azeret-mono">
          <span className='text-amber-400 bg-black px-2'>PROJECT</span>
          <span className='text-red-400 bg-white pl-2'>[mine]</span><span className='text-green-400 bg-white pr-2'>sweeper</span></h1>
        <div>
          {difficultiesName.map((diff, index) => {
            return <button key={index} onClick={() => setDifficulty(diff)} className={`m-1 p-2 rounded text-sm ${gameBoard.name === diff ? 'bg-amber-400' : 'hover:bg-amber-500 cursor-pointer'}`}>{diff}</button>
          })}
        </div>

        <p className='mt-auto azeret-mono w-full'>Created by <span className='text-red-400 font-medium'>Pyromagne</span></p>
      </aside>

      <main className='w-3/5 h-svh relative flex flex-col items-center'>
        <p className='azeret-mono text-center mt-4 text-2xl'>{`${pad(hours)}:${pad(minutes)}:${pad(seconds)}:${pad(milliseconds)}`}</p>

        <div className='mt-6'>
          <Board board={board} onLeftClick={handleLeftClick} onRightClick={handleRightClick} />
        </div>

        <div className='absolute bottom-0 right-0 mb-2 mr-2'>
          <input type="text"
            className='w-fit outline-none text-right'
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
      </main>

      <aside className='w-1/5 h-svh py-2 flex flex-col'>
        <p className='bg-amber-300 font-medium px-2'>Global Scoreboard</p>
        <ul className="text-sm max-h-72 overflow-y-auto">

        </ul>
        <p className='bg-amber-300 font-medium px-2'>Local ScoreBoard</p>
        <ul className="text-sm max-h-72 overflow-y-auto pl-2">
          {scores
            .slice()
            .sort(
              (a, b) =>
                timestampToMilliseconds(a.timestamp) -
                timestampToMilliseconds(b.timestamp)
            )
            .map((score, index) => (
              <li key={index} className='truncate'>
                {`${score.timestamp} - ${score.name} [${score.difficulty}]`}
              </li>
            ))}
        </ul>

        <div className='mt-auto mr-2'>
          {gameOver && <p className="azeret-mono text-red-400 font-semibold text-4xl tracking-wider w-full text-center">GAME OVER</p>}
          {gameWon && <p className="azeret-mono text-green-400 font-semibold text-4xl tracking-wider w-full text-center">YOU WIN</p>}
          <button
            className="mt-2 px-4 py-2 bg-amber-400 rounded w-full hover:bg-amber-500 cursor-pointer"
            onClick={(pause)}
          >
            Pause
          </button>
          <button
            className="mt-2 px-4 py-2 bg-amber-400 rounded  w-full hover:bg-amber-500 cursor-pointer"
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

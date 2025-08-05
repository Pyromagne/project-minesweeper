import { useState } from "react";
import type { board, t_cell } from "../game/minesweeper";
import { difficulties, normal_board } from "../game/difficulties";
import { bombsByDensity } from "../game/generateBombCount";

const useGameEngine = () => {
    const [board, setBoard] = useState<t_cell[][]>([]);
    const [gameOver, setGameOver] = useState<boolean>(false);
    const [gameWon, setGameWon] = useState<boolean>(false);
    const [gameBoard, setGameBoard] = useState<board>(normal_board);

    function setDifficulty(diff: string): void {
        const match = difficulties.find((D) => D.name.toLowerCase() === diff.toLowerCase());
        if (!match) {
            throw new Error(`Difficulty "${diff}" not found.`);
        } else setGameBoard(match);
    }

    const bombCount: number = bombsByDensity(gameBoard.width, gameBoard.height);

    return {
        board, setBoard,
        gameOver, setGameOver,
        gameWon, setGameWon,
        gameBoard, setGameBoard,

        bombCount,
        difficulties,
        setDifficulty
    }
}

export default useGameEngine;
import { useState } from "react";
import type { t_cell } from "../game/minesweeper";

const useGameEngine = () => {
    const [board, setBoard] = useState<t_cell[][]>([]);
    const [gameOver, setGameOver] = useState<boolean>(false);
    const [gameWon, setGameWon] = useState<boolean>(false);

    return {
        board, setBoard,
        gameOver, setGameOver,
        gameWon, setGameWon
    }
}

export default useGameEngine;
import { useState } from "react";

const useGameEngine = () => {
    const [gameOver, setGameOver] = useState<boolean>(false);
    const [gameWon, setGameWon] = useState<boolean>(false);

    return {
        gameOver, setGameOver,
        gameWon, setGameWon
    }
}

export default useGameEngine;
import type { t_cell, board } from "./minesweeper";

type RevealResult = {
    board: t_cell[][];
    gameOver: boolean;
};

/**
 * Logic for revealing cells recursively
 * @param board 
 * @param x 
 * @param y 
 * @returns 
 */
export const revealCell = ( board: t_cell[][], x: number, y: number, boardSize: board ): RevealResult => {
    let newBoard = structuredClone(board);
    const cell = newBoard[y][x];

    if (cell.isRevealed || cell.isFlagged) {
        return { board: newBoard, gameOver: false };
    }

    cell.isRevealed = true;

    let gameOver = false;
    if (cell.isBomb) {
        gameOver = true;
        newBoard.forEach(row => row.forEach(c => (c.isRevealed = true)));
        return { board: newBoard, gameOver };
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
                    ny < boardSize.height
                ) {
                    if (!newBoard[ny][nx].isRevealed && !newBoard[ny][nx].isBomb) {
                        const result = revealCell(newBoard, nx, ny, boardSize);
                        newBoard = result.board;
                        gameOver = gameOver || result.gameOver;
                    }
                }
            }
        }
    }

    return { board: newBoard, gameOver };
};
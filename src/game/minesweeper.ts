export type t_cell = {
    x: number;
    y: number;
    isBomb: boolean;
    isRevealed: boolean;
    isFlagged: boolean;
    adjacentBombs: number;
};

export const boardSize = {
    width: 10,
    length: 10
};

export const icon = {
    flag: '🚩',
    bomb: '💣'
}

export const bombCount: number = 20;
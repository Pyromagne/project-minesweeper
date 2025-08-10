export type t_cell = {
    x: number;
    y: number;
    isBomb: boolean;
    isRevealed: boolean;
    isFlagged: boolean;
    adjacentBombs: number;
};

export type t_timestamp = {
    hours: number;
    minutes: number;
    seconds: number;
    milliseconds: number;
}

export type board = {
    name: string;
    width: number;
    height: number;
}

export const icon = {
    flag: '🚩',
    bomb: '💣'
}

export function pad(n: number, size = 2): string {
    return n.toString().padStart(size, '0');
}
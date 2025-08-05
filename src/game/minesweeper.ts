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

export function getTimestamp(time: t_timestamp): string {
    const { hours, minutes, seconds, milliseconds } = time;
    const pad = (num: number, size = 2) => num.toString().padStart(size, '0');
    const padMs = (num: number) => num.toString().padStart(3, '0');

    return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}.${padMs(milliseconds)}`;
}

export const icon = {
    flag: '🚩',
    bomb: '💣'
}

export function pad(n: number, size = 2): string {
    return n.toString().padStart(size, '0');
}